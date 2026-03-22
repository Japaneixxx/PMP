package com.japaneixxx.pmp.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescricoes")
@Data
@NoArgsConstructor
public class Prescricao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "consulta_id")
    private Consulta consulta; // prescrição pode vir de uma consulta

    @Column(nullable = false)
    private String remedio;

    @Column(nullable = false)
    private String dosagem;

    @Column(nullable = false)
    private int intervaloHoras;

    @Column(nullable = false)
    private LocalTime horarioInicio;

    private LocalDate dataInicio;
    private LocalDate dataFim;

    private boolean ativo = true;
    private String observacoes;

    @Column(updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();
}
