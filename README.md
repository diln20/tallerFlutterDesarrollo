# Taller Flutter — Guía detallada basada en actividad2a

**Guía web didáctica para construir la aplicación «Tienda» paso a paso, basada en el código real que se utiliza en clase.** No cambia de proyecto ni incluye el cajero electrónico de otros talleres.

**Página publicada:** https://diln20.github.io/tallerFlutterDesarrollo/  
**Repositorio:** https://github.com/diln20/tallerFlutterDesarrollo

## Vistas progresivas de la aplicación «Tienda»

El taller contiene ahora **16 módulos**, con **90 pasos** en las secciones «Así va cambiando tu aplicación», incluidas cuatro etapas nuevas después del primer formulario:

- Pantallas **Antes / Después** para comparar los efectos de un cambio.
- Contorno amarillo alrededor del widget que aparece o cuya presentación se modifica.
- El fragmento Dart responsable y una explicación del efecto.
- Navegación por pasos, con botones «Anterior», «Siguiente» y acceso directo desde los bloques de código a su cambio correspondiente.
- Campo de búsqueda simulado que permite escribir y visualizar el estado, las coincidencias o el mensaje sin resultados.
- Primer formulario simulado en **9 pasos**, ahora construido directamente desde el `main.dart` original de 42 líneas: `Text`, `TextField` y `ElevatedButton` se insertan después de la `Row` real. Luego se enseña el cambio a `StatefulWidget`, `TextEditingController`, la acción `debugPrint`, `clear()` y `dispose()`, sin listas ni `for`.
- En teléfonos pequeños, selector entre Antes y Después en lugar de comprimir ambas pantallas.

### Vista ampliada y accesibilidad de las simulaciones

La sección **«Así va cambiando tu aplicación»** aparece **ampliada por defecto**: en lugar de colocar dos miniaturas una al lado de la otra, muestra **Antes** y **Después** a todo el ancho, en vertical, con tipografía más grande para las pantallas Flutter, el editor de VS Code, el Explorador y los comandos de terminal. Cada simulación tiene un botón **«↙ Vista compacta»** para recuperar el diseño reducido; al pulsarlo, cambia a **«⤢ Ampliar comparación»**. La preferencia se conserva al cambiar de paso dentro del mismo módulo. En móviles se mantiene el selector Antes/Después.

### Antes y después: diferencias comprobables

La comparación ya no repite el mismo código o la misma imagen cuando el paso ocurre en el editor o en la terminal:

- **Preparación:** primero VS Code sin carpeta; después el Explorador con `actividad2a → lib → main.dart` seleccionado. En el siguiente paso, el comando `flutter pub get` pasa de pendiente a una **salida ilustrativa** (la página no ejecuta órdenes); `flutter run` lleva a la representación de la Tienda.
- **Primer Dart:** las instrucciones `import`, `main()`, `runApp` y `MainApp` aparecen progresivamente. Nunca se muestra un archivo completo antes de que el estudiante haya añadido sus partes.
- **Cambios internos sin efecto visual:** cuando solo cambia una variable, un controlador, `StatefulWidget` o un método, se presenta un **mapa Antes → Después del código**, indicando claramente que la pantalla de Flutter continúa igual. Los pasos de lectura se identifican como tales, sin inventar nuevas modificaciones.
- **Cambios de interfaz:** la comparación enseña visualmente el widget añadido o modificado. Todas las salidas del editor, terminal y móvil son simulaciones didácticas, no capturas ni ejecuciones del equipo real.

**Exactitud pedagógica:** la vista es una simulación visual HTML y está identificada como tal. No representa una captura ni una ejecución real de Flutter. Los primeros módulos muestran la construcción del código de clase y los pasos 06–10 describen mejoras propuestas; algunos cambios de Dart (como declarar `StatefulWidget` o una variable) **no generan ningún cambio visual inmediato**, y así se señala explícitamente.

## Continuación del taller: carpetas, reutilización, validación y primer objeto

