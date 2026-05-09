# Sistema Predictivo (Prenatal)

Este documento contiene los pasos necesarios para levantar el entorno de desarrollo del proyecto, incluyendo tanto el Frontend (Angular) como el Backend (Spring Boot).

## 🚀 Requisitos Previos

- [Node.js](https://nodejs.org/) (incluye `npm`)
- [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/downloads/) (versión 17 o superior recomendada)

---

## 💻 Frontend (Angular)

El Frontend está ubicado en la raíz del proyecto y utiliza Angular.

**Pasos para ejecutarlo:**

1. Abre una terminal en la carpeta raíz del proyecto.
2. Instala las dependencias del proyecto (solo la primera vez):
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```
   *(También puedes usar `npx ng serve` o `npm run start`)*
4. Abre tu navegador y ve a la dirección: **http://localhost:4200/**. La aplicación se recargará automáticamente si realizas cambios en el código.

---

## ⚙️ Backend (Spring Boot)

El Backend está desarrollado con Java y Spring Boot, y se encuentra dentro de la carpeta `backend/`.

**Pasos para ejecutarlo:**

1. Abre una nueva terminal y navega hacia la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Inicia la aplicación utilizando el wrapper de Maven incluido en el proyecto:
   - **En Windows:**
     ```cmd
     .\mvnw spring-boot:run
     ```
   - **En Linux o macOS:**
     ```bash
     ./mvnw spring-boot:run
     ```
3. El servidor Backend se iniciará y estará disponible por defecto en: **http://localhost:8080/**.
