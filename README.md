# 🌱 Dashboard de Arquitectura de Datos — Asociación Floricultores

**Institución Universitaria Digital de Antioquia (IU Digital de Antioquia)**  
**Evidencia de Aprendizaje 1 — Asignatura: Estructura de Datos**  
Propuesta de consultoría tecnológica e interactiva (Single Page Application) sobre **estructuras de datos estáticas y dinámicas** aplicadas al sector floricultor.

---

## 👥 Equipo Consultor
1. **Jhon Fredy Betancur Davila** — *Arquitecto de Datos & Memoria*
2. **Cristian David Gutierrez Olivar** — *Líder de Desarrollo Frontend & DOM*
3. **Jose Fernando Higuita** — *Analista de Complejidad Algorítmica*
4. **Arnold Orlando Barbosa Díaz** — *Diseñador de Experiencia UX/UI & QA*

---

## 🏗️ Módulos y Estructuras de Datos Implementadas

| Módulo | Caso de Uso Florícola | Estructura de Datos | Complejidad / Memoria |
| :--- | :--- | :--- | :--- |
| **Requerimiento A** | Registro de Temperaturas Mensuales (30 días) | **Vector Estático 1D** (`temperaturas[30]`) | Acceso directo $O(1)$ en bloque contiguo de RAM |
| **Requerimiento B** | Producción Cruzada (4 Flores × 5 Invernaderos) | **Matriz Estática 2D** (`produccion[4][5]`) | Recorrido matricial $O(F \times C)$ por coordenadas `[i][j]` |
| **Requerimiento C** | Gestión de Recolectores Temporales | **Lista Enlazada Dinámica** (`Nodo -> sig*`) | Asignación/liberación dinámica en `Heap` en tiempo de ejecución |
| **Sección 4** | Autoevaluación y Consultoría del Equipo | **Renderizado Modular de Tarjetas (DOM)** | Captura, sanitización y publicación de evidencia académica |

---

## 🛠️ Tecnologías Utilizadas
* **HTML5 Semántico** (`<nav>`, `<header>`, `<main>`, `<section>`, `<aside>`, `<article>`, `<footer>`)
* **Tailwind CSS (vía CDN)** — Diseño moderno tipo Dashboard con paleta en tonos verdes naturaleza (`emerald`) y grises tecnológicos (`slate`)
* **Vanilla JavaScript (ES6+)** — Código exhaustivamente comentado línea por línea como material de estudio de Ingeniería de Software
* **SVG & Diagramas Técnicos** — Diagramas de memoria ampliables (Lightbox) y favicon vectorial personalizado (`favicon.svg`)

---

## 🚀 Ejecución Local y Despliegue
* **Local**: Abre `index.html` directamente en el navegador o ejecuta `python -m http.server 8080`.
* **Producción (Vercel)**: Proyecto estático listo para importar desde GitHub en [Vercel](https://vercel.com/) sin configuración adicional.
