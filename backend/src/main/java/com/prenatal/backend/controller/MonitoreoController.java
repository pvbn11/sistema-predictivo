package com.prenatal.backend.controller;

import com.prenatal.backend.model.Monitoreo;
import com.prenatal.backend.repository.MonitoreoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/monitoreos")
public class MonitoreoController {

    private final MonitoreoRepository monitoreoRepository;

    public MonitoreoController(MonitoreoRepository monitoreoRepository) {
        this.monitoreoRepository = monitoreoRepository;
    }

    @GetMapping("/patient/{patientId}")
    public List<Monitoreo> getMonitoreosByPatient(@PathVariable Long patientId) {
        return monitoreoRepository.findByPaciente_IdPacienteOrderByFechaMonitoreoDesc(patientId);
    }
}
