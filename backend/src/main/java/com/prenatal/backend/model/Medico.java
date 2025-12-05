package com.prenatal.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Medico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMedico;

    @Column(nullable = false, unique = true)
    private String usuario;

    @Column(nullable = false)
    private String password;

    private String nombres;
    private String apellidos;
    private String titulo;
    private String especialidad;

    @Column(name = "fecha_alta_usuario")
    private LocalDateTime fechaAltaUsuario = LocalDateTime.now();

    @Column(name = "fecha_cambio_password")
    private LocalDateTime fechaCambioPassword;
}
