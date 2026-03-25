package com.japaneixxx.pmp.repository;

import com.japaneixxx.pmp.model.Exame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExameRepository extends JpaRepository<Exame, Long> {
    List<Exame> findByConsultaIdOrderByCriadoEmDesc(Long consultaId);
    List<Exame> findByUsuarioIdOrderByCriadoEmDesc(Long usuarioId);
}
