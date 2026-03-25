package com.japaneixxx.pmp.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "medico_paciente",
        uniqueConstraints = @UniqueConstraint(columnNames = {"medico_id", "paciente_id"}))
@Data
@NoArgsConstructor
public class MedicoPaciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "medico_id", nullable = false)
    private Usuario medico;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Usuario paciente;

    private LocalDateTime vinculadoEm = LocalDateTime.now();
}