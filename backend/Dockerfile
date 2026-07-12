# ==========================================
# 1. ETAPA DE COMPILACIÓN (Java / Maven)
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copiar configuración de Maven y el código fuente
COPY pom.xml .
COPY src ./src

# Compilar generando el archivo .jar (omitiendo tests para agilizar)
RUN mvn clean package -DskipTests

# ==========================================
# 2. ETAPA DE EJECUCIÓN (Entorno Final con Python moderno)
# ==========================================
# 🌟 Cambiado a 'noble' para usar Ubuntu 24.04 con Python 3.12 nativo 🌟
FROM eclipse-temurin:21-jre-noble
WORKDIR /app

# Instalación de Python 3, Pip y herramientas esenciales de compilación
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar el archivo ejecutable .jar de Spring Boot desde la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Copiar toda la carpeta de scripts de Python (que incluye tu modelo predictivo)
COPY scripts/ /app/scripts/

# Instalar los requerimientos de IA ignorando restricciones de entornos gestionados externamente
RUN pip3 install --no-cache-dir --break-system-packages -r /app/scripts/requirements.txt

# Exponer el puerto por el que se comunicará Angular con Spring Boot
EXPOSE 8080

# Comando por defecto para arrancar la API del sistema predictivo
ENTRYPOINT ["java", "-jar", "app.jar"]