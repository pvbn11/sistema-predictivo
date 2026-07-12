# Paso 1: Compilar la aplicación Spring Boot usando Maven y Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Paso 2: Crear el entorno de ejecución con Java 21 y Python 3
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Instalar Python 3 y pip en el Linux de Azure
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Copiar el archivo .jar compilado desde el paso anterior
COPY --from=build /app/target/*.jar app.jar

# Copiar la carpeta de scripts de Python e instalar dependencias de IA
COPY scripts/ /app/scripts/
RUN pip3 install --no-cache-dir -r /app/scripts/requirements.txt

# Exponer el puerto por el que corre Spring Boot
EXPOSE 8080

# Comando para arrancar el servidor
ENTRYPOINT ["java", "-jar", "app.jar"]