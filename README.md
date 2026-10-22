# Taller Flutter — Guía detallada basada en actividad2a

**Guía web didáctica para construir la aplicación «Tienda» paso a paso, basada en el código real que se utiliza en clase.** No cambia de proyecto ni incluye el cajero electrónico de otros talleres.

**Página publicada:** https://diln20.github.io/tallerFlutterDesarrollo/  
**Repositorio:** https://github.com/diln20/tallerFlutterDesarrollo

## Cómo estudiar con esta guía

1. **Lee primero el objetivo.** Cada módulo parte de algo que ya aprendiste.
2. **Escribe el fragmento en su lugar.** No copies la aplicación completa antes de conocer las instrucciones.
3. **Lee las explicaciones.** Se aclaran líneas, símbolos, parámetros, métodos y cierres.
4. **Ejecuta y observa.** Comprueba el resultado en Flutter, no solamente en el editor.
5. **Consulta los errores frecuentes.** Identifica su causa antes de cambiar código al azar.
6. **Resuelve el ejercicio individual** y las preguntas de sustentación.
7. **Compara con el archivo completo de la etapa.** Es un punto de verificación, no un atajo para saltar la explicación.
8. **Marca el módulo como completado** cuando puedas explicar por qué funciona.

## Proyecto real de referencia

Equipo: `WIN-C2ANEVBHN6Q`  
Docente y estudiantes: `C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2a`  
Copia para preparar ejemplos: `C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2a-guia`

Se verificó el código exacto de [`codigo-base/main.dart`](codigo-base/main.dart) y [`codigo-base/pubspec.yaml`](codigo-base/pubspec.yaml). **El `main.dart` tiene 42 líneas.** La página explica una por una, incluidas llaves, comas, paréntesis y listas de widgets.

La aplicación de clase contiene `MainApp extends StatelessWidget`, `MaterialApp`, `Scaffold`, una barra «Tienda», `Center`, `Column`, `Row`, iconos de automóvil, `Expanded` y un `TextField` con `hintText: 'Buscar marca o modelo'`. El campo permite escribir, pero aún **no realiza búsquedas ni registra vehículos**.

## Secuencia de aprendizaje

| Módulo | ¿Qué aprenderás? | Estado |
| --- | --- | --- |
| 01 | Entorno, carpetas, `flutter doctor`, `pub get`, `run`, Hot Reload y errores de instalación. | Código y entorno de clase |
| 02 | Dart básico: función, clase, constructor, `runApp`, `StatelessWidget`, `const`, `super.key`, símbolos y argumentos. | Código de clase |
| 03 | Estructura de la Tienda: `MaterialApp`, `Scaffold`, `AppBar`, `body`, `Center` y `Text`. | Código de clase |
| 04 | Distribución de widgets: `Column`, `Row`, `children`, `SizedBox`, iconos, tamaños y restricciones. | Código de clase |
| 05 | `TextField`, `InputDecoration`, `hintText`, `Expanded` y explicación exacta de las **42 líneas** del programa. | Código de clase |
| 06 | Mejorar la misma Tienda con `Padding`, `SingleChildScrollView` y distribución adaptable. | Propuesta para la copia |
| 07 | Hacer que el buscador reaccione con `StatefulWidget`, `createState`, `setState` y `onChanged`. | Propuesta para la copia |
| 08 | Lista de vehículos de prueba y filtro con `where`, `trim`, `toLowerCase`, `contains` y `toList`. | Propuesta para la copia |
| 09 | Agregar vehículos con `Form`, `TextFormField`, `validator`, `TextEditingController`, `dispose` y `SnackBar`. | Propuesta para la copia |
| 10 | Comprender eventos, estados y responsabilidad de cada parte de la Tienda con BLoC (sin adelantar código). | Propuesta conceptual |

## Archivos completos para verificar el avance