La nueva ruta de clases sigue el orden establecido, sin mezclar aún la rama opcional de filtros:

**01–05 → Primer formulario (P1) → Carpetas (P2) → Primer widget reutilizable (P3) → Validación (P4) → Primer objeto (P5) → Extraer widgets existentes (P6) → Páginas y navegación (P7).**

- **P2 — Crear carpetas:** crear únicamente `lib/pages/`, `lib/widgets/`, `lib/models/`, `lib/services/`, `lib/repositories/` y `lib/bloc/`. Explicar la finalidad futura de cada carpeta. **No crear clases, mover main.dart ni agregar lógica en esta etapa.** En Git las carpetas vacías no suelen aparecer hasta que contienen un archivo.
- **P3 — Reutilización:** ahora sí utilizar `lib/widgets/` con el archivo `titulo_seccion.dart`, que contiene un `StatelessWidget` con el parámetro `required this.texto`. En `main.dart` se importa y se usa **dos veces**, sin cambiar el aspecto ni el funcionamiento del formulario.
- **P4 — Validación:** transformar únicamente el segundo campo en `TextFormField`, declarar `GlobalKey<FormState>`, colocarlo dentro de `Form`, agregar `validator` y llamar `validate()` desde `onPressed`. Se prueban entradas vacías, de menos de tres caracteres y válidas.
- **P5 — Primer objeto:** crear `lib/models/vehiculo.dart`, definir la clase `Vehiculo` con `String nombre` y `bool disponible`, importarla y construir `final vehiculo = Vehiculo(nombre: nombre)` después de validar. `debugPrint` enseña las propiedades del objeto. **Todavía no se guarda en una lista ni en una base de datos.**


- **P6 — Extraer widgets reales:** de la Tienda que ya funciona se saca el <code>TextFormField</code> con su <code>validator</code> a <code>lib/widgets/campo_nombre_vehiculo.dart</code>, y la apariencia de <code>ElevatedButton</code> a <code>lib/widgets/boton_tienda.dart</code>. <code>main.dart</code> conserva <code>vehiculoController</code>, <code>formularioKey</code>, la creación de <code>Vehiculo</code> y <code>dispose()</code>. BotonTienda recibe un <code>VoidCallback</code> para que las pantallas elijan qué acción ejecutar.
- **P7 — Crear dos páginas y navegar:** en <code>lib/pages/</code> se crean <code>acerca_page.dart</code> y <code>ayuda_page.dart</code>. Las páginas son <code>StatelessWidget</code> con <code>Scaffold</code>, título y botones. La navegación utiliza <code>Navigator.push</code> para avanzar y <code>Navigator.pop</code> para regresar. Como el <code>build</code> de <code>MainApp</code> crea <code>MaterialApp</code>, su botón de navegación se rodea con <code>Builder</code> para obtener un <code>context</code> válido dentro de MaterialApp.

**Importante para enseñar:** P3 reutiliza un título de texto; P6 demuestra la extracción de widgets que ya existen y tienen comportamiento. P7 no obliga a mover la Tienda a otra página ni añade rutas con nombres o BLoC. Las simulaciones del sitio muestran el proceso, pero no ejecutan Flutter por sí solas.

**Inicio de clase más visual:** P6 incorpora un mapa de responsabilidades para identificar qué debe permanecer en `_MainAppState` y qué se extrae a `lib/widgets/`. P7 presenta la navegación en dos objetivos sencillos: **Tienda → Acerca de** y luego **Acerca de → Ayuda**, antes de mostrar el código. El mismo `BotonTienda` se reutiliza en las tres pantallas con distintas acciones.

