package com.prenatal.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pacientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Paciente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPaciente;

    private String nombres;
    private String apellidos;

    @Column(unique = true, nullable = false)
    private String dni;

    private LocalDate fechaNacimiento;
    private LocalDate fechaProbableParto;

    @Column(name = "fecha_alta_paciente")
    private LocalDateTime fechaAltaPaciente = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "id_medico", nullable = false)
    private Medico medico;
}