Los ejemplos son **versiones acumulativas de la misma Tienda**, y sirven para comparar el resultado después de construir los fragmentos del módulo.

| Etapa | Archivo de ejemplo | Qué representa |
| --- | --- | --- |
| 02 | [`paso_02_main.dart`](etapas/paso_02_main.dart) | Aplicación mínima y función principal |
| 03 | [`paso_03_tienda.dart`](etapas/paso_03_tienda.dart) | Título y contenido de la pantalla |
| 04 | [`paso_04_columna.dart`](etapas/paso_04_columna.dart) | Column, Row, texto e iconos |
| 05 | [`paso_05_buscador.dart`](etapas/paso_05_buscador.dart) | **Igual al main.dart original del docente** |
| 06 | [`paso_06_responsive.dart`](etapas/paso_06_responsive.dart) | Reorganización de la misma Tienda |
| 07 | [`paso_07_estado.dart`](etapas/paso_07_estado.dart) | Captura del texto de búsqueda |
| 08 | [`paso_08_filtro.dart`](etapas/paso_08_filtro.dart) | Filtrar nombres de vehículos de prueba |
| 09 | [`paso_09_formulario.dart`](etapas/paso_09_formulario.dart) | Validar y registrar vehículos en memoria |

Los archivos de las etapas 06 a 09 describen **posibles prácticas siguientes**, no avances que el docente ya haya realizado con sus estudiantes.

## Catálogo visual de widgets Flutter

En el menú lateral encontrarás la sección **Catálogo de widgets**:

- **128 widgets de referencia** organizados en 10 categorías: estructura y navegación, diseño, texto e imágenes, botones y formularios, listas, mensajes, gestos, estado/asíncrono, animación y Cupertino.
- **Vista previa conceptual** de cada widget elaborada con HTML y CSS para comprender su apariencia. Estas ilustraciones no sustituyen a ejecutar los widgets en Flutter.
- **Propiedades explicadas** con nombre, tipo y propósito, buscables desde el cuadro de detalle.
- **Ejemplo en Dart** de cada widget y enlace a su documentación oficial en `api.flutter.dev`.
- **Simulador de AppBar** para modificar el título, el color de fondo, el centrado, el icono inicial, los botones de acciones, la altura y la elevación. El ejemplo de código cambia junto a los controles.
- **Todas las 34 propiedades del constructor AppBar** también se muestran en el módulo 03 sobre la estructura de la pantalla `actividad2a`.
- Los componentes ya empleados en `actividad2a` están marcados «En actividad2a» para favorecer la secuencia didáctica.

La biblioteca no pretende sustituir el inventario completo de Flutter, que continúa evolucionando. Para el índice íntegro y actualizado: https://docs.flutter.dev/reference/widgets

**Acceso directo:** https://diln20.github.io/tallerFlutterDesarrollo/#catalogo-widgets

## Cómo usar la página

- Menú por módulos, enlaces directos y buscador que revisa **también las explicaciones internas**.
- Tema claro u oscuro y diseño adaptable.
- Copia de ejemplos y enlaces a archivos Dart completos.
- Avance y listas de verificación guardados localmente en el navegador.
- Ejercicios con soluciones orientativas y preguntas para explicar en clase.
- Explicaciones extensas en cuadros, tablas y lectura línea a línea.

## Publicación de GitHub Pages

El sitio utiliza `index.html`, `assets/styles.css` y `assets/app.js`. Está publicado desde la rama `main` en https://diln20.github.io/tallerFlutterDesarrollo/. No necesita compilación adicional porque es una página estática.

## Criterio de actualización

El proyecto **`actividad2a` del docente se conserva intacto**. La copia `actividad2a-guia` sirve para construir y verificar propuestas antes de incorporarlas a clase. Las explicaciones siempre deben respetar el orden didáctico, los conceptos ya vistos y el código auténtico. Las capturas deben proceder de pruebas reales y distinguirse de las ilustraciones.
