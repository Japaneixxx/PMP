package com.japaneixxx.pmp.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "exames")
@Data
@NoArgsConstructor
public class Exame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "consulta_id", nullable = true)
    private Consulta consulta;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private String nome; // "Raio-X Tórax", "Hemograma", etc.

    @Enumerated(EnumType.STRING)
    private TipoExame tipo;

    private String descricao;

    // URL do arquivo no Supabase Storage
    private String arquivoUrl;
    private String arquivoNome;
    private String arquivoTipo; // "image/jpeg", "application/pdf", etc.
    private Long arquivoTamanho;

    @Column(updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    public enum TipoExame {
        IMAGEM,      // Raio-X, Tomografia, Ressonância
        LABORATORIAL, // Hemograma, Glicemia, etc.
        LAUDO,        // PDF de laudo
        OUTRO
    }
}
