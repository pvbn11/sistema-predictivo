-- data.sql - Inicialización de datos aleatorios y de prueba

-- Limpiar datos para evitar duplicados en reinicios (las tablas ya son borradas en schema.sql)
DELETE FROM notas_clinicas;
DELETE FROM monitoreo;
DELETE FROM pacientes;
DELETE FROM medicos;

-- Insertar médicos de prueba
INSERT INTO medicos (id_medico, usuario, password, nombres, apellidos, titulo, especialidad, fecha_alta_usuario)
VALUES 
(1, 'doc1', 'pass123', 'Juan Carlos', 'Pérez Ramos', 'Dr.', 'Obstetricia de Alto Riesgo', CURRENT_TIMESTAMP),
(2, 'doc2', 'pass123', 'Ana María', 'Gómez Torres', 'Dra.', 'Ginecología y Obstetricia', CURRENT_TIMESTAMP),
(3, 'dra.rodriguez', 'password123', 'Ana', 'Rodríguez', 'Dra.', 'Ginecología', CURRENT_TIMESTAMP);

-- Insertar pacientes de prueba
INSERT INTO pacientes (id_paciente, nombres, apellidos, dni, fecha_nacimiento, fecha_probable_parto, fecha_alta_paciente, id_medico)
VALUES
(1, 'María', 'González García', '12345678', '1995-05-15', '2026-10-10', CURRENT_TIMESTAMP, 1),
(2, 'Carmen', 'López Martín', '87654321', '1990-11-20', '2026-09-05', CURRENT_TIMESTAMP, 2),
(3, 'Ana', 'Fernández Ruiz', '11223344', '1988-03-30', '2026-11-01', CURRENT_TIMESTAMP, 1),
(4, 'Lucía', 'Martínez Soler', '44332211', '1992-08-12', '2026-12-15', CURRENT_TIMESTAMP, 2),
(5, 'Sofía', 'Pérez Alarcón', '55667788', '1997-01-25', '2027-01-20', CURRENT_TIMESTAMP, 1);

-- Insertar monitoreos con información aleatoria y realística
-- Paciente 1 (Tiene historial para gráfico de tendencias)
INSERT INTO monitoreo (id_monitoreo, id_medico, id_paciente, fecha_monitoreo, nivel_riesgo, observaciones, semanas_gestacion, frecuencia_cardiaca_fetal, movimientos_fetales, porcentaje_riesgo)
VALUES 
(1, 1, 1, '2025-10-01T10:00:00', 'Óptimo', 'Monitoreo de rutina. Frecuencia cardíaca estable sin deceleraciones.', 32, 140, 10, 15.5),
(2, 1, 1, '2025-10-15T11:30:00', 'Alterado', 'Se observa leve bradicardia temporal. Movimientos ligeramente reducidos.', 34, 110, 6, 65.0),
(3, 1, 1, '2025-11-02T09:15:00', 'Alterado', 'Desaceleraciones variables recurrentes. Requiere evaluación médica inmediata.', 36, 95, 3, 85.0),
(4, 1, 1, '2025-11-20T14:00:00', 'Alterado', 'Taquicardia compensatoria leve. Mejoría tras administración de oxígeno a la madre.', 38, 120, 7, 72.0);

-- Paciente 2 (Falta de datos para el gráfico de tendencias, < 3 monitoreos)
INSERT INTO monitoreo (id_monitoreo, id_medico, id_paciente, fecha_monitoreo, nivel_riesgo, observaciones, semanas_gestacion, frecuencia_cardiaca_fetal, movimientos_fetales, porcentaje_riesgo)
VALUES 
(5, 2, 2, '2025-10-01T10:00:00', 'Óptimo', 'Parámetros fisiológicos normales. Monitoreo reactivo.', 28, 135, 12, 10.0),
(6, 2, 2, '2025-11-01T10:00:00', 'Óptimo', 'Continúa embarazo estable. Buen tono fetal.', 32, 142, 11, 12.0);

-- Paciente 3 (Alterado reciente)
INSERT INTO monitoreo (id_monitoreo, id_medico, id_paciente, fecha_monitoreo, nivel_riesgo, observaciones, semanas_gestacion, frecuencia_cardiaca_fetal, movimientos_fetales, porcentaje_riesgo)
VALUES 
(7, 1, 3, '2025-11-25T10:00:00', 'Alterado', 'Taquicardia fetal sostenida (170 lpm). Monitoreo silente prolongado.', 35, 170, 4, 90.0);

-- Paciente 4 (Óptimo)
INSERT INTO monitoreo (id_monitoreo, id_medico, id_paciente, fecha_monitoreo, nivel_riesgo, observaciones, semanas_gestacion, frecuencia_cardiaca_fetal, movimientos_fetales, porcentaje_riesgo)
VALUES 
(8, 2, 4, '2025-12-01T09:00:00', 'Óptimo', 'Actividad uterina normal. Aceleraciones presentes, sin desaceleraciones.', 30, 138, 14, 8.0);

-- Insertar notas clínicas aleatorias para completar la base de datos
INSERT INTO notas_clinicas (id_nota, id_medico, id_paciente, fecha_nota, contenido)
VALUES
(1, 1, 1, '2025-10-01T10:15:00', 'Paciente acude a consulta de rutina de la semana 32. Refiere sentirse bien y percibir movimientos fetales adecuados. Monitoreo sin alteraciones.'),
(2, 1, 1, '2025-10-15T11:45:00', 'Paciente reporta disminución de movimientos fetales en las últimas 12 horas. Se realiza monitoreo observando leve bradicardia y variabilidad disminuida. Se recomienda reposo lateral izquierdo e hidratación.'),
(3, 1, 1, '2025-11-02T09:30:00', 'Urgente: Monitoreo muestra desaceleraciones variables. Se indica hospitalización temporal para monitoreo continuo del bienestar fetal y maduración pulmonar.'),
(4, 2, 2, '2025-10-01T10:30:00', 'Control obstétrico del segundo trimestre. Ecografía y monitoreo en rangos normales. Paciente estable.'),
(5, 1, 3, '2025-11-25T10:20:00', 'Monitoreo preocupante por taquicardia fetal de 170 lpm sostenida. Se descarta fiebre materna. Se programa ecografía Doppler de urgencia para evaluar flujo útero-placentario.');

-- Reiniciar secuencias de auto-incremento para evitar conflictos de llave primaria
ALTER TABLE medicos ALTER COLUMN id_medico RESTART WITH 10;
ALTER TABLE pacientes ALTER COLUMN id_paciente RESTART WITH 10;
ALTER TABLE monitoreo ALTER COLUMN id_monitoreo RESTART WITH 10;
ALTER TABLE notas_clinicas ALTER COLUMN id_nota RESTART WITH 10;
