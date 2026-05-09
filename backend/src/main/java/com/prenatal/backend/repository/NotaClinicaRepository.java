package com.prenatal.backend.repository;

import com.prenatal.backend.model.NotaClinica;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotaClinicaRepository extends JpaRepository<NotaClinica, Long> {
    List<NotaClinica> findByPaciente_IdPacienteOrderByFechaNotaDesc(Long idPaciente);
}
