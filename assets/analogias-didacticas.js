/* Analogías de la Tienda: ejemplos cotidianos acompañados de su equivalencia técnica. */
window.FlutterLabAnalogias = {
  "version": "2026-10-23",
  "modulos": {
    "inicio": {
      "titulo": "Aprender Flutter es como aprender a construir una tienda",
      "cotidiano": "Nadie empieza una tienda instalando la caja registradora, los letreros y el inventario al mismo tiempo. Primero prepara el local, después organiza los muebles y por último atiende a los clientes.",
      "equivalencias": [
        [
          "Preparar el local",
          "Crear `actividad2` y abrirlo en VS Code"
        ],
        [
          "Organizar estantes",
          "Construir widgets y distribuirlos"
        ],
        [
          "Atender pedidos",
          "Responder a eventos, validar y navegar"
        ]
      ],
      "cuidado": "Es una comparación de la secuencia de aprendizaje: Flutter no construye una tienda real ni guarda automáticamente sus ventas.",
      "pregunta": "¿Tiene sentido programar el filtro antes de crear el campo de búsqueda?",
      "respuesta": "No. Primero se crea la interfaz y se comprende cómo recibe datos; después se añade la lógica del filtro."
    },
    "preparacion": {
      "titulo": "La carpeta principal es como la mochila del curso",
      "cotidiano": "En tu mochila guardas distintos cuadernos. `DesarrolloMovilFlutter` es la mochila y `actividad2` es uno de los cuadernos. VS Code abre la mochila para que puedas trabajar; la terminal es donde escribes las instrucciones.",
      "equivalencias": [
        [
          "Mochila",
          "Carpeta `DesarrolloMovilFlutter`"
        ],
        [
          "Cuaderno",
          "Proyecto `actividad2` con `lib/main.dart`"
        ],
        [
          "Dar la orden de preparar un cuaderno",
          "`flutter create --empty actividad2` en la terminal"
        ]
      ],
      "cuidado": "El comando crea el proyecto dentro de la carpeta donde está la terminal; no es código que se escriba dentro de `main.dart`.",
      "pregunta": "Si la terminal ya está dentro de `actividad2`, ¿debes volver a ejecutar `flutter create --empty actividad2`?",
      "respuesta": "No. La creación se hace una sola vez desde `DesarrolloMovilFlutter`; después entras a `actividad2` para ejecutar la aplicación."
    },
    "punto-entrada": {
      "titulo": "El arranque de Flutter se parece a abrir un teatro",
      "cotidiano": "Para presentar una obra hay una señal de inicio, alguien que levanta el telón y un plano de lo que se verá en el escenario.",
      "equivalencias": [
        [
          "Señal de inicio",
          "`main()`"
        ],
        [
          "Levantar el telón",
          "`runApp(const MainApp())`"
        ],
        [
          "Plano del escenario",
          "`build()` devuelve widgets"
        ]
      ],
      "cuidado": "`build()` describe la interfaz que Flutter debe mostrar; no debes crear una segunda función `main()` ni otra clase `MainApp` al leer la plantilla.",
      "pregunta": "¿Qué línea cambiarías para sustituir «Hello World!» sin reescribir todo el teatro?",
      "respuesta": "Solo la cadena dentro del `Text` existente, conservando `main()`, `runApp()` y la clase generada."
    },
    "estructura": {
      "titulo": "Scaffold funciona como el plano de un local",
      "cotidiano": "Una tienda tiene un marco, un letrero superior y una zona donde se colocan los productos. Cada parte tiene su sitio.",
      "equivalencias": [
        [
          "Reglas generales del local",
          "`MaterialApp`"
        ],
        [
          "Estructura de la pantalla",
          "`Scaffold`"
        ],
        [
          "Letrero y área central",
          "`AppBar` y `body`"
        ]
      ],
      "cuidado": "`Scaffold` no crea por sí mismo los productos ni las acciones: solo ofrece una estructura donde colocar widgets.",
      "pregunta": "¿Dónde colocarías un `Text` que debe verse debajo del letrero?",
      "respuesta": "Dentro de `Scaffold.body`, no dentro del título del `AppBar`."
    },
    "diseno": {
      "titulo": "Row y Column son dos maneras de acomodar productos",
      "cotidiano": "En un estante puedes apilar cajas una encima de otra o ponerlas una al lado de otra. Un espacio vacío separa los productos para que no se vean pegados.",
      "equivalencias": [
        [
          "Cajas una debajo de otra",
          "`Column(children: [...])`"
        ],
        [
          "Cajas lado a lado",
          "`Row(children: [...])`"
        ],
        [
          "Separador entre cajas",
          "`SizedBox`"
        ]
      ],
      "cuidado": "Los corchetes de `children` contienen widgets; `Row` y `Column` no eligen automáticamente el tamaño ni impiden todo desbordamiento.",
      "pregunta": "¿Qué cambiarías para pasar de una lista vertical de iconos a una fila?",
      "respuesta": "Usar `Row` en lugar de `Column`, conservando los widgets en `children`."
    },
    "campo-texto": {
      "titulo": "TextField es como un espacio para escribir una solicitud",
      "cotidiano": "En el mostrador de una tienda hay un cartel fijo «Buscar vehículo» y una casilla en blanco donde el cliente escribe lo que necesita.",
      "equivalencias": [
        [
          "Cartel que solo informa",
          "`Text('Buscar vehículo')`"
        ],
        [
          "Casilla en la que se escribe",
          "`TextField`"
        ],
        [
          "Ejemplo escrito dentro de la casilla",
          "`hintText`"
        ]
      ],
      "cuidado": "Escribir «Renault» en un `TextField` no inicia una búsqueda por sí solo. El campo recibe texto; la lógica llegará después.",
      "pregunta": "Si ves «Buscar marca o modelo» dentro de un campo vacío, ¿es un vehículo ya almacenado?",
      "respuesta": "No. Es el texto de ayuda de `hintText`, no el valor que escribió el usuario."
    },
    "proyecto": {
      "titulo": "Un botón es como el timbre del mostrador",
      "cotidiano": "El cliente escribe un pedido y después pulsa un timbre. El timbre no conoce el pedido; alguien debe leerlo cuando suena.",
      "equivalencias": [
        [
          "Nota escrita por el cliente",
          "Contenido del `TextField`"
        ],
        [
          "Timbre que avisa",
          "`onPressed` del botón"
        ],
        [
          "Persona que lee la nota",
          "`TextEditingController.text`"
        ]
      ],
      "cuidado": "El botón no crea automáticamente un objeto ni guarda el dato. `dispose()` libera el controlador cuando ya no se necesita.",
      "pregunta": "¿Cuándo se ejecuta lo que está dentro de `onPressed`?",
      "respuesta": "Cuando el usuario pulsa el botón, no cuando Flutter dibuja la pantalla."
    },
    "carpetas": {
      "titulo": "Separar archivos es como usar un archivador",
      "cotidiano": "En una oficina no mezclas contratos, planos y recibos en un mismo cajón. Pones etiquetas a las carpetas para saber dónde pertenece cada cosa.",
      "equivalencias": [
        [
          "Planos de las pantallas",
          "`pages/`"
        ],
        [
          "Piezas visuales que se reutilizan",
          "`widgets/`"
        ],
        [
          "Fichas de los vehículos",
          "`models/`"
        ]
      ],
      "cuidado": "Crear una carpeta no crea automáticamente una clase o una funcionalidad. Por ahora solo organizamos lugares vacíos para usar después.",
      "pregunta": "¿Se ejecutará una página de ayuda por el solo hecho de crear la carpeta `pages`?",
      "respuesta": "No. Después habrá que crear un archivo Dart con el widget correspondiente e importarlo donde se necesite."
    },
    "reutilizacion": {
      "titulo": "Un widget reutilizable es como un sello con texto configurable",
      "cotidiano": "En lugar de dibujar a mano el mismo encabezado en cada hoja, tienes un sello. Puedes usarlo varias veces y cambiar el texto que estampa.",
      "equivalencias": [
        [
          "Molde del sello",
          "Clase `TituloSeccion`"
        ],
        [
          "Texto que le entregas al sello",
          "Parámetro `texto` del constructor"
        ],
        [
          "Usar el mismo sello en dos hojas",
          "Crear dos instancias del widget"
        ]
      ],
      "cuidado": "Reutilizar no es copiar y pegar líneas idénticas en muchos archivos; es tener una definición y pasarle datos cuando se utiliza.",
      "pregunta": "Si necesitas dos títulos distintos, ¿debes crear dos clases `TituloSeccion`?",
      "respuesta": "No. Crea dos instancias de la misma clase, cada una con su valor de `texto`."
    },
    "validacion": {
      "titulo": "El validator es el portero que revisa un formulario",
      "cotidiano": "Antes de dejar pasar una solicitud, una persona verifica si los datos cumplen las reglas: hay nombre, tiene suficientes letras y no está vacío.",
      "equivalencias": [
        [
          "Formulario entregado",
          "`Form` con `TextFormField`"
        ],
        [
          "Reglas de admisión",
          "Función `validator`"
        ],
        [
          "Revisar todas las reglas ahora",
          "`formKey.currentState?.validate()`"
        ]
      ],
      "cuidado": "`return null` quiere decir «sin error de validación»; no guarda el vehículo ni significa que todo el proyecto haya terminado correctamente.",
      "pregunta": "¿Qué debe devolver el validador cuando el nombre es correcto?",
      "respuesta": "`null`; cuando es incorrecto devuelve un mensaje como `'Ingresa un nombre'`."
    },
    "objeto": {
      "titulo": "Una clase es el formato y el objeto es la ficha diligenciada",
      "cotidiano": "Un concesionario tiene un formulario en blanco que dice «nombre» y «disponible». Cada automóvil registrado es una ficha con sus propios valores.",
      "equivalencias": [
        [
          "Plantilla de la ficha",
          "`class Vehiculo`"
        ],
        [
          "Casillas de la ficha",
          "Propiedades como `nombre` y `disponible`"
        ],
        [
          "Ficha específica de un Renault",
          "Instancia `Vehiculo(...)`"
        ]
      ],
      "cuidado": "Construir un objeto en memoria no lo guarda automáticamente en una base de datos ni lo añade a una colección permanente.",
      "pregunta": "Si creas dos objetos de `Vehiculo`, ¿tienen que compartir el mismo nombre?",
      "respuesta": "No. Comparten el molde de la clase, pero cada instancia recibe sus propios datos."
    },
    "extraccion": {
      "titulo": "Extraer widgets se parece a construir con piezas LEGO",
      "cotidiano": "Si el mismo volante se usa en varios modelos, conviene fabricar una pieza reutilizable y conectarla donde haga falta, en lugar de esculpirla de nuevo cada vez.",
      "equivalencias": [
        [
          "Pieza reutilizable",
          "`CampoNombreVehiculo` o `BotonTienda`"
        ],
        [
          "Conector que lleva una orden",
          "Parámetro `VoidCallback`"
        ],
        [
          "Modelo que decide qué hacer",
          "Pantalla dueña del formulario y la lógica"
        ]
      ],
      "cuidado": "Separar un widget no debe duplicar su controlador ni desplazar la validación a lugares sin acceso al `Form` original.",
      "pregunta": "¿Por qué pasas `guardarVehiculo` y no `guardarVehiculo()` como callback?",
      "respuesta": "Para entregar la función y ejecutarla al pulsar, en lugar de ejecutarla inmediatamente durante la construcción."
    },
    "navegacion": {
      "titulo": "Navegar se parece a apilar páginas de un cuaderno",
      "cotidiano": "Abres una hoja de información sobre la actual. Para regresar, retiras la hoja de arriba y vuelves a ver la anterior.",
      "equivalencias": [
        [
          "Abrir la siguiente hoja",
          "`Navigator.push`"
        ],
        [
          "Volver a la hoja anterior",
          "`Navigator.pop`"
        ],
        [
          "Indicar qué página construir",
          "`MaterialPageRoute`"
        ]
      ],
      "cuidado": "Cambiar de página no crea una nueva aplicación. `BuildContext` permite localizar el `Navigator` correcto desde un widget.",
      "pregunta": "¿Qué llamada usarías en el botón «Volver»?",
      "respuesta": "`Navigator.pop(context)` para cerrar la página actual y regresar."
    },
    "responsive": {
      "titulo": "Una interfaz adaptable es como ordenar una maleta",
      "cotidiano": "Cuando la maleta es estrecha, acomodas los objetos, dejas espacio alrededor y permites ver el contenido restante por partes en vez de cortarlo.",
      "equivalencias": [
        [
          "Espacio entre la ropa y la maleta",
          "`Padding`"
        ],
        [
          "Consultar lo que quedó fuera del área visible",
          "`SingleChildScrollView`"
        ],
        [
          "Ceder espacio al texto largo",
          "`Expanded` o distribución flexible"
        ]
      ],
      "cuidado": "`Padding` es espacio interior, no zoom. El desplazamiento evita recortar contenido, pero no reemplaza un diseño que respete los anchos disponibles.",
      "pregunta": "Si una pantalla pequeña no permite ver el final del formulario, ¿qué widget facilita desplazar el contenido?",
      "respuesta": "`SingleChildScrollView`, colocado alrededor del contenido que debe desplazarse."
    },
    "estado": {
      "titulo": "setState es como actualizar un tablero visible",
      "cotidiano": "El vendedor escribe la búsqueda en un tablero. Cuando cambia el texto, avisa al encargado para que muestre la versión actualizada del tablero al cliente.",
      "equivalencias": [
        [
          "Dato escrito en el tablero",
          "Variable `busqueda`"
        ],
        [
          "Avisar que algo cambió",
          "`setState(() { ... })`"
        ],
        [
          "Texto que vuelve a mostrarse",
          "Widgets reconstruidos en `build()`"
        ]
      ],
      "cuidado": "`setState` no guarda la búsqueda en el disco ni en una base de datos. Solo notifica un cambio al árbol de widgets.",
      "pregunta": "¿Qué diferencia hay entre guardar `busqueda = valor` y envolver el cambio en `setState`?",
      "respuesta": "`setState` notifica a Flutter que necesita reconstruir esa parte de la interfaz con el nuevo dato."
    },
    "formularios": {
      "titulo": "Filtrar una lista es como buscar libros en una biblioteca",
      "cotidiano": "Primero tienes un catálogo de libros. Escribes una palabra, revisas los títulos, separas los que coinciden y muestras solo esas fichas.",
      "equivalencias": [
        [
          "Catálogo completo",
          "`List<String> vehiculos`"
        ],
        [
          "Regla para seleccionar títulos",
          "`where` con `contains`"
        ],
        [
          "Crear una fila por coincidencia",
          "`for` con `ListTile`"
        ]
      ],
      "cuidado": "La lista de este ejemplo está en memoria; no estamos consultando Internet ni una base de datos.",
      "pregunta": "¿Qué debe pasar cuando ninguna ficha contiene el texto escrito?",
      "respuesta": "`resultados.isEmpty` será verdadero y se mostrará el mensaje de que no hubo coincidencias."
    },
    "bloc": {
      "titulo": "BLoC funciona como la cocina de un restaurante",
      "cotidiano": "El cliente hace un pedido al mesero. La cocina recibe la orden y prepara el resultado; el mesero presenta lo que salió de la cocina, sin ponerse a cocinar en la mesa.",
      "equivalencias": [
        [
          "Nota con el pedido",
          "Evento `BusquedaTextoCambiado`"
        ],
        [
          "Cocina que procesa el pedido",
          "`BusquedaBloc` y su `on<...>`"
        ],
        [
          "Resultado disponible para mostrar",
          "`BusquedaEstado` leído por `BlocBuilder`"
        ]
      ],
      "cuidado": "En esta práctica el BLoC filtra una lista local al escribir; no hay restaurante real, servidor remoto, espera de pedidos ni estados de carga.",
      "pregunta": "Cuando escribes «Renault», ¿quién debe ejecutar `where`: `TextField` o `BusquedaBloc`?",
      "respuesta": "`BusquedaBloc`; el `TextField` solo envía el evento y `BlocBuilder` muestra el nuevo estado."
    },
    "catalogo-widgets": {
      "titulo": "Un catálogo de widgets es como una caja de herramientas",
      "cotidiano": "Un carpintero no utiliza la misma herramienta para cortar, medir y unir. En Flutter cada widget tiene un propósito: presentar texto, distribuir elementos, recibir datos o detectar una acción.",
      "equivalencias": [
        [
          "Etiqueta del producto",
          "`Text`"
        ],
        [
          "Organizar piezas en el estante",
          "`Row` o `Column`"
        ],
        [
          "Recibir una solicitud o pulsación",
          "`TextField` o `ElevatedButton`"
        ]
      ],
      "cuidado": "Elegir un widget no crea automáticamente lógica, navegación o almacenamiento: esas responsabilidades deben programarse.",
      "pregunta": "Si necesitas que el usuario escriba algo, ¿usarías `Text` o `TextField`?",
      "respuesta": "`TextField` para escribir; `Text` solo muestra información."
    }
  },
  "pasos": {
    "punto-entrada": [
      [
        "Abrir una caja de herramientas: primero identificas qué piezas ya trae.",
        "`import` ya está escrito; solo lo lees, no lo duplicas."
      ],
      [
        "Dar la señal para comenzar una función de teatro.",
        "`main()` comienza y `runApp()` entrega la app a Flutter."
      ],
      [
        "Leer el plano del local antes de mover sus paredes.",
        "`MainApp` y `build()` ya están definidos por la plantilla."
      ],
      [
        "Cambiar el letrero de una puerta sin reconstruir el edificio.",
        "Solo cambias `'Hello World!'` por `'Primer widget'`."
      ],
      [
        "Reconocer el sello y el identificador de una pieza existente.",
        "`const` y `super.key` se estudian: no agregas una nueva pantalla."
      ]
    ],
    "estructura": [
      [
        "Un local necesita paredes y una zona principal.",
        "`Scaffold` proporciona las zonas de la pantalla; `body` contiene el contenido."
      ],
      [
        "Colgar el nombre del negocio sobre la entrada.",
        "`AppBar` pone el título arriba sin reemplazar todo el `body`."
      ],
      [
        "Cambiar el cartel que ya está en el mostrador.",
        "El `Text` del `body` se modifica en su ubicación, no se duplica."
      ],
      [
        "Centrar el nombre escrito en la fachada.",
        "`centerTitle` ajusta la alineación del título, no el contenido inferior."
      ],
      [
        "Poner botones de servicio junto al rótulo.",
        "`actions` contiene los iconos del `AppBar`; todavía no implica que ejecuten una acción."
      ]
    ],
    "diseno": [
      [
        "Pasar de un solo cuadro centrado a varios objetos apilados.",
        "`Column(children: [...])` dispone varios widgets verticalmente."
      ],
      [
        "Poner un logo encima de la lista de productos.",
        "`Icon` agrega un símbolo dentro de `children`."
      ],
      [
        "Dejar una separación entre dos objetos sobre un estante.",
        "`SizedBox(height: ...)` reserva espacio vertical."
      ],
      [
        "Colocar nombre e icono en la misma fila del mostrador.",
        "`Row` distribuye los hijos horizontalmente."
      ],
      [
        "Separar dos tarjetas que estaban demasiado juntas.",
        "`SizedBox(width: ...)` reserva espacio horizontal dentro de `Row`."
      ]
    ],
    "campo-texto": [
      [
        "Identificar un mostrador con los elementos que ya tiene.",
        "Antes de añadir más, localiza la `Row` donde irá el buscador."
      ],
      [
        "Dejar una casilla suficientemente amplia en la solicitud.",
        "`Expanded` permite al `TextField` usar el espacio disponible en `Row`."
      ],
      [
        "Escribir «Marca o modelo» en gris dentro de una casilla vacía.",
        "`hintText` es una pista, no un valor escrito por el usuario."
      ],
      [
        "Recibir una nota y todavía no procesarla.",
        "El `TextField` admite texto, pero aún no ejecuta búsquedas."
      ]
    ],
    "proyecto": [
      [
        "Poner un título encima del formulario del concesionario.",
        "Agregas un `Text` sin alterar el buscador anterior."
      ],
      [
        "Colocar una nueva casilla para escribir un nombre.",
        "El segundo `TextField` recibe el valor del formulario."
      ],
      [
        "Instalar un timbre para enviar la solicitud.",
        "`ElevatedButton` se dibuja ahora; después se enseñará su evento."
      ],
      [
        "Convertir un tablero fijo en otro que conserva datos mientras está abierto.",
        "`StatefulWidget` tiene un objeto `State` para recursos que viven con la pantalla."
      ],
      [
        "Entregar una libreta al encargado de recepción.",
        "`TextEditingController` permite consultar lo escrito."
      ],
      [
        "Unir la casilla con la libreta donde se registra el texto.",
        "`controller:` conecta el campo visual con su controlador."
      ],
      [
        "Tocar el timbre para que lean lo anotado.",
        "`onPressed` llama al código que lee el valor del controlador."
      ],
      [
        "Borrar la libreta después de registrar la consulta.",
        "`clear()` vacía el campo, pero no guarda nada por sí solo."
      ],
      [
        "Devolver la libreta cuando cierra el mostrador.",
        "`dispose()` libera el controlador cuando termina el ciclo de vida del estado."
      ]
    ],
    "carpetas": [
      [
        "Crear un cajón etiquetado «pantallas».",
        "`pages/` guardará widgets que representan páginas completas."
      ],
      [
        "Reservar un cajón para botones y títulos repetibles.",
        "`widgets/` contendrá componentes de interfaz reutilizables."
      ],
      [
        "Reservar un cajón para fichas técnicas de cada vehículo.",
        "`models/` guarda clases que representan datos."
      ],
      [
        "Reservar un espacio para hacer solicitudes a otros sistemas.",
        "`services/` podrá contener integración con servicios o APIs."
      ],
      [
        "Guardar las normas para acceder a un catálogo de datos.",
        "`repositories/` puede abstraer de dónde vienen los datos."
      ],
      [
        "Separar la oficina que decide cómo responder a una orden.",
        "`bloc/` albergará eventos, estados y lógica cuando llegue esa lección."
      ]
    ],
    "reutilizacion": [
      [
        "Abrir un archivo para fabricar un molde reutilizable.",
        "`titulo_seccion.dart` tendrá la definición de un widget propio."
      ],
      [
        "Diseñar un sello con una casilla donde escribir el texto.",
        "`TituloSeccion` recibe `texto` mediante su constructor."
      ],
      [
        "Llevar el sello al lugar donde lo vas a utilizar.",
        "El `import` permite acceder a la clase definida en otro archivo."
      ],
      [
        "Estampar un título en la parte superior de la pantalla.",
        "Usas `TituloSeccion(...)` en vez del texto duplicado."
      ],
      [
        "Usar otra vez el sello, ahora con un mensaje diferente.",
        "La misma clase recibe un segundo `texto` sin reescribirse."
      ]
    ],
    "validacion": [
      [
        "Cambiar una casilla simple por otra que acepta revisión.",
        "`TextFormField` permite asociar reglas de validación."
      ],
      [
        "Asignar un identificador al formulario que quieres revisar.",
        "`GlobalKey<FormState>` permite acceder a ese formulario concreto."
      ],
      [
        "Reunir las casillas dentro de una misma solicitud.",
        "`Form` agrupa los campos y sus validadores."
      ],
      [
        "Pedir al portero que compruebe si el nombre es válido.",
        "`validator` devuelve un error o `null` cuando el dato cumple la regla."
      ],
      [
        "Entregar el formulario para una revisión completa.",
        "`validate()` solicita ejecutar las reglas al pulsar el botón."
      ]
    ],
    "objeto": [
      [
        "Abrir un archivo para guardar el molde de una ficha.",
        "`vehiculo.dart` contendrá la clase de datos."
      ],
      [
        "Diseñar una ficha que exige nombre y otras propiedades.",
        "`class Vehiculo` define propiedades y constructor."
      ],
      [
        "Traer el formato de ficha a la mesa de recepción.",
        "`import` permite utilizar `Vehiculo` en la pantalla."
      ],
      [
        "Rellenar una ficha con los datos del Renault concreto.",
        "`Vehiculo(...)` crea una instancia usando los valores del formulario."
      ],
      [
        "Leer en voz alta los campos de la ficha completada.",
        "Se accede a propiedades del objeto para comprobar sus datos."
      ]
    ],
    "extraccion": [
      [
        "Localizar qué pieza se repite antes de desmontar un aparato.",
        "Identificas el campo y el botón que pueden convertirse en widgets."
      ],
      [
        "Preparar una caja independiente para una pieza.",
        "Creas `campo_nombre_vehiculo.dart` sin mover todavía todo el formulario."
      ],
      [
        "Fabricar una pieza con conectores para sus datos.",
        "`CampoNombreVehiculo` recibe parámetros en su constructor."
      ],
      [
        "Mantener la inspección de seguridad dentro de la pieza.",
        "El campo extraído conserva `validator`, no se pierde la regla."
      ],
      [
        "Traer la pieza fabricada al puesto de montaje.",
        "El `import` hace accesible `CampoNombreVehiculo`."
      ],
      [
        "Insertar la pieza en el lugar donde estaba el original.",
        "Reemplazas el campo anterior con el widget reutilizable dentro de `Form`."
      ],
      [
        "Construir un botón reutilizable sin decidir su función concreta.",
        "`BotonTienda` recibe un callback para el momento de pulsarlo."
      ],
      [
        "Llevar el botón reutilizable a la pantalla.",
        "El `import` conecta el archivo del widget con `main.dart`."
      ],
      [
        "Cambiar una pieza sin romper el cable que activa la máquina.",
        "Entregas la función del formulario al botón, sin duplicar su lógica."
      ]
    ],
    "navegacion": [
      [
        "Preparar una hoja nueva dentro de un cuaderno.",
        "`ayuda_page.dart` define una página distinta."
      ],
      [
        "Dibujar título y contenido dentro de esa hoja.",
        "`AyudaPage` devuelve su estructura visual."
      ],
      [
        "Traer a la página una pieza de botón compartida.",
        "Importas `BotonTienda` para utilizarlo también en Ayuda."
      ],
      [
        "Añadir la opción de regresar a la hoja anterior.",
        "`Navigator.pop(context)` cierra la página actual."
      ],
      [
        "Crear una segunda hoja titulada «Acerca de».",
        "`AcercaPage` será otra pantalla sencilla."
      ],
      [
        "Permitir que una hoja conozca cómo abrir la siguiente.",
        "Importas `AyudaPage` desde `AcercaPage`."
      ],
      [
        "Poner un enlace de Acerca de hacia Ayuda.",
        "Un botón usa `Navigator.push` con la página de Ayuda."
      ],
      [
        "Dar a la Tienda acceso a la hoja «Acerca de».",
        "El `import` permite construir `AcercaPage` desde `main.dart`."
      ],
      [
        "Abrir una hoja sobre el montón de hojas existente.",
        "`Navigator.push` agrega Acerca de al historial y `pop` permite volver."
      ]
    ],
    "responsive": [
      [
        "Dejar una separación entre el producto y el borde del escaparate.",
        "`Padding` agrega espacio interior alrededor del contenido."
      ],
      [
        "Permitir recorrer una lista más alta que la vitrina.",
        "`SingleChildScrollView` deja desplazarse cuando no cabe todo."
      ],
      [
        "Aprovechar la anchura que queda en el estante.",
        "La distribución de `Column` se adapta al ancho disponible."
      ],
      [
        "Evitar que un letrero largo se salga de su soporte.",
        "El texto limita las líneas o usa el espacio flexible."
      ],
      [
        "Bajar el buscador a otro renglón cuando no cabe al lado.",
        "Reubicas el `TextField` debajo de la fila para pantallas pequeñas."
      ],
      [
        "Dibujar el contorno de una casilla del formulario.",
        "`OutlineInputBorder` muestra un borde, no activa por sí solo la búsqueda."
      ]
    ],
    "estado": [
      [
        "Pasar de un cartel pintado a una pizarra que puede actualizarse.",
        "`StatefulWidget` permite mantener valores en un objeto `State`."
      ],
      [
        "Escribir el dato actual en la esquina del tablero.",
        "La variable `busqueda` contiene el texto actual."
      ],
      [
        "Escuchar cuando alguien cambia el mensaje del tablero.",
        "`onChanged` recibe el valor y `setState` notifica la actualización."
      ],
      [
        "Mostrar a los clientes lo que dice la pizarra ahora.",
        "Un `Text` usa la variable al reconstruirse el widget."
      ],
      [
        "Escribir y borrar para confirmar que el tablero responde.",
        "Pruebas `onChanged` y `setState` en acción."
      ]
    ],
    "formularios": [
      [
        "Tener un catálogo de cuatro vehículos disponibles.",
        "`List<String>` guarda nombres en memoria."
      ],
      [
        "Separar las fichas que coinciden con la solicitud.",
        "`where` y `contains` construyen la selección."
      ],
      [
        "Colocar una ficha en la pantalla por cada coincidencia.",
        "`ListTile` se crea dentro del `for`."
      ],
      [
        "Pedir todos los vehículos con la palabra «Renault».",
        "La búsqueda muestra Renault 9 y Renault 21."
      ],
      [
        "Mostrar «ningún resultado» cuando el estante queda vacío.",
        "`resultados.isEmpty` decide mostrar el mensaje."
      ]
    ],
    "bloc": [
      [
        "Diferenciar quién atiende, quién cocina y quién entrega.",
        "La interfaz, el BLoC y el estado tienen responsabilidades distintas."
      ],
      [
        "Escribir una orden y enviarla a la cocina.",
        "`BusquedaTextoCambiado` comunica lo solicitado; el evento no filtra."
      ],
      [
        "Recibir una bandeja vacía y avisar con claridad.",
        "El estado con lista vacía permite mostrar «No se encontraron vehículos»."
      ],
      [
        "Retirar el pedido anterior y solicitar el catálogo completo.",
        "Un texto vacío origina otro evento y un estado con los cuatro vehículos."
      ]
    ]
  },
  "blocPractica": [
    [
      "Como conseguir una herramienta que tu taller todavía no tiene.",
      "`flutter pub add flutter_bloc` instala la biblioteca; no escribe widgets ni lógica por ti."
    ],
    [
      "Como separar los mostradores «pedidos», «resultado» y «cocina».",
      "La carpeta `bloc/` guarda evento, estado y lógica en archivos distintos."
    ],
    [
      "La nota «el cliente pidió Renault» viaja a la cocina.",
      "`BusquedaTextoCambiado` representa el pedido; no calcula coincidencias."
    ],
    [
      "Una hoja de resultados lista para llevar a la mesa.",
      "`BusquedaEstado` conserva texto y lista; no es una pantalla."
    ],
    [
      "La cocina lee la orden y prepara el plato adecuado.",
      "`BusquedaBloc` aplica `where` y publica resultados mediante `emit`."
    ],
    [
      "La cocina debe estar disponible para los meseros del local.",
      "`BlocProvider` ofrece la instancia de BLoC a los widgets descendientes."
    ],
    [
      "No conviene tener dos cocinas preparando el mismo pedido por separado.",
      "Quita el filtro y la lista antiguos de `main.dart`: habrá una sola fuente de resultados."
    ],
    [
      "El mesero entrega una nota a la cocina sin ponerse a cocinar.",
      "`TextField.onChanged` envía `BusquedaTextoCambiado` con `context.read().add(...)`."
    ],
    [
      "El mesero recibe la bandeja nueva y actualiza la mesa.",
      "`BlocBuilder` escucha el estado y reconstruye la parte visual de resultados."
    ],
    [
      "Comprobar pedidos variados antes de abrir el restaurante.",
      "Prueba texto vacío, Renault, MAZDA, xyz y borrar; revisa también `flutter analyze`."
    ]
  ]
};
