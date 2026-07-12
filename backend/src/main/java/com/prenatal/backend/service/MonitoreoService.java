package com.prenatal.backend.service;

import com.prenatal.backend.model.Medico;
import com.prenatal.backend.model.Monitoreo;
import com.prenatal.backend.model.Paciente;
import com.prenatal.backend.repository.MedicoRepository;
import com.prenatal.backend.repository.MonitoreoRepository;
import com.prenatal.backend.repository.PacienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class MonitoreoService {

    private final MonitoreoRepository monitoreoRepository;
    private final PacienteRepository pacienteRepository;
    private final MedicoRepository medicoRepository;

    public MonitoreoService(MonitoreoRepository monitoreoRepository,
                            PacienteRepository pacienteRepository,
                            MedicoRepository medicoRepository) {
        this.monitoreoRepository = monitoreoRepository;
        this.pacienteRepository = pacienteRepository;
        this.medicoRepository = medicoRepository;
    }

    public Monitoreo procesarYGuardarMonitoreo(MultipartFile file, int escalaX, Long pacienteId, Long medicoId) throws Exception {
        // Normalizar escalaX
        double xNorm = (escalaX - 1.0) / 2.0;

        // Guardar la imagen en un archivo temporal
        String tempDir = System.getProperty("java.io.tmpdir");
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path tempFilePath = Paths.get(tempDir, fileName);
        Files.write(tempFilePath, file.getBytes());

        // Rutas
        String baseDir = System.getProperty("user.dir");
        // Ajustamos la ruta del modelo basada en que user.dir apunta usualmente a "backend" o a la raiz
        // Buscamos si la carpeta Modelo est un nivel arriba
        String pythonScriptPath = Paths.get(baseDir, "scripts", "predict_ctg.py").toString();
        String modelPath = Paths.get(baseDir, "scripts", "modelo_ctg_final.keras").toString();

        double probabilidad = 0.0;
        try {
            // Ejecutar el script Python usando explícitamente Python 3.12 (py -3.12)
            ProcessBuilder pb = new ProcessBuilder(
                    "python3",
                    pythonScriptPath,
                    tempFilePath.toString(),
                    String.valueOf(xNorm),
                    modelPath
            );
            pb.redirectErrorStream(true);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            boolean prediccionEncontrada = false;
            while ((line = reader.readLine()) != null) {
                System.out.println("PYTHON OUTPUT: " + line);
                if (line.startsWith("PROBABILITY:")) {
                    probabilidad = Double.parseDouble(line.substring("PROBABILITY:".length()));
                    prediccionEncontrada = true;
                } else if (line.startsWith("ERROR:")) {
                    throw new RuntimeException("Error en Python: " + line);
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0 || !prediccionEncontrada) {
                throw new RuntimeException("El script de Python termin con error o no devolvi probabilidad.");
            }
        } finally {
            // Eliminar el archivo temporal
            Files.deleteIfExists(tempFilePath);
        }

        // Determinar el nivel de riesgo
        String nivelRiesgo = probabilidad > 0.60 ? "Alterado" : "Óptimo";

        // Obtener paciente y medico
        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        Medico medico = medicoRepository.findById(medicoId)
                .orElseThrow(() -> new RuntimeException("Medico no encontrado"));

        // Guardar Monitoreo
        Monitoreo monitoreo = new Monitoreo();
        monitoreo.setImagenCtg(file.getBytes());
        monitoreo.setNivelRiesgo(nivelRiesgo);
        
        double porcentaje = probabilidad * 100.0;
        java.math.BigDecimal porcentajeRedondeado = java.math.BigDecimal.valueOf(porcentaje)
                .setScale(2, java.math.RoundingMode.HALF_UP);
        monitoreo.setPorcentajeRiesgo(porcentajeRedondeado);
        
        monitoreo.setPaciente(paciente);
        monitoreo.setMedico(medico);

        return monitoreoRepository.save(monitoreo);
    }
}
