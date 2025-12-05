package com.prenatal.backend.config;

import com.prenatal.backend.model.Medico;
import com.prenatal.backend.model.Paciente;
import com.prenatal.backend.repository.MedicoRepository;
import com.prenatal.backend.repository.PacienteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.ClassPathResource;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(MedicoRepository medicoRepo, PacienteRepository pacienteRepo,
            com.prenatal.backend.repository.MonitoreoRepository monitoreoRepo) {
        return args -> {
            Medico medico = medicoRepo.findByUsuario("dra.rodriguez").orElse(null);

            if (medico == null) {
                medico = new Medico();
                medico.setUsuario("dra.rodriguez");
                medico.setPassword("password123"); // In real app, hash this!
                medico.setNombres("Ana");
                medico.setApellidos("Rodríguez");
                medico.setTitulo("Dra.");
                medico.setEspecialidad("Ginecología y Obstetricia");
                medico.setFechaAltaUsuario(LocalDateTime.now());
                medicoRepo.save(medico);
                System.out.println("Medico seeded: dra.rodriguez");
            }

            // Allow seeding if patients are empty or specific ones missing
            if (pacienteRepo.count() == 0) {
                // Seed Patients from Dashboard
                // 1. María González García
                Paciente p1 = new Paciente(null, "María", "González García", "12345678", LocalDate.of(1990, 5, 15),
                        LocalDate.of(2024, 12, 14), LocalDateTime.now(), medico);
                // 2. Carmen López Martín
                Paciente p2 = new Paciente(null, "Carmen", "López Martín", "87654321", LocalDate.of(1985, 8, 20),
                        LocalDate.of(2024, 11, 29), LocalDateTime.now(), medico);
                // 3. Ana Fernández Ruiz
                Paciente p3 = new Paciente(null, "Ana", "Fernández Ruiz", "11223344", LocalDate.of(1993, 2, 10),
                        LocalDate.of(2025, 1, 19), LocalDateTime.now(), medico);

                pacienteRepo.save(p1);
                pacienteRepo.save(p2);
                pacienteRepo.save(p3);
                System.out.println("Dashboard Patients seeded");
            }

            // SEEDING REQUESTED BY USER: María González García (Specific DNI)
            if (pacienteRepo.findByDni("44445555").isEmpty()) {
                Paciente maria = new Paciente(null, "María", "González García", "44445555",
                        LocalDate.of(1995, 3, 15), LocalDate.of(2025, 5, 20), LocalDateTime.now(), medico);
                maria = pacienteRepo.save(maria);

                try {
                    ClassPathResource imgFile = new ClassPathResource("ctg_sample.jpg");
                    byte[] imgBytes = null;
                    if (imgFile.exists()) {
                        imgBytes = imgFile.getContentAsByteArray();
                    }
                    com.prenatal.backend.model.Monitoreo mon = new com.prenatal.backend.model.Monitoreo();
                    mon.setMedico(medico);
                    mon.setPaciente(maria);
                    mon.setFechaMonitoreo(LocalDateTime.now().minusDays(2));
                    mon.setNivelRiesgo("Patológico");
                    mon.setObservaciones("Patrón reactivo, continuar seguimiento.");
                    mon.setImagenCtg(imgBytes);

                    monitoreoRepo.save(mon);
                    System.out.println("Seeded Monitoreo for María González García (44445555)");
                } catch (Exception e) {
                    System.err.println("Failed to seed image: " + e.getMessage());
                }
            }

            // Maria Perez block removed to restore system stability
        };
    }
}
