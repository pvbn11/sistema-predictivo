-- data.sql - Script de inicialización de datos ficticios

-- Insertar médicos
MERGE INTO medicos (id_medico, usuario, password, nombres, apellidos, titulo, especialidad, fecha_alta_usuario) 
KEY(id_medico) 
VALUES (1, 'doc1', 'pass', 'Juan', 'Perez', 'Dr.', 'Obstetricia', CURRENT_TIMESTAMP);

MERGE INTO medicos (id_medico, usuario, password, nombres, apellidos, titulo, especialidad, fecha_alta_usuario) 
KEY(id_medico) 
VALUES (2, 'doc2', 'pass', 'Ana', 'Gomez', 'Dra.', 'Ginecología', CURRENT_TIMESTAMP);

-- Insertar pacientes
MERGE INTO pacientes (id_paciente, nombres, apellidos, dni, fecha_nacimiento, fecha_probable_parto, fecha_alta_paciente, id_medico) 
KEY(id_paciente)
VALUES (1, 'María', 'González García', '12345678', '1995-05-15', '2026-10-10', CURRENT_TIMESTAMP, 1);

MERGE INTO pacientes (id_paciente, nombres, apellidos, dni, fecha_nacimiento, fecha_probable_parto, fecha_alta_paciente, id_medico) 
KEY(id_paciente)
VALUES (2, 'Carmen', 'López Martín', '87654321', '1990-11-20', '2026-09-05', CURRENT_TIMESTAMP, 2);

MERGE INTO pacientes (id_paciente, nombres, apellidos, dni, fecha_nacimiento, fecha_probable_parto, fecha_alta_paciente, id_medico) 
KEY(id_paciente)
VALUES (3, 'Ana', 'Fernández Ruiz', '11223344', '1988-03-30', '2026-11-01', CURRENT_TIMESTAMP, 1);

MERGE INTO pacientes (id_paciente, nombres, apellidos, dni, fecha_nacimiento, fecha_probable_parto, fecha_alta_paciente, id_medico) 
KEY(id_paciente)
VALUES (4, 'Lucia', 'Martínez', '44332211', '1992-08-12', '2026-12-15', CURRENT_TIMESTAMP, 2);

MERGE INTO pacientes (id_paciente, nombres, apellidos, dni, fecha_nacimiento, fecha_probable_parto, fecha_alta_paciente, id_medico) 
KEY(id_paciente)
VALUES (5, 'Sofía', 'Pérez', '55667788', '1997-01-25', '2027-01-20', CURRENT_TIMESTAMP, 1);

-- Insertar monitoreos
-- Paciente 1 tiene > 3 monitoreos (para probar historial gráfico)
MERGE INTO monitoreo (id_monitoreo, id_medico, id_paciente, fecha_monitoreo, nivel_riesgo, observaciones, semanas_gestacion, frecuencia_cardiaca_fetal, movimientos_fetales, porcentaje_riesgo) 
KEY(id_monitoreo)
VALUES (1, 1, 1, '2025-10-01T10:00:00', 'Normal', 'Monitoreo de rutina sin alteraciones.', 32, 140, 10, 15.5);

MERGE INTO monitoreo (id_monitoreo, id_medico, id_paciente, fecha_monitoreo, nivel_riesgo, observaciones, semanas_gestacion, frecuencia_cardiaca_fetal, movimientos_fetales, porcentaje_riesgo) 
KEY(id_monitoreo)
VALUES (2, 1, 1, '2025-10-15T11:30:00', 'Sospechoso', 'Leve bradicardia temporal.', 34, 110, 6, 45.0);

MERGE INTO monitoreo (id_monitoreo, id_medico, id_paciente, fecha_monitoreo, nivel_riesgo, observaciones, semanas_gestacion, frecuencia_cardiaca_fetal, movimientos_fetales, porcentaje_riesgo) 
KEY(id_monitoreo)
VALUES (3, 1, 1, '2025-11-02T09:15:00', 'Patológico', 'Desaceleraciones variables, requiere atención.', 36, 95, 3, 85.0);

MERGE INTO monitoreo (id_monitoreo, id_medico, id_paciente, fecha_monitoreo, nivel_riesgo, observaciones, semanas_gestacion, frecuencia_cardiaca_fetal, movimientos_fetales, porcentaje_riesgo) 
KEY(id_monitoreo)
VALUES (4, 1, 1, '2025-11-20T14:00:00', 'Sospechoso', 'Mejora parcial tras oxigenación.', 38, 120, 7, 55.0);

-- Paciente 2 tiene < 3 monitoreos (para probar mensaje de falta de datos)
MERGE INTO monitoreo (id_monitoreo, id_medico, id_paciente, fecha_monitoreo, nivel_riesgo, observaciones, semanas_gestacion, frecuencia_cardiaca_fetal, movimientos_fetales, porcentaje_riesgo) 
KEY(id_monitoreo)
VALUES (5, 2, 2, '2025-10-01T10:00:00', 'Normal', 'Todo en orden.', 28, 135, 12, 10.0);

MERGE INTO monitoreo (id_monitoreo, id_medico, id_paciente, fecha_monitoreo, nivel_riesgo, observaciones, semanas_gestacion, frecuencia_cardiaca_fetal, movimientos_fetales, porcentaje_riesgo) 
KEY(id_monitoreo)
VALUES (6, 2, 2, '2025-11-01T10:00:00', 'Normal', 'Continúa embarazo estable.', 32, 142, 11, 12.0);

-- Paciente 3 (Patológico reciente)
MERGE INTO monitoreo (id_monitoreo, id_medico, id_paciente, fecha_monitoreo, nivel_riesgo, observaciones, semanas_gestacion, frecuencia_cardiaca_fetal, movimientos_fetales, porcentaje_riesgo) 
KEY(id_monitoreo)
VALUES (7, 1, 3, '2025-11-25T10:00:00', 'Patológico', 'Taquicardia fetal sostenida.', 35, 170, 4, 90.0);

-- Paciente 4 (Normal)
MERGE INTO monitoreo (id_monitoreo, id_medico, id_paciente, fecha_monitoreo, nivel_riesgo, observaciones, semanas_gestacion, frecuencia_cardiaca_fetal, movimientos_fetales, porcentaje_riesgo) 
KEY(id_monitoreo)
VALUES (8, 2, 4, '2025-12-01T09:00:00', 'Normal', 'Actividad uterina normal.', 30, 138, 14, 8.0);
