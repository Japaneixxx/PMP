package com.japaneixxx.pmp.service;

import com.japaneixxx.pmp.model.Prescricao;
import com.japaneixxx.pmp.model.Usuario;
import com.japaneixxx.pmp.repository.PrescricaoRepository;
import com.japaneixxx.pmp.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PrescricaoRepository prescricaoRepository;
    @Transactional
    public Usuario criarUsuario(String nome){
        Usuario novoUser = new Usuario(nome);

        return usuarioRepository.save(novoUser);
    }
    @Transactional
    public Usuario getUsuarioById(String usuarioNome){
        return (Usuario) usuarioRepository.findByNome(usuarioNome).orElse(null);
    }

    @Transactional
    public Usuario addPrescricao(int usuarioId, Prescricao prescricao){
        Usuario usuarioManaged = usuarioRepository.findById(usuarioId).orElseThrow(() -> new RuntimeException("Usuario Nao Encontrado"));
        usuarioManaged.getPrescricoes().add(prescricao);
        prescricao.setUsuario(usuarioManaged);


        return  usuarioRepository.save(usuarioManaged);
    }
    //visualizar prescricao
    @Transactional
    public Prescricao visualizarPrescricao(int idPrescricao) {
        return prescricaoRepository.findById(idPrescricao).orElse(null);
    }
    @Transactional
    public List<Prescricao> getPrescricoes(int usuarioId){
        return prescricaoRepository.findByUsuarioId(usuarioId);
    }

    @Transactional
    public void changeStatus(int usuarioId,int index, boolean status) {
        getPrescricoes(usuarioId).get(index).setAtivo(status);
    }


//    public void visualizarPrescricao(int index) {
//        System.out.println(
//                "> Nome: " + prescricoes.get(index).getRemedio() + "\n"
//                        + "> Dosagem: " + prescricoes.get(index).getDosagem()+ "\n"
//                        + "> Intervalo: " + prescricoes.get(index).getIntervalo() + "\n"
//                        + "> Horario de Inicio: " + prescricoes.get(index).getHorarioInicio() + "\n"
//                        + "> Continua tomando: " + prescricoes.get(index).getAtivo() + "\n"
//        );
//    }
}
