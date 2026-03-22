package com.japaneixxx.pmp.controller;

import com.japaneixxx.pmp.model.Consulta;
import com.japaneixxx.pmp.model.Consulta.StatusConsulta;
import com.japaneixxx.pmp.model.Usuario;
import com.japaneixxx.pmp.repository.ConsultaRepository;
import com.japaneixxx.pmp.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/consultas")
public class ConsultaController {

    private final ConsultaRepository consultaRepository;
    private final UsuarioRepository usuarioRepository;

    public ConsultaController(ConsultaRepository consultaRepository,
                               UsuarioRepository usuarioRepository) {
        this.consultaRepository = consultaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    record ConsultaRequest(
            Long pacienteId, // removido @NotNull
            @NotNull LocalDateTime dataHora,
            String queixaPrincipal,
            String anamnese,
            String exameFisico,
            String diagnostico,
            String planoTratamento,
            String observacoes
    ) {}

    // Médico cria consulta
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody ConsultaRequest req,
                                    @AuthenticationPrincipal Usuario medico) {
        if (medico.getPerfil() != Usuario.TipoPerfil.MEDICO) {
            return ResponseEntity.status(403).body("Apenas médicos podem criar consultas");
        }

        var paciente = usuarioRepository.findById(req.pacienteId()).orElse(null);
        if (paciente == null) return ResponseEntity.badRequest().body("Paciente não encontrado");

        var consulta = new Consulta();
        consulta.setMedico(medico);
        consulta.setPaciente(paciente);
        consulta.setDataHora(req.dataHora());
        consulta.setQueixaPrincipal(req.queixaPrincipal());
        consulta.setAnamnese(req.anamnese());
        consulta.setExameFisico(req.exameFisico());
        consulta.setDiagnostico(req.diagnostico());
        consulta.setPlanoTratamento(req.planoTratamento());
        consulta.setObservacoes(req.observacoes());

        return ResponseEntity.ok(consultaRepository.save(consulta));
    }

    // Médico atualiza consulta
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @Valid @RequestBody ConsultaRequest req,
                                       @AuthenticationPrincipal Usuario medico) {
        var consulta = consultaRepository.findById(id).orElse(null);
        if (consulta == null) return ResponseEntity.notFound().build();
        if (!consulta.getMedico().getId().equals(medico.getId())) {
            return ResponseEntity.status(403).body("Sem permissão");
        }

        // Mantém o paciente original se não vier no request
        if (req.pacienteId() != null) {
            var paciente = usuarioRepository.findById(req.pacienteId()).orElse(null);
            if (paciente != null) consulta.setPaciente(paciente);
        }

        consulta.setDataHora(req.dataHora());
        consulta.setQueixaPrincipal(req.queixaPrincipal());
        consulta.setAnamnese(req.anamnese());
        consulta.setExameFisico(req.exameFisico());
        consulta.setDiagnostico(req.diagnostico());
        consulta.setPlanoTratamento(req.planoTratamento());
        consulta.setObservacoes(req.observacoes());

        return ResponseEntity.ok(consultaRepository.save(consulta));
    }

    // Finalizar consulta (gera QR Code)
    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<?> finalizar(@PathVariable Long id,
                                        @AuthenticationPrincipal Usuario medico) {
        var consulta = consultaRepository.findById(id).orElse(null);
        if (consulta == null) return ResponseEntity.notFound().build();
        if (!consulta.getMedico().getId().equals(medico.getId())) {
            return ResponseEntity.status(403).body("Sem permissão");
        }

        consulta.setStatus(StatusConsulta.FINALIZADA);
        return ResponseEntity.ok(consultaRepository.save(consulta));
    }

    // Minhas consultas (médico vê suas consultas, paciente vê as dele)
    @GetMapping
    public List<Consulta> minhasConsultas(@AuthenticationPrincipal Usuario usuario) {
        if (usuario.getPerfil() == Usuario.TipoPerfil.MEDICO) {
            return consultaRepository.findByMedicoIdOrderByDataHoraDesc(usuario.getId());
        } else {
            return consultaRepository.findByPacienteIdOrderByDataHoraDesc(usuario.getId());
        }
    }

    // Histórico do paciente (médico vê)
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<?> historicoPaciente(@PathVariable Long pacienteId,
                                                @AuthenticationPrincipal Usuario medico) {
        if (medico.getPerfil() != Usuario.TipoPerfil.MEDICO) {
            return ResponseEntity.status(403).body("Sem permissão");
        }
        return ResponseEntity.ok(
                consultaRepository.findHistoricoPacientePorMedico(pacienteId, medico.getId())
        );
    }

    // Detalhes de uma consulta
    @GetMapping("/{id}")
    public ResponseEntity<?> detalhes(@PathVariable Long id,
                                       @AuthenticationPrincipal Usuario usuario) {
        var consulta = consultaRepository.findById(id).orElse(null);
        if (consulta == null) return ResponseEntity.notFound().build();

        boolean temAcesso = consulta.getMedico().getId().equals(usuario.getId()) ||
                            consulta.getPaciente().getId().equals(usuario.getId());
        if (!temAcesso) return ResponseEntity.status(403).body("Sem permissão");

        return ResponseEntity.ok(consulta);
    }

    // Medico remove consultas
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id,
                                     @AuthenticationPrincipal Usuario medico) {
        var consulta = consultaRepository.findById(id).orElse(null);
        if (consulta == null) return ResponseEntity.notFound().build();
        if (!consulta.getMedico().getId().equals(medico.getId()))
            return ResponseEntity.status(403).body("Sem permissão");

        consultaRepository.delete(consulta);
        return ResponseEntity.noContent().build();
    }

    // Médico vê consultas do paciente
    @Transactional
    @GetMapping("/paciente/{pacienteId}/todas")
    public ResponseEntity<?> consultasDoPaciente(@PathVariable Long pacienteId,
                                                 @AuthenticationPrincipal Usuario usuarioAuth) {
        Usuario medico = usuarioRepository.findById(usuarioAuth.getId()).orElse(null);
        if (medico == null || medico.getPerfil() != Usuario.TipoPerfil.MEDICO) {
            return ResponseEntity.status(403).body("Sem permissao");
        }
        return ResponseEntity.ok(
                consultaRepository.findByPacienteIdOrderByDataHoraDesc(pacienteId)
        );
    }
}
