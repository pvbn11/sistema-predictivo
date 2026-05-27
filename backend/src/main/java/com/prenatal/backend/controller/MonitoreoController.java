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
    private final com.prenatal.backend.service.MonitoreoService monitoreoService;

    public MonitoreoController(MonitoreoRepository monitoreoRepository, com.prenatal.backend.service.MonitoreoService monitoreoService) {
        this.monitoreoRepository = monitoreoRepository;
        this.monitoreoService = monitoreoService;
    }

    @GetMapping("/patient/{patientId}")
    public List<Monitoreo> getMonitoreosByPatient(@PathVariable Long patientId) {
        return monitoreoRepository.findByPaciente_IdPacienteOrderByFechaMonitoreoDesc(patientId);
    }

    @PostMapping("/predict")
    public ResponseEntity<?> predictAndSaveMonitoreo(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam("escalaX") int escalaX,
            @RequestParam("pacienteId") Long pacienteId,
            @RequestParam("medicoId") Long medicoId) {
        try {
            Monitoreo savedMonitoreo = monitoreoService.procesarYGuardarMonitoreo(file, escalaX, pacienteId, medicoId);
            return ResponseEntity.ok(savedMonitoreo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }
}
