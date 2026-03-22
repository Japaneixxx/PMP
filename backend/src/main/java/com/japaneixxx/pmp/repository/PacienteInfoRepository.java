package com.japaneixxx.pmp.repository;

import com.japaneixxx.pmp.model.PacienteInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PacienteInfoRepository extends JpaRepository<PacienteInfo, Long> {
    Optional<PacienteInfo> findByUsuarioId(Long usuarioId);
}