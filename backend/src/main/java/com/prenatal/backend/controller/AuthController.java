package com.prenatal.backend.controller;

import com.prenatal.backend.model.Medico;
import com.prenatal.backend.repository.MedicoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final MedicoRepository medicoRepository;

    public AuthController(MedicoRepository medicoRepository) {
        this.medicoRepository = medicoRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<Medico> medico = medicoRepository.findByUsuario(username);

        if (medico.isPresent() && medico.get().getPassword().equals(password)) {
            // In a real app, return JWT token here
            return ResponseEntity.ok(Map.of("message", "Login successful", "medico", medico.get()));
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }
    }
}
