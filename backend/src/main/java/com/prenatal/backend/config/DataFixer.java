package com.prenatal.backend.config;

import com.prenatal.backend.repository.NotaClinicaRepository;
import com.prenatal.backend.model.NotaClinica;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Component
public class DataFixer {

    private final NotaClinicaRepository repository;

    public DataFixer(NotaClinicaRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    public void fixNullDates() {
        List<NotaClinica> notas = repository.findAll();
        Random random = new Random();
        boolean changed = false;
        
        for (NotaClinica nota : notas) {
            if (nota.getFechaNota() == null) {
                // Generar una fecha aleatoria dentro de los últimos 30 días
                int diasAtras = random.nextInt(30) + 1;
                int horasAtras = random.nextInt(24);
                int minutosAtras = random.nextInt(60);
                
                nota.setFechaNota(LocalDateTime.now().minusDays(diasAtras).minusHours(horasAtras).minusMinutes(minutosAtras));
                changed = true;
            }
        }
        
        if (changed) {
            repository.saveAll(notas);
            System.out.println("✅ DataFixer: Se asignaron fechas aleatorias a las notas que tenían fecha nula.");
        }
    }
}
