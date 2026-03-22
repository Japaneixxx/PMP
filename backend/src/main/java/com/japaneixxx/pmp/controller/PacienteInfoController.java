package com.japaneixxx.pmp.controller;

import com.japaneixxx.pmp.model.PacienteInfo;
import com.japaneixxx.pmp.model.Usuario;
import com.japaneixxx.pmp.repository.PacienteInfoRepository;
import com.japaneixxx.pmp.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/paciente-info")
public class PacienteInfoController {

    private final PacienteInfoRepository pacienteInfoRepository;
    private final UsuarioRepository usuarioRepository;

    public PacienteInfoController(PacienteInfoRepository pacienteInfoRepository,
                                  UsuarioRepository usuarioRepository) {
        this.pacienteInfoRepository = pacienteInfoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    record PacienteInfoRequest(
            String tipoSanguineo,
            String alergias,
            String comorbidades,
            String cirurgiasPrevias,
            String historicoFamiliar,
            String contextoSocial,
            String observacoes
    ) {}

    record HistoricoResponse(
            UsuarioPacienteDTO paciente,
            PacienteInfo info
    ) {}

    record UsuarioPacienteDTO(
            Long id,
            String nome,
            String email,
            String telefone
    ) {}

    // Buscar informações do próprio paciente
    @Transactional
    @GetMapping("/me")
    public ResponseEntity<?> getMinhasInfo(@AuthenticationPrincipal Usuario usuarioAuth) {
        Usuario usuario = usuarioRepository.findById(usuarioAuth.getId()).orElse(null);
        if (usuario == null) return ResponseEntity.status(401).build();

        var info = pacienteInfoRepository.findByUsuarioId(usuario.getId())
                .orElseGet(() -> {
                    var nova = new PacienteInfo();
                    nova.setUsuario(usuario);
                    return pacienteInfoRepository.save(nova);
                });
        return ResponseEntity.ok(info);
    }

    // Médico busca informações de um paciente
    @Transactional
    @GetMapping("/{pacienteId}")
    public ResponseEntity<?> getInfoPaciente(@PathVariable Long pacienteId,
                                             @AuthenticationPrincipal Usuario usuarioAuth) {
        Usuario medico = usuarioRepository.findById(usuarioAuth.getId()).orElse(null);
        if (medico == null || medico.getPerfil() != Usuario.TipoPerfil.MEDICO) {
            return ResponseEntity.status(403).body("Sem permissao");
        }

        Usuario paciente = usuarioRepository.findById(pacienteId).orElse(null);
        if (paciente == null) return ResponseEntity.notFound().build();

        var info = pacienteInfoRepository.findByUsuarioId(pacienteId)
                .orElseGet(() -> {
                    var nova = new PacienteInfo();
                    nova.setUsuario(paciente);
                    return pacienteInfoRepository.save(nova);
                });
        return ResponseEntity.ok(info);
    }

    // Médico busca histórico completo do paciente
    @Transactional
    @GetMapping("/historico/{pacienteId}")
    public ResponseEntity<?> getHistoricoCompleto(@PathVariable Long pacienteId,
                                                  @AuthenticationPrincipal Usuario usuarioAuth) {
        Usuario medico = usuarioRepository.findById(usuarioAuth.getId()).orElse(null);
        if (medico == null || medico.getPerfil() != Usuario.TipoPerfil.MEDICO) {
            return ResponseEntity.status(403).body("Sem permissao");
        }

        Usuario paciente = usuarioRepository.findById(pacienteId).orElse(null);
        if (paciente == null) return ResponseEntity.notFound().build();

        var info = pacienteInfoRepository.findByUsuarioId(pacienteId).orElse(null);

        return ResponseEntity.ok(new HistoricoResponse(toDTO(paciente), info));
    }

    // Salvar/atualizar informações do próprio paciente
    @Transactional
    @PutMapping("/me")
    public ResponseEntity<?> salvarInfo(@RequestBody PacienteInfoRequest req,
                                        @AuthenticationPrincipal Usuario usuarioAuth) {
        Usuario usuario = usuarioRepository.findById(usuarioAuth.getId()).orElse(null);
        if (usuario == null) return ResponseEntity.status(401).build();

        var info = pacienteInfoRepository.findByUsuarioId(usuario.getId())
                .orElseGet(() -> {
                    var nova = new PacienteInfo();
                    nova.setUsuario(usuario);
                    return nova;
                });

        info.setTipoSanguineo(req.tipoSanguineo());
        info.setAlergias(req.alergias());
        info.setComorbidades(req.comorbidades());
        info.setCirurgiasPrevias(req.cirurgiasPrevias());
        info.setHistoricoFamiliar(req.historicoFamiliar());
        info.setContextoSocial(req.contextoSocial());
        info.setObservacoes(req.observacoes());
        info.setAtualizadoEm(LocalDateTime.now());

        return ResponseEntity.ok(pacienteInfoRepository.save(info));
    }

    private UsuarioPacienteDTO toDTO(Usuario u) {
        return new UsuarioPacienteDTO(u.getId(), u.getNome(), u.getEmail(), u.getTelefone());
    }
}