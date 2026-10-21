# Taller Flutter — basado en actividad2a

**Guía interactiva de Flutter basada en la aplicación real del docente**, no en ejemplos o aplicaciones independientes.

[Repositorio](https://github.com/diln20/tallerFlutterDesarrollo) · [GitHub Pages (tras activarlo)](https://diln20.github.io/tallerFlutterDesarrollo/)

## Punto de partida comprobado

En el equipo WIN-C2ANEVBHN6Q se leyó la carpeta:

`C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2a`

La aplicación actual tiene el archivo `lib/main.dart`, con:

- `void main()` y `runApp(const MainApp())`.
- `MainApp extends StatelessWidget`.
- `MaterialApp`, `Scaffold` y `AppBar` con título **Tienda**.
- `Center`, `Column`, `Row`, `Text`, `Icon`, `SizedBox` y `Expanded`.
- Un `TextField` con `hintText: 'Buscar marca o modelo'`.

**Todavía no existe** una lista de productos, lógica de filtrado, formularios de registro ni BLoC en el código de clase.

Los archivos de referencia copiados literalmente son [codigo-base/main.dart](codigo-base/main.dart) y [codigo-base/pubspec.yaml](codigo-base/pubspec.yaml). Se preservan los textos escritos en clase tal y como aparecen.

## Organización del taller

| Módulo | Contenido | Estado |
| --- | --- | --- |
| 01 | Abrir y ejecutar actividad2a | Basado en proyecto real |
| 02 | Entender main.dart, runApp, StatelessWidget, super.key y const | Basado en proyecto real |
| 03 | MaterialApp, Scaffold y AppBar: construir Tienda | Basado en proyecto real |
| 04 | Center, Column, Row, SizedBox e Icon | Basado en proyecto real |
| 05 | Expanded y TextField: buscador visual de la Tienda | **Coincide con main.dart real** |
| 06 | Mejorar la distribución de la pantalla Tienda | Propuesta futura en la copia |
| 07 | Hacer interactivo el campo de búsqueda con StatefulWidget y setState | Propuesta futura en la copia |
| 08 | Filtrar una lista local de vehículos de prueba | Propuesta futura en la copia |
| 09 | Agregar vehículos a la misma Tienda con Form y validación | Propuesta futura en la copia |
| 10 | Comprender BLoC como evolución de la Tienda | Propuesta conceptual posterior |

Los módulos 01–05 avanzan del código mínimo al archivo actual. Los módulos 06–10 no están implementados en el proyecto original y **no deben presentarse como funcionalidades ya vistas en clase**.

## Archivos completos por etapa

Para el trabajo didáctico se prepararon estos archivos completos que permiten revisar cada etapa y culminan en la versión auténtica:

- [etapas/paso_02_main.dart](etapas/paso_02_main.dart)
- [etapas/paso_03_tienda.dart](etapas/paso_03_tienda.dart)
- [etapas/paso_04_columna.dart](etapas/paso_04_columna.dart)
- [etapas/paso_05_buscador.dart](etapas/paso_05_buscador.dart) — idéntico a `codigo-base/main.dart`.

Los estudiantes deben construir **paso a paso**, explicando cada línea y comprobando el resultado, no pegar la etapa completa antes de estudiar los conceptos.

## Rutas de trabajo

- **Docente y estudiantes — NO MODIFICAR AUTOMÁTICAMENTE**: `C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2a`.
- **Copia para preparar la guía y futuras prácticas**: `C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2a-guia`.
- **Sitio web local**: `C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2a-guia\guia-web`.

El proyecto original no se modifica al publicar la guía. Las mejoras de módulos posteriores se desarrollarán en la copia cuando corresponda a la clase.

## Funciones de la página

- Índice y buscador por módulos, navegación mediante enlaces directos.
- Diseño responsive en computador y celular; modo claro y oscuro.
- Botones para copiar los ejemplos de código.
- Actividades y listas de comprobación; progreso guardado en el navegador del estudiante.
- Referencias a los archivos auténticos y a los hitos ejecutables.
- Distinción visual entre **lo ya realizado en clase** y **las prácticas propuestas**.

## Publicación en GitHub Pages

Si Pages todavía no está activo: abrir **Settings → Pages → Build and deployment**, elegir **Deploy from a branch**, rama `main`, carpeta `/(root)` y **Save**. El sitio está preparado en `index.html` y usa rutas relativas compatibles con Pages.

La URL prevista es https://diln20.github.io/tallerFlutterDesarrollo/ tras el despliegue.

## Política editorial

Cada concepto se explica cuando aparece por primera vez. Para cada etapa, incluir: objetivo, código en fragmentos cortos, explicación de nuevas líneas o propiedades, comando de ejecución, prueba observable, errores típicos y ejercicio individual. Las capturas deben proceder del Flutter real, no de ilustraciones simuladas sin aviso. 
