package com.japaneixxx.pmp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "consultas")
@Data
@NoArgsConstructor
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "medico_id", nullable = false)
    private Usuario medico;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Usuario paciente;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    private String queixaPrincipal;

    @Column(columnDefinition = "TEXT")
    private String anamnese;

    @Column(columnDefinition = "TEXT")
    private String exameFisico;

    @Column(columnDefinition = "TEXT")
    private String diagnostico;

    @Column(columnDefinition = "TEXT")
    private String planoTratamento;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    // Token único para compartilhamento via QR Code
    @Column(unique = true)
    private String tokenCompartilhamento;

    private LocalDateTime tokenExpiracao;

    @Enumerated(EnumType.STRING)
    private StatusConsulta status = StatusConsulta.RASCUNHO;

    @OneToMany(mappedBy = "consulta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Prescricao> prescricoes;

    @OneToMany(mappedBy = "consulta", cascade = CascadeType.ALL, fetch =  FetchType.LAZY)
    @JsonIgnore
    private List<Exame> exames;

    @Column(updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    @PrePersist
    public void gerarToken() {
        if (this.tokenCompartilhamento == null) {
            this.tokenCompartilhamento = UUID.randomUUID().toString().replace("-", "").substring(0, 12);
            this.tokenExpiracao = LocalDateTime.now().plusDays(30);
        }
    }

    public enum StatusConsulta {
        RASCUNHO, FINALIZADA
    }
}