**Enlaces directos:** [Extraer widgets reutilizables](https://diln20.github.io/tallerFlutterDesarrollo/#extraccion) · [Crear páginas y navegar](https://diln20.github.io/tallerFlutterDesarrollo/#navegacion).

Cada bloque incluye archivo, ubicación exacta, qué buscar con Ctrl + F, acción (crear, añadir o reemplazar), explicación del contenido y comparación final. Los archivos Dart de `etapas/` son **copias de referencia**, no una segunda carpeta `lib` que haya que mezclar con el proyecto de los estudiantes.

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

### Resaltado de instrucciones (líneas de cambio)

En **todos los 44 bloques del material escrito** y en las **51 etapas «Antes / Después»**, el código identifica visualmente las líneas relevantes, no solo su sintaxis:

- **Verde:** instrucciones o widgets que se **añaden** en el paso.
- **Ámbar:** líneas que hay que **modificar o reemplazar**.
- **Azul:** líneas que se deben **observar o comprobar**; no se añaden una segunda vez.
- **Cian:** comandos para ejecutar en la terminal.

Una leyenda sobre cada bloque explica la acción y el número de líneas señaladas. En los archivos finales de etapas acumulativas se distinguen los cambios frente a la etapa anterior. La práctica de formulario se compara directamente con el código base, no con la práctica opcional de filtros.

El marcado se genera con elementos de visualización que **no alteran el texto copiado**: `Copiar código` mantiene intactas las instrucciones, su indentación y sus saltos de línea. Este mecanismo también funciona al navegar entre pasos de las simulaciones y en los ejemplos del catálogo de widgets.

### Explicación detallada de cada instrucción

El sitio incluye debajo de cada ejemplo (lecciones, simulaciones Antes/Después y catálogo) un apartado desplegable **«Explicación del código, línea por línea»**:

- Explica cada línea no vacía: widgets, funciones, variables, propiedades, operadores y comandos de terminal.
- Aclara qué cierran `)`, `]`, `}` y las comas, tomando en cuenta las estructuras abiertas dentro del fragmento.
- Diferencia el `TextField` original del segundo campo con `TextEditingController`, por qué se declara en `State`, y qué hacen `controller.text`, `debugPrint`, `clear()` y `dispose()`.
- En los ejemplos conceptuales indica cuándo se trata de esquemas o código incompleto que no debe copiarse.
- Los apartados se mantienen cerrados por defecto, pero el estudiante puede abrirlos sin abandonar el paso. No alteran «Copiar código» ni requieren editar el programa original.

**Corrección didáctica:** en la práctica del primer formulario no se registra ningún vehículo en una lista. El botón imprime el nombre en la consola y limpia el campo. El módulo de filtros es una ampliación independiente; la explicación de BLoC utiliza esos casos como ejemplos futuros, sin afirmar que estén integrados.

## Barrido de consistencia y ubicación de todos los fragmentos

Ahora **todos los bloques de código del curso** tienen una ficha de ubicación, al igual que **todos los pasos de las simulaciones «Antes / Después»**. En cada ficha se indica:

- **Destino:** `lib/main.dart` de una copia de práctica o **PowerShell/terminal**, según el caso.
- **Contenedor exacto:** `MainApp`, `build`, `Scaffold.body`, `Column.children`, `Row.children`, `TextField.decoration`, etc.
- **Ancla localizable con Ctrl + F**, más la acción: añadir, reemplazar, comparar, ejecutar o leer.
- **Referencia desplegable con líneas numeradas**, cuando el fragmento tiene correspondencia en un archivo Dart del repositorio.
- Advertencia y desactivación de copia para **diagramas, pseudocódigo, extractos incompletos** y pasos de comprobación que no deben copiarse otra vez.

El **catálogo de widgets** muestra una indicación contextual distinta: `AppBar` en `Scaffold.appBar`, `Drawer` en `Scaffold.drawer`, `Expanded` dentro de `Row` o `Column`, `SnackBar` mediante `ScaffoldMessenger`, diálogos mediante `showDialog`, etc. Son ejemplos de consulta, no instrucciones de pegarlos todos en la Tienda.

**Ruta didáctica principal:** módulos 01–05 (código original) → formulario básico P1 → carpetas vacías P2 → reutilización P3 → validación P4 → primer objeto P5 → extracción de widgets P6 → páginas sencillas y navegación P7. Se conserva el nombre del archivo `paso_09_formulario.dart` para no romper enlaces de referencias previas. Las ampliaciones 06–08 (diseño, búsqueda interactiva y filtros) son una **ruta opcional independiente**, y BLoC continúa siendo conceptual. La práctica P1 no requiere `for`, `where` ni `List<String>`.

**Limitación de verificación:** los ejemplos y ubicaciones se contrastaron contra los archivos versionados del repositorio, incluida la instantánea `codigo-base/main.dart`. Esto no equivale a comprobar el proyecto local de los estudiantes en este momento ni a ejecutar Flutter en su equipo.

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

Se revisó la instantánea versionada de [`codigo-base/main.dart`](codigo-base/main.dart) y [`codigo-base/pubspec.yaml`](codigo-base/pubspec.yaml). **El `main.dart` de referencia tiene 42 líneas.** La página explica una por una, incluidas llaves, comas, paréntesis y listas de widgets.

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
| P2 | Crear las seis carpetas organizativas vacías y explicar su propósito sin mover clases ni escribir lógica. | Guía paso a paso |
| P3 | Reutilizar un widget de texto creado en `lib/widgets/titulo_seccion.dart` y utilizado dos veces. | Guía y código final |
| P4 | Validar el campo con `Form`, `TextFormField`, `GlobalKey<FormState>` y `validator`. | Guía y código final |
| P5 | Definir el modelo `Vehiculo`, instanciarlo con el nombre validado y leer sus propiedades. | Guía y código final |
| P6 | Extraer el TextFormField y el ElevatedButton del main.dart como CampoNombreVehiculo y BotonTienda. | Guía y código final |
| P7 | Crear AcercaPage y AyudaPage; navegar con Navigator.push y Navigator.pop. | Guía y código final |
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
| P3 · componente | [`paso_10_titulo_seccion.dart`](etapas/paso_10_titulo_seccion.dart) | Definición reutilizable de `TituloSeccion` destinada a `lib/widgets/` |
| P3 · Tienda | [`paso_10_reutilizacion.dart`](etapas/paso_10_reutilizacion.dart) | Importar y utilizar `TituloSeccion` en dos títulos de la aplicación |
| P4 · Tienda | [`paso_11_validacion.dart`](etapas/paso_11_validacion.dart) | `Form` con reglas de nombre obligatorio y longitud mínima de tres caracteres |
| P5 · modelo | [`paso_12_vehiculo.dart`](etapas/paso_12_vehiculo.dart) | Clase de datos `Vehiculo` destinada a `lib/models/` |
| P5 · Tienda | [`paso_12_objeto.dart`](etapas/paso_12_objeto.dart) | Botón validado que crea el objeto y muestra sus propiedades |
| P6 · campo | [`paso_13_campo_nombre_vehiculo.dart`](etapas/paso_13_campo_nombre_vehiculo.dart) | Widget de entrada validable y reutilizable |
| P6 · botón | [`paso_13_boton_tienda.dart`](etapas/paso_13_boton_tienda.dart) | BotonTienda con argumento texto y VoidCallback |
| P6 · Tienda | [`paso_13_extraccion.dart`](etapas/paso_13_extraccion.dart) | main.dart tras extraer campo y botón |
| P7 · Ayuda | [`paso_14_ayuda_page.dart`](etapas/paso_14_ayuda_page.dart) | AyudaPage con Navigator.pop para regresar |
| P7 · Acerca | [`paso_14_acerca_page.dart`](etapas/paso_14_acerca_page.dart) | AcercaPage que abre AyudaPage con Navigator.push |
| P7 · Tienda | [`paso_14_navegacion.dart`](etapas/paso_14_navegacion.dart) | main.dart final con Builder y botón de navegación |

Los archivos de las etapas 06 a 14 describen **prácticas de enseñanza propuestas** y referencias verificables en GitHub; no implican que ya estén implementadas en el computador de los estudiantes. Las carpetas P2 se crean durante la clase y no contienen archivos hasta las siguientes etapas.

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
