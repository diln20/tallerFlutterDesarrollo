# Taller Flutter — Guía detallada basada en actividad2a

**Guía web didáctica para construir la aplicación «Tienda» paso a paso, basada en el código real que se utiliza en clase.** No cambia de proyecto ni incluye el cajero electrónico de otros talleres.

**Página publicada:** https://diln20.github.io/tallerFlutterDesarrollo/  
**Repositorio:** https://github.com/diln20/tallerFlutterDesarrollo

## Vistas progresivas de la aplicación «Tienda»

Cada uno de los **10 módulos** presenta ahora una sección **«Así va cambiando tu aplicación»**, con **51 pasos** en total:

- Pantallas **Antes / Después** para comparar los efectos de un cambio.
- Contorno amarillo alrededor del widget que aparece o cuya presentación se modifica.
- El fragmento Dart responsable y una explicación del efecto.
- Navegación por pasos, con botones «Anterior», «Siguiente» y acceso directo desde los bloques de código a su cambio correspondiente.
- Campo de búsqueda simulado que permite escribir y visualizar el estado, las coincidencias o el mensaje sin resultados.
- Primer formulario simulado en **9 pasos**, ahora construido directamente desde el `main.dart` original de 42 líneas: `Text`, `TextField` y `ElevatedButton` se insertan después de la `Row` real. Luego se enseña el cambio a `StatefulWidget`, `TextEditingController`, la acción `debugPrint`, `clear()` y `dispose()`, sin listas ni `for`.
- En teléfonos pequeños, selector entre Antes y Después en lugar de comprimir ambas pantallas.

**Exactitud pedagógica:** la vista es una simulación visual HTML y está identificada como tal. No representa una captura ni una ejecución real de Flutter. Los primeros módulos muestran la construcción del código de clase y los pasos 06–10 describen mejoras propuestas; algunos cambios de Dart (como declarar `StatefulWidget` o una variable) **no generan ningún cambio visual inmediato**, y así se señala explícitamente.

## Dónde va cada fragmento del primer formulario

**Corrección de secuencia:** el `for (final vehiculo in resultados)` mostrado anteriormente fue una propuesta del módulo 08; no pertenece al proyecto original. El módulo 09 se ha reconstruido directamente desde [`codigo-base/main.dart`](codigo-base/main.dart): inserta su primer `Text` después de la `Row` existente. El botón imprime con `debugPrint` en la consola de Flutter, sin añadir elementos a una lista.



En el **módulo 09** aparecen ayudas de ubicación para los nueve pasos, tanto en el contenido escrito como bajo la simulación «Así va cambiando tu aplicación»:

- Archivo de destino: `lib/main.dart`.
- Clase, método y widget contenedor exactos donde se debe trabajar.
- Texto ancla que se puede encontrar con **Ctrl + F**.
- Acción explícita: **AÑADIR**, **REEMPLAZAR**, **INSERTAR LÍNEA**, **DECLARAR**, **AÑADIR MÉTODO** o **COMPROBAR**.
- **Código contextual numerado**, con las líneas recién insertadas o modificadas resaltadas y una opción desplegable para ver el `main.dart` tal como queda después de ese paso.
- Enlace directo a las líneas correspondientes del archivo Dart final.

Las referencias de línea pueden variar según los cambios particulares que haga cada estudiante; por ello la indicación principal es el **ancla de código y la estructura del widget**, no depender de un número fijo.

> **Capturas antiguas:** si un navegador muestra los pasos «Preparar FormState y controller», «Dibujar TextFormField» o «Validar un campo vacío», corresponde a una versión anterior y más avanzada. Ahora el módulo 09 trabaja con `Text`, `TextField`, `ElevatedButton` y después `TextEditingController`; no requiere `Form` ni `validator`. Se incorporó también una aclaración desplegable para ubicar esos fragmentos antiguos, sin mezclarlos con la práctica básica. Puede ser necesario actualizar con **Ctrl + F5**.

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
| 09 | Primer formulario inmediato, a partir del código original del módulo 05: `Text`, `TextField`, `ElevatedButton`, conversión a `StatefulWidget`, `TextEditingController`, salida con `debugPrint`, `clear()` y `dispose()`; sin listas, ciclos `for` ni `Form`. | Propuesta para la copia |
| 10 | Comprender eventos, estados y responsabilidad de cada parte de la Tienda con BLoC (sin adelantar código). | Propuesta conceptual |

**En particular, el módulo 09** incluye los fragmentos completos, botones «Copiar código», explicación de parámetros y signos de Dart, instrucciones de reemplazo (para no duplicar widgets), simulaciones antes/después y un `main.dart` final de comparación. También aclara que `...` en explicaciones puede representar contenido omitido y **no debe pegarse como un marcador de código**; los ejemplos para copiar no contienen código sustituido por puntos suspensivos.

## Archivos completos para verificar el avance

Los módulos 02–08 son reconstrucciones y ampliaciones opcionales de la misma Tienda. **La práctica 09 toma como punto de partida el código original del módulo 05**, sin requerir las propuestas 06–08; por eso su `main.dart` no contiene `for`, `resultados` ni una lista de vehículos.

| Etapa | Archivo de ejemplo | Qué representa |
| --- | --- | --- |
| 02 | [`paso_02_main.dart`](etapas/paso_02_main.dart) | Aplicación mínima y función principal |
| 03 | [`paso_03_tienda.dart`](etapas/paso_03_tienda.dart) | Título y contenido de la pantalla |
| 04 | [`paso_04_columna.dart`](etapas/paso_04_columna.dart) | Column, Row, texto e iconos |
| 05 | [`paso_05_buscador.dart`](etapas/paso_05_buscador.dart) | **Igual al main.dart original del docente** |
| 06 | [`paso_06_responsive.dart`](etapas/paso_06_responsive.dart) | Reorganización de la misma Tienda |
| 07 | [`paso_07_estado.dart`](etapas/paso_07_estado.dart) | Captura del texto de búsqueda |
| 08 | [`paso_08_filtro.dart`](etapas/paso_08_filtro.dart) | Filtrar nombres de vehículos de prueba |
| 09 | [`paso_09_formulario.dart`](etapas/paso_09_formulario.dart) | La misma Tienda original más Text, TextField y botón: leer e imprimir el texto en consola, limpiar campo y liberar recursos |

Los archivos de las etapas 06 a 09 describen **posibles prácticas siguientes**, no avances que el docente ya haya realizado con sus estudiantes.

## Catálogo visual de widgets Flutter

En el menú lateral encontrarás la sección **Catálogo de widgets**:

- **128 widgets de referencia** organizados en 10 categorías: estructura y navegación, diseño, texto e imágenes, botones y formularios, listas, mensajes, gestos, estado/asíncrono, animación y Cupertino.
- **Vista previa conceptual** de cada widget elaborada con HTML y CSS para comprender su apariencia. Estas ilustraciones no sustituyen a ejecutar los widgets en Flutter.
- **Propiedades explicadas** en cuatro columnas: nombre, tipo, valor de ejemplo y propósito, con búsqueda en la ficha de cada widget.
- **Ejemplo en Dart** de cada widget, una vista ilustrativa en formato celular y enlace a la documentación oficial en `api.flutter.dev`.
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
