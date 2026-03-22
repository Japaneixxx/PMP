package com.japaneixxx.pmp.repository;

import com.japaneixxx.pmp.model.MedicoPaciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicoPacienteRepository extends JpaRepository<MedicoPaciente, Long> {
    List<MedicoPaciente> findByMedicoId(Long medicoId);
    boolean existsByMedicoIdAndPacienteId(Long medicoId, Long pacienteId);
    void deleteByMedicoIdAndPacienteId(Long medicoId, Long pacienteId);
}