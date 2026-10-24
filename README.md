# Taller Flutter — Crear actividad2 desde cero

## Orden de enseñanza verificado (24 etapas y biblioteca)

Fundamentos 01–05 y después una bifurcación explícita:

- **Ruta A recomendada:** P1–P14, con P5.1 para el CRUD. Construye el
  formulario, crea carpetas, valida, crea objetos, implementa CRUD,
  reutiliza, navega, aplica BLoC, agrega el menú, amplía validaciones,
  consume FastAPI + PostgreSQL, introduce roles, pagina y evalúa usabilidad.
- **Ruta B opcional:** B1 diseño adaptable, B2 estado con setState,
  B3 filtrar listas y B4 BLoC del buscador. Comienza con OTRA copia del
  resultado de 05. Los nombres históricos paso_06, paso_07 y paso_08
  continúan siendo válidos para los ejemplos descargables.

En P11 el orden es PostgreSQL nativo en Windows primero, FastAPI después y
Flutter al final. Docker se presenta únicamente como opción alternativa.
Las propiedades y valores aparecen después de presentar el concepto y
antes de su comprobación práctica.

Ver [revisión del orden de la guía](docs/revision-orden-didactico-20261024.md).


**Guía web didáctica para crear el proyecto nuevo `actividad2` y construir la Tienda paso a paso.** Usa el antiguo `actividad2a` únicamente como referencia de clase.

**Página publicada:** https://diln20.github.io/tallerFlutterDesarrollo/  
**Repositorio:** https://github.com/diln20/tallerFlutterDesarrollo

## Inicio de la ruta didáctica: `actividad2`

El estudiante crea un proyecto **nuevo** desde la carpeta padre:

```powershell
flutter create --empty actividad2
cd actividad2
flutter run
```

**`--empty` no crea `main.dart` vacío**: genera un programa mínimo con `import`, `main()`, `MainApp`, `build()` y `Text('Hello World!')`. En el módulo 02 esos elementos se **reconocen sin copiar de nuevo**, y la primera modificación es cambiar `Hello World!` por `Primer widget`. La [plantilla mínima](etapas/paso_01_plantilla.dart) permite comparar el punto de partida.

Se mantiene una única separación clara: `actividad2` es el trabajo del estudiante y `actividad2a` la referencia del docente, respaldada en [codigo-base/main.dart](codigo-base/main.dart). Las ampliaciones opcionales 06–08 parten de la Tienda del módulo 05; no se mezclan automáticamente con el resultado de P7.

