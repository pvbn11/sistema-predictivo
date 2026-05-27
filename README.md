# Sistema Predictivo Prenatal

Este proyecto contiene el Frontend en Angular y el Backend en Spring Boot para la predicción de Riesgos en CTG.

## Requisitos Previos

*   **Java**: 21
*   **Node.js**: v18 o superior
*   **Angular CLI**: v17 o superior
*   **Python**: **3.11 o 3.12** (Versiones requeridas obligatoriamente, ya que TensorFlow/Keras no es compatible con Python 3.13+ actualmente).
    *   Debe tener instaladas las dependencias ejecutando: `pip install tensorflow numpy Pillow`
*   **Base de datos**: H2 (Embebida, no requiere configuración adicional)

## Estructura del Proyectos

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
