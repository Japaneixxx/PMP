package com.japaneixxx.pmp.repository;

import com.japaneixxx.pmp.model.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {

    // Consultas onde o usuário é paciente
    List<Consulta> findByPacienteIdOrderByDataHoraDesc(Long pacienteId);

    // Consultas escritas pelo médico
    List<Consulta> findByMedicoIdOrderByDataHoraDesc(Long medicoId);

    // Buscar por token de compartilhamento (QR Code)
    Optional<Consulta> findByTokenCompartilhamento(String token);

    // Histórico completo do paciente visto pelo médico
    @Query("SELECT c FROM Consulta c WHERE c.paciente.id = :pacienteId AND c.medico.id = :medicoId ORDER BY c.dataHora DESC")
    List<Consulta> findHistoricoPacientePorMedico(Long pacienteId, Long medicoId);
}
