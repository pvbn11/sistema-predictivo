package com.prenatal.backend.controller;

import com.prenatal.backend.model.Medico;
import com.prenatal.backend.repository.MedicoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final MedicoRepository medicoRepository;

    public DoctorController(MedicoRepository medicoRepository) {
        this.medicoRepository = medicoRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medico> getDoctor(@PathVariable Long id) {
        return medicoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> updatePassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        Optional<Medico> medicoOpt = medicoRepository.findById(id);

        if (medicoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Medico medico = medicoOpt.get();

        if (!medico.getPassword().equals(currentPassword)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Contraseña actual incorrecta"));
        }

        medico.setPassword(newPassword);
        medico.setFechaCambioPassword(LocalDateTime.now());
        medicoRepository.save(medico);

        return ResponseEntity.ok(Map.of("message", "Contraseña actualizada exitosamente"));
    }
}
