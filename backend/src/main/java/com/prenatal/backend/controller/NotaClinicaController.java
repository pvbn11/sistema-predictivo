package com.prenatal.backend.controller;

import com.prenatal.backend.model.NotaClinica;
import com.prenatal.backend.repository.NotaClinicaRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notas")
public class NotaClinicaController {

    private final NotaClinicaRepository notaClinicaRepository;
    private final jakarta.persistence.EntityManager entityManager;

    public NotaClinicaController(NotaClinicaRepository notaClinicaRepository, jakarta.persistence.EntityManager entityManager) {
        this.notaClinicaRepository = notaClinicaRepository;
        this.entityManager = entityManager;
    }

    @GetMapping("/patient/{patientId}")
    public List<NotaClinica> getNotasByPatient(@PathVariable Long patientId) {
        return notaClinicaRepository.findByPaciente_IdPacienteOrderByFechaNotaDesc(patientId);
    }

    @PostMapping
    @org.springframework.transaction.annotation.Transactional
    public NotaClinica createNota(@RequestBody NotaClinica nota) {
        NotaClinica saved = notaClinicaRepository.saveAndFlush(nota);
        entityManager.refresh(saved);
        return saved;
    }

    @PutMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional
    public NotaClinica updateNota(@PathVariable Long id, @RequestBody NotaClinica notaDetails) {
        return notaClinicaRepository.findById(id).map(nota -> {
            nota.setContenido(notaDetails.getContenido());
            nota.setFechaNota(java.time.LocalDateTime.now());
            if (notaDetails.getMedico() != null) {
                nota.setMedico(notaDetails.getMedico());
            }
            NotaClinica saved = notaClinicaRepository.saveAndFlush(nota);
            entityManager.refresh(saved);
            return saved;
        }).orElseThrow(() -> new RuntimeException("Nota no encontrada con id " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteNota(@PathVariable Long id) {
        notaClinicaRepository.deleteById(id);
    }
}
