package com.prenatal.backend.repository;

import com.prenatal.backend.model.Monitoreo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MonitoreoRepository extends JpaRepository<Monitoreo, Long> {
    List<Monitoreo> findByPaciente_IdPacienteOrderByFechaMonitoreoDesc(Long idPaciente);
}
