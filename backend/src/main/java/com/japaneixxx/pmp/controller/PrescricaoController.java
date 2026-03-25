package com.japaneixxx.pmp.controller;

import com.japaneixxx.pmp.model.Exame;
import com.japaneixxx.pmp.model.Prescricao;
import com.japaneixxx.pmp.model.Usuario;
import com.japaneixxx.pmp.repository.*;
import com.japaneixxx.pmp.storage.SupabaseStorageService;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PrescricaoController {

    private final PrescricaoRepository prescricaoRepository;
    private final ConsultaRepository consultaRepository;
    private final ExameRepository exameRepository;
    private final SupabaseStorageService storageService;
    private final UsuarioRepository usuarioRepository;
    private final MedicoPacienteRepository medicoPacienteRepository;

    public PrescricaoController(PrescricaoRepository prescricaoRepository,
                                ConsultaRepository consultaRepository,
                                ExameRepository exameRepository,
                                SupabaseStorageService storageService,
                                UsuarioRepository usuarioRepository,
                                MedicoPacienteRepository medicoPacienteRepository) {
        this.prescricaoRepository = prescricaoRepository;
        this.consultaRepository = consultaRepository;
        this.exameRepository = exameRepository;
        this.storageService = storageService;
        this.usuarioRepository = usuarioRepository;
        this.medicoPacienteRepository = medicoPacienteRepository;
    }

    // === PRESCRIÇÕES ===

    @GetMapping("/prescricoes")
    public List<Prescricao> minhasPrescricoes(@AuthenticationPrincipal Usuario usuario) {
        return prescricaoRepository.findByUsuarioIdOrderByAtivoDescRemedioAsc(usuario.getId());
    }

    @Transactional
    @PostMapping("/prescricoes")
    public ResponseEntity<?> criarPrescricao(@RequestBody PrescricaoRequest req,
                                             @AuthenticationPrincipal Usuario usuarioAuth) {
        // Recarrega o usuário dentro da sessão JPA
        Usuario usuario = usuarioRepository.findById(usuarioAuth.getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        var p = new Prescricao();
        p.setUsuario(usuario);
        p.setRemedio(req.remedio());
        p.setDosagem(req.dosagem());
        p.setIntervaloHoras(req.intervaloHoras());
        p.setHorarioInicio(LocalTime.parse(req.horarioInicio()));
        if (req.dataInicio() != null) p.setDataInicio(LocalDate.parse(req.dataInicio()));
        if (req.dataFim() != null) p.setDataFim(LocalDate.parse(req.dataFim()));
        p.setObservacoes(req.observacoes());

        if (req.consultaId() != null) {
            consultaRepository.findById(req.consultaId()).ifPresent(p::setConsulta);
        }

        return ResponseEntity.ok(prescricaoRepository.save(p));
    }

    @PatchMapping("/prescricoes/{id}/status")
    public ResponseEntity<?> alterarStatus(@PathVariable Long id,
                                            @RequestParam boolean ativo,
                                            @AuthenticationPrincipal Usuario usuario) {
        var p = prescricaoRepository.findById(id).orElse(null);
        if (p == null) return ResponseEntity.notFound().build();
        if (!p.getUsuario().getId().equals(usuario.getId())) return ResponseEntity.status(403).build();

        p.setAtivo(ativo);
        return ResponseEntity.ok(prescricaoRepository.save(p));
    }

    @DeleteMapping("/prescricoes/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id,
                                      @AuthenticationPrincipal Usuario usuario) {
        var p = prescricaoRepository.findById(id).orElse(null);
        if (p == null) return ResponseEntity.notFound().build();
        if (!p.getUsuario().getId().equals(usuario.getId())) return ResponseEntity.status(403).build();

        prescricaoRepository.delete(p);
        return ResponseEntity.noContent().build();
    }

    // === EXAMES ===

    @GetMapping("/exames")
    public List<Exame> meusExames(@AuthenticationPrincipal Usuario usuario) {
        return exameRepository.findByUsuarioIdOrderByCriadoEmDesc(usuario.getId());
    }

    @Transactional
    @PostMapping("/exames")
    public ResponseEntity<?> uploadExame(@RequestParam("arquivo") MultipartFile arquivo,
                                          @RequestParam("nome") String nome,
                                          @RequestParam("tipo") String tipo,
                                          @RequestParam(value = "descricao", required = false) String descricao,
                                          @RequestParam(value = "consultaId", required = false) Long consultaId,
                                          @AuthenticationPrincipal Usuario usuario) {
        String url = storageService.uploadArquivo(arquivo, usuario.getId());

        var exame = new Exame();
        exame.setUsuario(usuario);
        exame.setNome(nome);
        exame.setTipo(Exame.TipoExame.valueOf(tipo));
        exame.setDescricao(descricao);
        exame.setArquivoUrl(url);
        exame.setArquivoNome(arquivo.getOriginalFilename());
        exame.setArquivoTipo(arquivo.getContentType());
        exame.setArquivoTamanho(arquivo.getSize());

        if (consultaId != null) {
            consultaRepository.findById(consultaId).ifPresent(exame::setConsulta);
        }

        return ResponseEntity.ok(exameRepository.save(exame));
    }

    @DeleteMapping("/exames/{id}")
    public ResponseEntity<?> deletarExame(@PathVariable Long id,
                                           @AuthenticationPrincipal Usuario usuario) {
        var exame = exameRepository.findById(id).orElse(null);
        if (exame == null) return ResponseEntity.notFound().build();
        if (!exame.getUsuario().getId().equals(usuario.getId())) return ResponseEntity.status(403).build();

        storageService.deletarArquivo(exame.getArquivoUrl());
        exameRepository.delete(exame);
        return ResponseEntity.noContent().build();
    }

    record PrescricaoRequest(
            String remedio,
            String dosagem,
            int intervaloHoras,
            String horarioInicio,
            String dataInicio,
            String dataFim,
            String observacoes,
            Long consultaId
    ) {}

    // === USUARIOS ===

    @GetMapping("/usuarios/pacientes")
    public ResponseEntity<?> listarMeusPacientes(@AuthenticationPrincipal Usuario medico) {
        List<Usuario> pacientes = medicoPacienteRepository
                .findByMedicoId(medico.getId())
                .stream()
                .map(mp -> mp.getPaciente())
                .toList();
        return ResponseEntity.ok(pacientes);
    }

    // Médico vê prescrições do paciente
    @Transactional
    @GetMapping("/prescricoes/paciente/{pacienteId}")
    public ResponseEntity<?> prescricoesDoPaciente(@PathVariable Long pacienteId,
                                                   @AuthenticationPrincipal Usuario usuarioAuth) {
        Usuario medico = usuarioRepository.findById(usuarioAuth.getId()).orElse(null);
        if (medico == null || medico.getPerfil() != Usuario.TipoPerfil.MEDICO) {
            return ResponseEntity.status(403).body("Sem permissao");
        }
        return ResponseEntity.ok(
                prescricaoRepository.findByUsuarioIdOrderByAtivoDescRemedioAsc(pacienteId)
        );
    }

}
