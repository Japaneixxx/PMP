package com.japaneixxx.pmp.controller;

import com.japaneixxx.pmp.model.Consulta;
import com.japaneixxx.pmp.repository.ConsultaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

// Endpoint público — acessado pelo QR Code sem precisar de login
@RestController
@RequestMapping("/api/compartilhar")
public class CompartilharController {

    private final ConsultaRepository consultaRepository;

    public CompartilharController(ConsultaRepository consultaRepository) {
        this.consultaRepository = consultaRepository;
    }

    @GetMapping("/{token}")
    public ResponseEntity<?> acessarPorToken(@PathVariable String token) {
        var consulta = consultaRepository.findByTokenCompartilhamento(token).orElse(null);

        if (consulta == null) {
            return ResponseEntity.notFound().build();
        }

        if (consulta.getTokenExpiracao() != null &&
            consulta.getTokenExpiracao().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(410).body("Link expirado");
        }

        if (consulta.getStatus() != Consulta.StatusConsulta.FINALIZADA) {
            return ResponseEntity.status(403).body("Consulta não finalizada");
        }

        return ResponseEntity.ok(consulta);
    }

    // Médico renova o token (gera novo QR Code)
    @PostMapping("/{consultaId}/renovar")
    public ResponseEntity<?> renovarToken(@PathVariable Long consultaId) {
        var consulta = consultaRepository.findById(consultaId).orElse(null);
        if (consulta == null) return ResponseEntity.notFound().build();

        consulta.setTokenExpiracao(LocalDateTime.now().plusDays(30));
        consultaRepository.save(consulta);

        return ResponseEntity.ok(consulta.getTokenCompartilhamento());
    }
}
