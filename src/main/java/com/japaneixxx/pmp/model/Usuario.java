package com.japaneixxx.pmp.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table (name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column (name = "nome")
    private String nome;
    @OneToMany(
            mappedBy = "usuario",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Prescricao> prescricoes;

//    private Prescricao[] prescricoes;

    public Usuario() {

    }

    //Functions

//    public void addPrescricao(Prescricao prescricao) {
//        Prescricao[] novasPrescricoes = new Prescricao[prescricoes.length + 1];
//        System.arraycopy(prescricoes, 0, novasPrescricoes, 0, prescricoes.length);
//        novasPrescricoes[novasPrescricoes.length - 1] = prescricao;
//        prescricoes = novasPrescricoes;
//    }


    public void changeStatus(int index, boolean status) {
        getPrescricoes().get(index).setAtivo(status);
    }

    //Constructor
    public Usuario(String nome) {
        this.nome = nome;
        this.prescricoes = new ArrayList<>();
    }

    //Getters and Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public List<Prescricao> getPrescricoes() {
        return prescricoes;
    }

    public void setPrescricoes(List<Prescricao> prescricoes) {
        this.prescricoes = prescricoes;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }
}