La interfaz de inicio utiliza un comando principal destacado, secuencia visual, estados de copia y nombres de archivos consistentes. Se han aplicado principios de [interface-design](https://github.com/Dammyjay93/interface-design/blob/main/.claude/skills/interface-design/SKILL.md) a la tipografía, proporciones, espaciado y accesibilidad, respetando el diseño preexistente.

## Vistas progresivas de la aplicación «Tienda»

El taller contiene ahora **15 módulos con comparaciones**, con **87 pasos** en las secciones «Así va cambiando tu aplicación», incluidas cuatro etapas nuevas después del primer formulario:

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

- **Preparación (módulo 01):** se conserva una sola guía visual para crear `DesarrolloMovilFlutter`, abrirla en VS Code, usar Terminal → Nuevo terminal, ejecutar `flutter create --empty actividad2` y ejecutar Flutter. Se quitó la secuencia Antes/Después duplicada de preparación; las comparaciones quedan en los otros 15 módulos.
- **Primer Dart:** se muestra siempre el archivo mínimo que Flutter ya genera, resaltando por turnos las líneas que se deben reconocer. No se duplican `import`, `main()`, `runApp` ni `MainApp`.
- **Cambios internos sin efecto visual:** cuando solo cambia una variable, un controlador, `StatefulWidget` o un método, se presenta un **mapa Antes → Después del código**, indicando claramente que la pantalla de Flutter continúa igual. Los pasos de lectura se identifican como tales, sin inventar nuevas modificaciones.
- **Cambios de interfaz:** la comparación enseña visualmente el widget añadido o modificado. Todas las salidas del editor, terminal y móvil son simulaciones didácticas, no capturas ni ejecuciones del equipo real.

**Exactitud pedagógica:** la vista es una simulación visual HTML y está identificada como tal. No representa una captura ni una ejecución real de Flutter. Los primeros módulos muestran la construcción del código de clase y los pasos 06–10 describen mejoras propuestas; algunos cambios de Dart (como declarar `StatefulWidget` o una variable) **no generan ningún cambio visual inmediato**, y así se señala explícitamente.

## Continuación del taller: carpetas, reutilización, validación y primer objeto

La nueva ruta de clases sigue el orden establecido, sin mezclar aún la rama opcional de filtros:

**01–05 → Primer formulario (P1) → Carpetas (P2) → Primer widget reutilizable (P3) → Validación (P4) → Primer objeto (P5) → CRUD con setState (P5.1) → Extraer widgets existentes (P6) → Páginas y navegación (P7) → Aplicar BLoC al CRUD (P8).**

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
Proyecto de referencia: `C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2a`  
Copia para preparar ejemplos: `C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2`

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

El proyecto **`actividad2a` del docente se conserva intacto**. La copia `actividad2` sirve para construir y verificar propuestas antes de incorporarlas a clase. Las explicaciones siempre deben respetar el orden didáctico, los conceptos ya vistos y el código auténtico. Las capturas deben proceder de pruebas reales y distinguirse de las ilustraciones.

## Comparaciones legibles a pantalla completa (octubre de 2026)

En todos los pasos «Así va cambiando tu aplicación», **Antes** y **Después** se muestran por separado, a todo el ancho, con texto más grande y mejor espacio para visualizar el explorador y los fragmentos Dart. Cada panel ahora incluye **Ver en pantalla completa**, que abre un visor de lectura; puede cerrarse con **Cerrar** o **Esc**. El botón **Vista compacta** conserva la comparación de dos columnas para quien la prefiera.

Los editores y teléfonos de estas comparaciones son ilustraciones HTML; el modo ampliado **no los convierte en capturas reales de Flutter ni ejecuta Dart**. Los formularios simulados conservan su interacción en la vista normal, no en el visor de lectura. La revisión visual se hace con Mi Terminal Commander.

## Explorador de archivos estilo VS Code

Las vistas didácticas «Antes/Después» del taller incorporan iconos SVG vectoriales creados en el proyecto, con colores distintos para Dart, YAML, carpetas, plataformas Android/iOS/Web/Windows/Linux/macOS, páginas, widgets, modelos, servicios, repositorios y BLoC. Se aplican en el editor original, las prácticas de creación de carpetas y archivos, y el visor ampliado. No necesitan conectarse a redes ni cargar bibliotecas externas. Son simulaciones visuales de VS Code, no capturas reales.

## Colores Dart consistentes

La paleta VS Code de FlutterLab ahora también se aplica a la plantilla inicial `actividad2/lib/main.dart`, las vistas con números de línea, las ventanas de ubicación y las tablas de explicación de Dart. Las instrucciones de PowerShell y los diagramas no se tratan como Dart. La sintaxis coloreada conserva el código y las líneas didácticas para copiar y estudiar.

## Inicio guiado desde Visual Studio Code

Primero crea manualmente la carpeta `DesarrolloMovilFlutter` en Documentos o una ubicación elegida. En Visual Studio Code selecciona **Archivo → Abrir carpeta** y elige `DesarrolloMovilFlutter`. Después abre **Terminal → Nuevo terminal**; comprueba que `Get-Location` termina en esa carpeta, ejecuta `flutter create --empty actividad2`, y luego `cd actividad2` y `flutter run`. El proyecto se guarda en `DesarrolloMovilFlutter/actividad2/`. El taller no crea físicamente carpetas en el equipo del estudiante.

### Pasos que no modifican la interfaz

Cuando un ejercicio solo pide reconocer líneas existentes, no debe mostrar dos teléfonos idénticos con un borde que sugiera modificaciones. En especial, el último paso del módulo 02 sobre `const` y `super.key` es de lectura: se verán las líneas relevantes del archivo Dart sin simular una modificación visual. Otros cambios de lógica que todavía no aparecen en pantalla se explican como comparación de código.

## Auditoría de continuidad didáctica (octubre de 2026)

El mapa completo de prerrequisitos, rutas, hallazgos y criterios de comprobación se encuentra en [Auditoría didáctica del 23 de octubre](docs/auditoria-continuidad-didactica-20261023.md).

**Ruta común:** 01–05 (proyecto, archivo main, jerarquía de Flutter, Row/Column y TextField). En el módulo 05 existe una bifurcación explícita. **Ruta A (recomendada):** P1–P7, desde formulario básico y controlador hasta carpetas, reutilización, validación, modelo de datos, extracción y navegación. **Ruta B (alternativa):** 06–08, desde la versión final del módulo 05 hacia espaciado, StatefulWidget con setState y listas/filtrado. Las rutas son ejercicios independientes; no se debe sobreescribir sin respaldo un main.dart avanzado con un ejemplo que vuelve al módulo 05. BLoC permanece conceptual y puede estudiarse después de cualquiera de las dos rutas.

Cada concepto nuevo se presenta con un bloque de prerrequisitos ANTES del fragmento que lo necesita: lista children, TextField/Expanded, variables/eventos/controller, argumentos required, if/null/validator, clase/objeto, VoidCallback, BuildContext/Navigator, espaciado, setState, List/where y evento/estado de BLoC. Se corrigieron enlaces de salida que enviaban de forma circular entre las rutas. Los archivos de referencia de la ruta A y de la ruta B siguen siendo independientes.

## Aplicación real de BLoC: ruta B después del módulo 08

El módulo BLoC incluye ahora **dos etapas diferenciadas**: primero el flujo conceptual `TextField → Evento → Bloc → Estado → BlocBuilder`, después una **práctica de 10 pasos** que construye un buscador real usando el paquete `flutter_bloc`. El punto de partida es [paso_08_filtro.dart](etapas/paso_08_filtro.dart), sin sobrescribir el formulario P1–P7 de la ruta A.

Archivos nuevos para estudiar o comparar (en el proyecto del estudiante se guardan en `lib/`):

- [busqueda_evento.dart](etapas/paso_15_bloc_evento.dart) → `lib/bloc/busqueda_evento.dart`
- [busqueda_estado.dart](etapas/paso_15_bloc_estado.dart) → `lib/bloc/busqueda_estado.dart`
- [busqueda_bloc.dart](etapas/paso_15_bloc.dart) → `lib/bloc/busqueda_bloc.dart`
- [main.dart con BlocProvider y BlocBuilder](etapas/paso_15_bloc_main.dart) → `lib/main.dart`

Primero se instala el paquete ejecutando `flutter pub add flutter_bloc` desde la terminal de VS Code ubicada en `DesarrolloMovilFlutter/actividad2`. Después se crean los archivos de evento, estado y BLoC, se conecta `BlocProvider`, se quita el filtrado antiguo de `build`, se emite el evento desde `onChanged` y se muestran los resultados en `BlocBuilder`. El ejercicio se prueba con búsquedas vacías, `Renault`, `MAZDA` y `xyz`. La simulación web solo ilustra el flujo y **no ejecuta Flutter**. El paquete utiliza la API con `on<Evento>` y `emit`; no se requieren Equatable, repositorios, llamadas a APIs ni estados de carga para este ejercicio.

## Analogías cotidianas y comprobaciones (2026-10-23)

El curso utiliza analogías cotidianas y correspondencias técnicas en 18 secciones, en los 87 pasos interactivos, en los 10 pasos de BLoC y en las fichas de los 128 widgets (77 específicas y 51 por familia). Cada módulo incluye también el límite de la comparación y una pregunta de comprobación.

Guía para el docente: [Analogías para enseñar Flutter](docs/guia-de-analogias-para-docentes.md). Validación sin dependencias: `node tests/verificar-analogias.mjs`.

## P8 — BLoC aplicado al CRUD de la Tienda

La ruta principal incluye una etapa nueva, [P8: aplicar BLoC al CRUD](https://diln20.github.io/tallerFlutterDesarrollo/#bloc-crud), situada **después de P7**.

- **La misma aplicación:** mantiene el modelo `Vehiculo`, `CampoNombreVehiculo`, `BotonTienda`, `TituloSeccion` y las páginas `AcercaPage` / `AyudaPage`.
- **Antes:** P5.1 usa `setState` para crear, editar y eliminar; P7 incorpora la navegación.
- **Después:** P8 instala `flutter_bloc` y mueve el inventario a `VehiculosBloc`. La pantalla envía eventos y reconstruye las partes afectadas con `BlocBuilder`.
- **Archivos nuevos:** `lib/bloc/vehiculos_evento.dart`, `lib/bloc/vehiculos_estado.dart` y `lib/bloc/vehiculos_bloc.dart`.
- **Operaciones:** crear, editar, cancelar edición, eliminar y buscar. Al filtrar, se usa el índice real del inventario para evitar editar o eliminar otro carro.
- **Práctica:** 12 pasos de construcción, con ubicación exacta, código de ejemplo, explicación de instrucciones y una simulación HTML de evento → estado. Esta simulación no ejecuta Flutter.
- **Ejemplo completo y pruebas:** [ejemplo_bloc_crud/](ejemplo_bloc_crud/) incluye el árbol `lib/`, `pubspec.yaml` y una prueba de las operaciones CRUD.

La anterior práctica BLoC del [módulo 10](https://diln20.github.io/tallerFlutterDesarrollo/#bloc) continúa disponible como **ruta B opcional centrada en el buscador**; no debe mezclarse con P8.

> El inventario permanece en memoria: no hay base de datos, almacenamiento local ni servicios externos. No se sobrescribe el proyecto `actividad2a` del docente.

## Continuación de la ruta principal después de BLoC: P9 → P10 → P11

El patrón BLoC se enseña al final de los conceptos de arquitectura en **P8**.
Después se conserva **la misma aplicación actividad2** y se añaden tres etapas de interfaz y datos:

- **[P9 · Menú hamburguesa](https://diln20.github.io/tallerFlutterDesarrollo/#menu-hamburguesa):** añade `Scaffold.drawer`, `DrawerHeader` y `ListTile` al `main.dart` de P8. Reutiliza AcercaPage y AyudaPage de P7. Archivo completo: [paso_16_menu_hamburguesa.dart](etapas/paso_16_menu_hamburguesa.dart).
- **[P10 · Validaciones fundamentales](https://diln20.github.io/tallerFlutterDesarrollo/#validaciones-esenciales):** campos reales para nombre, año, precio y correo; funciones `Validadores`, `int.tryParse`, `double.tryParse`, `RegExp` y `Form.validate()`. Actualiza `Vehiculo`, el evento `VehiculoGuardado`, el manejador del BLoC y el formulario. Consulta [los archivos de la etapa 17](etapas/paso_17_formulario_validado.dart).
- **[P11 · FastAPI + PostgreSQL](https://diln20.github.io/tallerFlutterDesarrollo/#api-postgres):** crea el backend Python en una carpeta hermana `tienda_api`, con base PostgreSQL local de Docker Compose y endpoints GET/POST/PUT/DELETE. Flutter agrega `http`, un repositorio, JSON, ID de vehículo y eventos BLoC asincrónicos. Consulta [ejemplo_api_postgres](ejemplo_api_postgres/) y las instrucciones de [backend](ejemplo_api_postgres/backend/README.md) y [Flutter](ejemplo_api_postgres/flutter/README.md).

La nueva guía enseña los archivos **paso a paso, por ubicación** y mantiene las analogías, explicaciones y bloques de referencia completos para revisión final. El sitio incluye un Drawer interactivo, un formulario de validación simulado y una demostración visual de solicitudes/respuestas HTTP; son simulaciones HTML, no conexiones reales al servidor de un estudiante.

**Nota:** el ejemplo de PostgreSQL usa credenciales locales demostrativas y no tiene autenticación. No es un backend de producción. La ruta opcional B mantiene su propia práctica BLoC del buscador sin mezclarla con esta línea principal.

## Ejemplos progresivos: teclado, BuildContext, InputDecoration y componentes

La guía ahora presenta cada concepto antes de pedir que se aplique:

1. Módulo 02: comprender `Widget build(BuildContext context)` parte por parte.
2. Módulo 05: `InputDecoration`, etiquetas, texto de ayuda, bordes, iconos y
   diferencias frente a controladores y validación.
3. P1: prevenir el desbordamiento vertical al abrir el teclado con
   `SingleChildScrollView`, sin utilizar `Expanded` vertical sin restricciones.
4. P2: crear siete carpetas, incluida `lib/utils/`, inicialmente vacías.
5. P3: reutilizar un `StatelessWidget`, construir un segundo componente
   `StatefulWidget` con `setState` y centralizar colores en `ColoresApp`.

Los bloques enlazan archivos completos en `etapas/`. El proyecto original
`actividad2a` sigue intacto; los ejemplos adicionales se trabajan
sobre la Tienda de `actividad2`.

[Detalle de archivos y comprobaciones](docs/conceptos-build-inputdecoration-scroll-widgets.md).

Para validar el contenido sin abrir Flutter:

~~~powershell
node tests/verificar-conceptos-flutter.mjs
node tests/validar-secuencia-flutter.mjs
~~~

## P5.1 ampliado: cómo listar objetos con ListView.builder

[Ver la explicación paso a paso](index.html#crud-listado-detallado)
y [el informe didáctico](docs/listview-builder-listtile-p51.md).

La sección explica uno a uno `List<Vehiculo>`, `ListView`, el constructor
`ListView.builder`, `itemCount`, `itemBuilder`, `context`, `indice`,
`vehiculos[indice]`, `ListTile`, `title`, `subtitle`, los cierres de
paréntesis y las opciones de la fila. También permite probar 0, 1 y 3
vehículos desde una demostración interactiva.

La variante que parte de P1 con `SingleChildScrollView` usa
`ListView.builder(shrinkWrap: true, physics: NeverScrollableScrollPhysics())`
sin envolverla en `Expanded` vertical. Se conserva y explica la variante
con `Expanded` para columnas de altura limitada. Las referencias
`etapas/paso_12b_crud.dart`, `paso_13_extraccion.dart` y
`paso_14_navegacion.dart` siguen la misma solución de P1.

Para verificar estos archivos:

~~~powershell
node tests/verificar-listado-crud.mjs
node tests/validar-secuencia-flutter.mjs
~~~
