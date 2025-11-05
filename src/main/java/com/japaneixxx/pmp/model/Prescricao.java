package com.japaneixxx.pmp.model;



import java.time.LocalTime;
import java.util.Date;

public class Prescricao {

    private String remedio;
    private String dosagem;
    private int intervalo;
    private boolean ativo = true;
    private LocalTime horarioInicio;
    private Date dataInicio;
    private Date dataFim;

    //Functions


    @Override
    public String toString() {
        return "Prescricao{" +
                "remedio='" + remedio + '\'' +
                ", dosagem='" + dosagem + '\'' +
                ", intervalo=" + intervalo +
                ", ativo=" + ativo +
                ", horarioInicio=" + horarioInicio +
                ", dataInicio=" + dataInicio +
                ", dataFim=" + dataFim +
                '}';
    }

    //Constructor
    public Prescricao(String remedio, String dosagem, int intervalo, LocalTime horarioInicio) {
        this.remedio = remedio;
        this.dosagem = dosagem;
        this.intervalo = intervalo;
        this.horarioInicio = horarioInicio;
    }

    public Prescricao(String remedio, String dosagem, int intervalo, LocalTime horarioInicio, Date dataInicio, Date dataFim) {
        this.remedio = remedio;
        this.dosagem = dosagem;
        this.intervalo = intervalo;
        this.horarioInicio = horarioInicio;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
    }

    //Getters and Setters
    public String getRemedio() {
        return remedio;
    }

    public void setRemedio(String remedio) {
        this.remedio = remedio;
    }

    public String getDosagem() {
        return dosagem;
    }

    public void setDosagem(String dosagem) {
        this.dosagem = dosagem;
    }

    public int getIntervalo() {
        return intervalo;
    }

    public void setIntervalo(int intervalo) {
        this.intervalo = intervalo;
    }

    public Date getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(Date dataInicio) {
        this.dataInicio = dataInicio;
    }

    public Date getDataFim() {
        return dataFim;
    }

    public void setDataFim(Date dataFim) {
        this.dataFim = dataFim;
    }

    public boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public LocalTime getHorarioInicio() {
        return horarioInicio;
    }

    public void setHorarioInicio(LocalTime horarioInicio) {
        this.horarioInicio = horarioInicio;
    }
}
