package com.prenatal.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "monitoreo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Monitoreo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMonitoreo;

    @ManyToOne
    @JoinColumn(name = "id_medico", nullable = false)
    private Medico medico;

    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    private LocalDateTime fechaMonitoreo = LocalDateTime.now();

    private String nivelRiesgo; // Óptimo, Alterado

    @Lob
    @Column(name = "imagen_ctg", columnDefinition = "VARBINARY(MAX)")
    private byte[] imagenCtg;

    private String observaciones;

    private Integer semanasGestacion;
    private Integer frecuenciaCardiacaFetal;
    private Integer movimientosFetales;

    @Column(name = "porcentaje_riesgo", precision = 10, scale = 2)
    private java.math.BigDecimal porcentajeRiesgo;
}
