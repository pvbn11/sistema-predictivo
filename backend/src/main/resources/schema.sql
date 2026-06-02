-- schema.sql - Estructura de la Base de Datos SQL

-- Eliminar tablas existentes para garantizar una recreación limpia
DROP TABLE IF EXISTS notas_clinicas;
DROP TABLE IF EXISTS monitoreo;
DROP TABLE IF EXISTS pacientes;
DROP TABLE IF EXISTS medicos;

-- Tabla de Médicos
CREATE TABLE medicos (
    id_medico BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombres VARCHAR(255),
    apellidos VARCHAR(255),
    titulo VARCHAR(50),
    especialidad VARCHAR(255),
    fecha_alta_usuario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cambio_password TIMESTAMP
);

-- Tabla de Pacientes
CREATE TABLE pacientes (
    id_paciente BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(255),
    apellidos VARCHAR(255),
    dni VARCHAR(20) NOT NULL UNIQUE,
    fecha_nacimiento DATE,
    fecha_probable_parto DATE,
    fecha_alta_paciente TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_medico BIGINT NOT NULL,
    CONSTRAINT fk_paciente_medico FOREIGN KEY (id_medico) REFERENCES medicos(id_medico) ON DELETE CASCADE
);

-- Tabla de Monitoreos (Almacena imágenes CTG en formato BLOB)
CREATE TABLE monitoreo (
    id_monitoreo BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_medico BIGINT NOT NULL,
    id_paciente BIGINT NOT NULL,
    fecha_monitoreo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nivel_riesgo VARCHAR(50), -- 'Óptimo', 'Alterado'
    imagen_ctg BLOB, -- Campo BLOB para almacenar los bytes de la imagen JPG de la CTG
    observaciones VARCHAR(1000),
    semanas_gestacion INT,
    frecuencia_cardiaca_fetal INT,
    movimientos_fetales INT,
    porcentaje_riesgo DECIMAL(10,2),
    CONSTRAINT fk_monitoreo_medico FOREIGN KEY (id_medico) REFERENCES medicos(id_medico) ON DELETE CASCADE,
    CONSTRAINT fk_monitoreo_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);

-- Tabla de Notas Clínicas
CREATE TABLE notas_clinicas (
    id_nota BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_medico BIGINT NOT NULL,
    id_paciente BIGINT NOT NULL,
    fecha_nota TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contenido TEXT,
    CONSTRAINT fk_nota_medico FOREIGN KEY (id_medico) REFERENCES medicos(id_medico) ON DELETE CASCADE,
    CONSTRAINT fk_nota_paciente FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);
