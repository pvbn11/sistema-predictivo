
package com.prenatal.backend.controller;

import com.prenatal.backend.model.Paciente;
import com.prenatal.backend.model.Medico;
import com.prenatal.backend.repository.PacienteRepository;
import com.prenatal.backend.repository.MedicoRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PacienteRepository pacienteRepository;
    private final MedicoRepository medicoRepository;

    public PatientController(PacienteRepository pacienteRepository, MedicoRepository medicoRepository) {
        this.pacienteRepository = pacienteRepository;
        this.medicoRepository = medicoRepository;
    }

    @GetMapping
    public List<Paciente> getAllPatients() {
        return pacienteRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> getPatientById(@PathVariable Long id) {
        return pacienteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createPatient(@RequestBody Paciente paciente) {
        // Validate Medico
        if (paciente.getMedico() == null || paciente.getMedico().getIdMedico() == null) {
            return ResponseEntity.badRequest().body("El paciente debe tener un médico asignado.");
        }

        // Fetch Medico to ensure it exists and is attached
        Medico medico = medicoRepository.findById(paciente.getMedico().getIdMedico())
                .orElseThrow(() -> new RuntimeException("Médico no encontrado"));

        paciente.setMedico(medico);

        try {
            Paciente saved = pacienteRepository.save(paciente);
            return ResponseEntity.ok(saved);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(409).body("Ya existe una paciente registrada con este DNI");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al guardar paciente: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Long id, @RequestBody Paciente patientDetails) {
        return pacienteRepository.findById(id).map(patient -> {
            patient.setNombres(patientDetails.getNombres());
            patient.setApellidos(patientDetails.getApellidos());
            patient.setFechaNacimiento(patientDetails.getFechaNacimiento());
            patient.setFechaProbableParto(patientDetails.getFechaProbableParto());

            // Should we update Medico? Not requested, so leaving as is.

            Paciente updatedPatient = pacienteRepository.save(patient);
            return ResponseEntity.ok(updatedPatient);
        }).orElse(ResponseEntity.notFound().build());
    }
}
