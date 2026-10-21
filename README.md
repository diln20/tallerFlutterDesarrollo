# Flutter en práctica — Taller de Desarrollo Móvil

**Guía web interactiva para acompañar las clases de Flutter**, basada en el código real de `actividad2a` y organizada en pasos cortos, explicaciones, ejercicios y verificaciones.

### Abrir la guía

- **Sitio GitHub Pages:** https://diln20.github.io/tallerFlutterDesarrollo/ (funcionará cuando se active Pages).
- **Repositorio:** https://github.com/diln20/tallerFlutterDesarrollo
- **Archivo de entrada:** [index.html](index.html)

> El sitio es HTML, CSS y JavaScript estático: no requiere instalaciones ni compilación. El progreso y las casillas se guardan únicamente en el navegador del estudiante.

## Publicar en GitHub Pages

La primera vez, en este repositorio abre **Settings → Pages → Build and deployment** y elige:

- **Source:** Deploy from a branch
- **Branch:** `main`
- **Folder:** `/(root)`
- **Save**

Después GitHub Pages publicará los archivos de `main` en la URL indicada. La activación de Pages se realiza una sola vez en la configuración del repositorio; subir archivos por sí solo no garantiza que ya esté habilitada.

## Módulos

| # | Tema | Origen |
|---|---|---|
| 01 | Preparar y ejecutar el proyecto | Entorno actual de clase |
| 02 | Entender `main.dart`, `main()`, `runApp`, `super.key`, `const` | Código de clase |
| 03 | `MaterialApp`, `Scaffold`, `AppBar` y `body` | Código de clase |
| 04 | `Column`, `Row`, `Center`, `Icon`, `SizedBox` | Código de clase |
| 05 | `TextField`, `InputDecoration`, `Expanded` | Código de clase |
| 06 | Espaciado y diseño adaptable | Práctica propuesta |
| 07 | `StatefulWidget`, `setState`, controlador y `dispose` | Práctica propuesta |
| 08 | `Form`, `TextFormField` y validación | Práctica propuesta |
| 09 | Cajero electrónico como proyecto transversal paralelo | Propuesta |
| 10 | Introducción conceptual a BLoC | Propuesta posterior |

La guía **separa lo que ya aparece en el código real de clase de las ampliaciones didácticas**. Por ahora, la app original tiene una pantalla `Tienda` con un `StatelessWidget`, filas, columnas, iconos y un campo de búsqueda. No afirmamos que la búsqueda ya filtre productos.

## Proyectos en el equipo de trabajo

- `C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2a`: **proyecto del docente**, para avanzar con estudiantes; no se modifica desde esta guía.
- `C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2a-guia`: **copia de trabajo** para construir contenidos y probar cambios.
- `C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2a-guia\guia-web`: **copia local** del sitio que se sube a GitHub.

Los ejemplos de código de la web son demostraciones didácticas. Los cambios sugeridos para módulos posteriores no se han aplicado por el mero hecho de publicar la guía.

## Estructura del sitio

```text
index.html
assets/
  app.js
  styles.css
  favicon.svg
README.md
.nojekyll
```

## Funciones de la guía

- Menú por módulos, búsqueda de temas y navegación por enlace directo.
- Diseño responsivo para celular, tableta y escritorio.
- Modo claro / oscuro.
- Copiar bloques de código.
- Casillas de verificación y registro local de avance.
- Ejercicios individuales con orientaciones desplegables.
- Diferencia visible entre **código de clase** y **prácticas propuestas**.

## Metodología de cada módulo

1. Objetivo con lenguaje sencillo.
2. Lo que se necesita saber antes.
3. Fragmento pequeño de código.
4. Explicación de cada línea o concepto nuevo.
5. Cambio práctico y comprobación.
6. Actividad individual y resultado esperado.
7. Marcación de progreso.

**Capturas de pantalla:** la ilustración de la portada es esquemática, *no una captura real*. Las capturas de Flutter se incorporarán al sitio cuando se obtengan y validen desde el proyecto de pruebas.

## Desarrollo local

Puedes abrir `index.html` directamente con tu navegador. Si quieres servirlo en una URL local, desde la carpeta del sitio ejecuta cualquier servidor HTTP estático. Usa URLs relativas para conservar compatibilidad con la ruta de GitHub Pages.

---

Material educativo en desarrollo continuo, basado en la práctica real de aula.