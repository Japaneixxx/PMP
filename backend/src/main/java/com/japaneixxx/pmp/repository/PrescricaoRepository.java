package com.japaneixxx.pmp.repository;

import com.japaneixxx.pmp.model.Prescricao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PrescricaoRepository extends JpaRepository<Prescricao, Long> {
    List<Prescricao> findByUsuarioIdOrderByAtivoDescRemedioAsc(Long usuarioId);
    List<Prescricao> findByConsultaId(Long consultaId);
}
