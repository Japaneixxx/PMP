package com.japaneixxx.pmp.repository;

import com.japaneixxx.pmp.model.Prescricao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescricaoRepository extends JpaRepository<Prescricao, Integer> {

    List<Prescricao> findByUsuarioId(int usuarioId);
}
