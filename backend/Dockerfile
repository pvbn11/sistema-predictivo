# ==========================================
# 1. ETAPA DE COMPILACIÓN (Java / Maven)
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# ==========================================
# 2. ETAPA DE EJECUCIÓN (Entorno Final)
# ==========================================
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# 🌟 INSTALACIÓN MEJORADA DE PYTHON, PIP Y PAQUETES ESENCIALES 🌟
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/target/*.jar app.jar
COPY scripts/ /app/scripts/

# 🌟 REGLA CLAVE: Forzamos a pip3 a instalar ignorando el bloqueo del entorno virtual 🌟
RUN pip3 install --upgrade pip
RUN pip3 install --no-cache-dir --break-system-packages -r /app/scripts/requirements.txt

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]