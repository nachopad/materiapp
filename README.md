<a name="readme-top"></a>
<div align="center">

![Contributors](https://img.shields.io/github/contributors/MaxiCarrillo/materiapp.svg?style=for-the-badge)
![Forks](https://img.shields.io/github/forks/MaxiCarrillo/materiapp.svg?style=for-the-badge)
![Stargazers](https://img.shields.io/github/stars/MaxiCarrillo/materiapp.svg?style=for-the-badge)
![Issues](https://img.shields.io/github/issues/MaxiCarrillo/materiapp.svg?style=for-the-badge)

![Logo](https://via.placeholder.com/150?text=Materiapp+Logo)

# Materiapp

Materiapp es una aplicación pensada para ayudar a los estudiantes universitarios a llevar un seguimiento al detalle de su progreso en la facultad. Ideal para gestionar materias, notas, estado de correlatividades y planificar todo tu camino hasta la graduación.

[Demo](#) · [Reportar error](https://github.com/MaxiCarrillo/materiapp/issues) · [Sugerir algo](https://github.com/MaxiCarrillo/materiapp/issues)

</div>

---

<details>
<summary>Tabla de contenidos</summary>

- [Características principales](#características-principales)
- [Capturas de pantalla](#capturas-de-pantalla)
- [Para empezar](#para-empezar)
  - [Prerequisitos](#prerequisitos)
  - [Instalación](#instalación)
  - [Base de datos](#base-de-datos)
- [Notas adicionales](#notas-adicionales)
- [Contribuir al proyecto](#contribuir-al-proyecto)
- [🛠️ Stack](#️-stack)

</details>

---

## Características principales

- **Gestión de Materias:** Agregá, editá y organizá las materias de tu plan de estudios (por año y cuatrimestre).
- **Seguimiento de Notas:** Llevá un registro de las calificaciones de parciales, finales y TP para calcular tu promedio general al instante.
- **Control de Correlatividades:** Visualizá fácilmente qué materias necesitás tener aprobadas o regulares para cursar/rendir las siguientes.
- **Progreso de la Carrera:** Un dashboard espectacular que te muestra el porcentaje de avance real, materias aprobadas y las que te faltan.

## Capturas de pantalla

![Screenshot 1](https://via.placeholder.com/800x400?text=Dashboard+Materiapp)
![Screenshot 2](https://via.placeholder.com/800x400?text=Gestor+de+Materias)

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

## Para empezar

### Prerequisitos

#### Frontend

- Node.js (versión 18 o superior)
  ```sh
  node -v
  ```
- PNPM
  ```sh
  npm install -g pnpm
  ```

#### Backend

- Node.js (versión 18 o superior)
- NestJS CLI
  ```sh
  npm i -g @nestjs/cli
  ```

---

### Instalación

El proyecto está dividido en dos partes principales: `client` y `server`.

#### Frontend (Client)

```sh
cd client
pnpm install
pnpm run dev
```

#### Backend (Server)

```sh
cd server
pnpm install
pnpm run start:dev
```

---

### Base de datos

El backend utiliza **MongoDB** (mediante Mongoose). Tenés que levantar tu instancia local o configurar tu cluster en la nube (ej. MongoDB Atlas) y setear las variables de entorno.

No hay migraciones relacionales complejas, pero los modelos se sincronizan al iniciar:
```sh
cd server
pnpm run start:dev
```

---

## Notas adicionales

- **Configuración de variables de entorno (`.env`):**  
  Asegurate de copiar los archivos `.env.example` en ambos directorios (`client` y `server`) y renombrarlos a `.env`, completando con los datos de conexión correspondientes.
- **Usuarios de prueba:**  
  (Por definir en futuros seeds).
- **Problemas conocidos:**  
  Ninguno crítico al momento.
- **Consideraciones importantes:**  
  Mantené siempre separada la lógica de frontend y backend, respetando la estructura de carpetas de cada módulo.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

## Contribuir al proyecto

Las contribuciones son lo que hacen que la comunidad open source sea increíble ❤️

Si querés contribuir:

1. Fork del proyecto
2. Clonar tu fork
3. Agregar upstream
4. Crear rama `feature/*`
5. Commit
6. Push
7. Pull Request

También podés abrir un issue con mejoras o bugs. ¡Cualquier ayuda es bienvenida!

¡Gracias a todos los contribuidores!

![Contribuidores](https://contrib.rocks/image?repo=MaxiCarrillo/materiapp&max=500&columns=20)

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

---

## 🛠️ Stack

<p align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,ts,nodejs,nest,mongodb,vite,tailwind,git" />
  </a>
</p>

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>
---
