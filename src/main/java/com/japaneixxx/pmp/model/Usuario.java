package com.japaneixxx.pmp.model;


public class Usuario {

    private String nome;

    private Prescricao[] prescricoes;

    //Functions
    public void addPrescricao(Prescricao prescricao) {
        Prescricao[] novasPrescricoes = new Prescricao[prescricoes.length + 1];
        System.arraycopy(prescricoes, 0, novasPrescricoes, 0, prescricoes.length);
        novasPrescricoes[novasPrescricoes.length - 1] = prescricao;
        prescricoes = novasPrescricoes;
    }
    public void visualizarPrescricao(int index) {
//            System.out.println(prescricoes[index].getRemedio());
//            System.out.println(prescricoes[index].getDosagem());
//            System.out.println(prescricoes[index].getIntervalo());
//            System.out.println(prescricoes[index].getHorarioInicio());
//            System.out.println(prescricoes[index].getAtivo());
            System.out.println(
                      "> Nome: " + prescricoes[index].getRemedio() + "\n"
                    + "> Dosagem: " + prescricoes[index].getDosagem()+ "\n"
                    + "> Intervalo: " + prescricoes[index].getIntervalo() + "\n"
                    + "> Horario de Inicio: " + prescricoes[index].getHorarioInicio() + "\n"
                    + "> Continua tomando: " + prescricoes[index].getAtivo() + "\n"
            );
    }

    public void changeStatus(int index, boolean status) {
        getPrescricoes()[index].setAtivo(status);
    }

    //Constructor
    public Usuario(String nome) {
        this.nome = nome;
        this.prescricoes = new Prescricao[0];
    }

    //Getters and Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Prescricao[] getPrescricoes() {
        return prescricoes;
    }

    public void setPrescricoes(Prescricao[] prescricoes) {
        this.prescricoes = prescricoes;
    }
}
