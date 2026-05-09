package com.prenatal.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notas_clinicas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotaClinica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idNota;

    @ManyToOne
    @JoinColumn(name = "id_medico", nullable = false)
    private Medico medico;

    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    private LocalDateTime fechaNota;

    @Column(columnDefinition = "TEXT")
    private String contenido;

    @PrePersist
    protected void onCreate() {
        if (this.fechaNota == null) {
            this.fechaNota = LocalDateTime.now();
        }
    }
}
