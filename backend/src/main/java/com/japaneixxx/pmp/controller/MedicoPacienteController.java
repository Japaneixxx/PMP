package com.japaneixxx.pmp.controller;

import com.japaneixxx.pmp.model.MedicoPaciente;
import com.japaneixxx.pmp.model.Usuario;
import com.japaneixxx.pmp.repository.MedicoPacienteRepository;
import com.japaneixxx.pmp.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/meus-pacientes")
public class MedicoPacienteController {

    private final MedicoPacienteRepository medicoPacienteRepository;
    private final UsuarioRepository usuarioRepository;

    public MedicoPacienteController(MedicoPacienteRepository medicoPacienteRepository,
                                    UsuarioRepository usuarioRepository) {
        this.medicoPacienteRepository = medicoPacienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // Lista pacientes do médico
    @GetMapping
    public ResponseEntity<?> listar(@AuthenticationPrincipal Usuario medico) {
        if (medico.getPerfil() != Usuario.TipoPerfil.MEDICO) {
            return ResponseEntity.status(403).body("Sem permissão");
        }
        List<Usuario> pacientes = medicoPacienteRepository
                .findByMedicoId(medico.getId())
                .stream()
                .map(MedicoPaciente::getPaciente)
                .toList();
        return ResponseEntity.ok(pacientes);
    }

    // Vincular paciente por ID
    @PostMapping("/vincular/{pacienteId}")
    public ResponseEntity<?> vincular(@PathVariable Long pacienteId,
                                      @AuthenticationPrincipal Usuario medico) {
        if (medico.getPerfil() != Usuario.TipoPerfil.MEDICO) {
            return ResponseEntity.status(403).body("Sem permissão");
        }

        var paciente = usuarioRepository.findById(pacienteId).orElse(null);
        if (paciente == null) return ResponseEntity.badRequest().body("Paciente não encontrado");
        if (paciente.getPerfil() != Usuario.TipoPerfil.PACIENTE) {
            return ResponseEntity.badRequest().body("Usuário não é paciente");
        }
        if (medicoPacienteRepository.existsByMedicoIdAndPacienteId(medico.getId(), pacienteId)) {
            return ResponseEntity.badRequest().body("Paciente já vinculado");
        }

        var vinculo = new MedicoPaciente();
        vinculo.setMedico(medico);
        vinculo.setPaciente(paciente);
        medicoPacienteRepository.save(vinculo);

        return ResponseEntity.ok(paciente);
    }

    // Desvincular paciente
    @Transactional
    @DeleteMapping("/desvincular/{pacienteId}")
    public ResponseEntity<?> desvincular(@PathVariable Long pacienteId,
                                         @AuthenticationPrincipal Usuario medico) {
        medicoPacienteRepository.deleteByMedicoIdAndPacienteId(medico.getId(), pacienteId);
        return ResponseEntity.noContent().build();
    }
}