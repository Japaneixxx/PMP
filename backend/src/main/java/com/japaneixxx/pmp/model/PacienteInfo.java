package com.japaneixxx.pmp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "paciente_info")
@Data
@NoArgsConstructor
public class PacienteInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    @JsonIgnore
    private Usuario usuario;

    private String tipoSanguineo; // A+, A-, B+, B-, AB+, AB-, O+, O-

    @Column(columnDefinition = "TEXT")
    private String alergias;

    @Column(columnDefinition = "TEXT")
    private String comorbidades;

    @Column(columnDefinition = "TEXT")
    private String historicoFamiliar;

    @Column(columnDefinition = "TEXT")
    private String contextoSocial; // moradia, trabalho, habitos

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(columnDefinition = "TEXT")
    private String cirurgiasPrevias;

    private LocalDateTime atualizadoEm = LocalDateTime.now();
}