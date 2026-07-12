# ==========================================
# 1. ETAPA DE COMPILACIÓN (Java / Maven)
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copiar el archivo de configuración de Maven y el código fuente
COPY pom.xml .
COPY src ./src

# Compilar el proyecto generando el archivo .jar (omitiendo los tests para agilizar)
RUN mvn clean package -DskipTests

# ==========================================
# 2. ETAPA DE EJECUCIÓN (Entorno Final)
# ==========================================
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# 🌟 INSTALACIÓN DE PYTHON Y PIP DENTRO DEL CONTENEDOR 🌟
# Esto prepara el sistema operativo para poder ejecutar comandos de Python
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar el archivo .jar generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Copiar la carpeta de los scripts de Python y el modelo
COPY scripts/ /app/scripts/

# 🌟 INSTALACIÓN DE LAS LIBRERÍAS DE INTELIGENCIA ARTIFICIAL 🌟
# Ahora pip3 funcionará correctamente e instalará TensorFlow 2.21.0 y Keras 3.14.1
RUN pip3 install --no-cache-dir -r /app/scripts/requirements.txt

# Exponer el puerto en el que corre tu Backend de Spring Boot
EXPOSE 8080

# Comando para arrancar tu aplicación de Java
ENTRYPOINT ["java", "-jar", "app.jar"]