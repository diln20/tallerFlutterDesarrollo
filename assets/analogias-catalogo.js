/* Analogías de consulta para los 167 widgets del catálogo, incluidas familias ampliadas. */
(function(){
  const data=window.FlutterLabAnalogias;
  if(!data)return;
  data.catalogo={
  "exactas": {
    "MaterialApp": [
      "El reglamento general de un centro comercial.",
      "Define configuración general y la navegación inicial de la aplicación; no dibuja todos los locales por sí solo."
    ],
    "Scaffold": [
      "El plano de una tienda con zona superior y área principal.",
      "Organiza `appBar`, `body` y otras zonas de una pantalla Material."
    ],
    "AppBar": [
      "El rótulo que está sobre el mostrador.",
      "Presenta el título y acciones superiores de la página."
    ],
    "SafeArea": [
      "Dejar libre el espacio que ocupan los bordes de una pantalla.",
      "Evita que el contenido invada áreas reservadas del dispositivo cuando corresponde."
    ],
    "Drawer": [
      "Un armario lateral que se abre solo cuando lo necesitas.",
      "Muestra un panel lateral de navegación dentro del contexto Material."
    ],
    "NavigationBar": [
      "Las pestañas grandes que eliges en la parte inferior de una tienda.",
      "Permite seleccionar destinos principales de navegación."
    ],
    "FloatingActionButton": [
      "El botón destacado para una acción frecuente.",
      "Representa una acción principal; el evento debe programarse."
    ],
    "TabBar": [
      "Las pestañas de un archivador.",
      "Selecciona la pestaña visible junto con su controlador y contenido."
    ],
    "TabBarView": [
      "Las hojas que están detrás de cada pestaña.",
      "Muestra la vista correspondiente al tab seleccionado."
    ],
    "SliverAppBar": [
      "Un letrero que cambia al recorrer un pasillo largo.",
      "Es una barra superior para estructuras de desplazamiento avanzadas."
    ],
    "Container": [
      "Una caja que puede tener tamaño, fondo y borde.",
      "Envuelve un widget y permite ajustar su decoración y dimensiones."
    ],
    "Padding": [
      "Poner una capa de espuma entre un objeto y su caja.",
      "Agrega espacio interior alrededor del hijo."
    ],
    "Center": [
      "Colocar una pieza en el centro de la mesa.",
      "Centra su widget hijo dentro del espacio disponible."
    ],
    "Align": [
      "Acomodar un cuadro en una esquina o lado del muro.",
      "Posiciona el hijo según una alineación."
    ],
    "SizedBox": [
      "Un separador de tamaño conocido en una estantería.",
      "Da ancho/alto fijo o espacio entre widgets."
    ],
    "Row": [
      "Poner productos uno al lado del otro.",
      "Distribuye widgets horizontalmente."
    ],
    "Column": [
      "Apilar productos en una vitrina vertical.",
      "Distribuye widgets verticalmente."
    ],
    "Expanded": [
      "Dejar que un elemento ocupe el espacio sobrante del estante.",
      "Expande el hijo dentro de `Row`, `Column` o `Flex`."
    ],
    "Flexible": [
      "Un objeto que puede adaptarse sin exigir todo el espacio libre.",
      "Permite un uso flexible del espacio en un diseño Flex."
    ],
    "Spacer": [
      "Un separador extensible entre dos objetos.",
      "Reparte espacio libre dentro de `Row` o `Column`."
    ],
    "Wrap": [
      "Pasar a la siguiente fila cuando el estante se llena.",
      "Coloca hijos en nuevas líneas si ya no caben."
    ],
    "Stack": [
      "Apilar transparencias o carteles uno encima de otro.",
      "Permite superponer widgets."
    ],
    "Positioned": [
      "Fijar una etiqueta en una esquina de un cartel apilado.",
      "Ubica un hijo dentro de un `Stack`."
    ],
    "Card": [
      "Una tarjeta que presenta información agrupada.",
      "Agrupa contenido visual con forma y superficie Material."
    ],
    "ListTile": [
      "Una ficha uniforme dentro de una lista.",
      "Combina título, subtítulo, iconos y acciones en una fila."
    ],
    "Divider": [
      "Una línea que separa dos apartados de un documento.",
      "Dibuja una separación visual."
    ],
    "Text": [
      "Un letrero que solo se lee.",
      "Muestra texto, no permite escribirlo."
    ],
    "RichText": [
      "Un cartel con palabras de diferentes estilos.",
      "Combina fragmentos de texto con distintos estilos."
    ],
    "SelectableText": [
      "Un aviso impreso cuya información puedes seleccionar.",
      "Muestra texto que puede seleccionarse y copiarse."
    ],
    "Icon": [
      "Un pictograma para reconocer una acción o categoría.",
      "Muestra un símbolo; no recibe clic automáticamente."
    ],
    "Image": [
      "Una fotografía colocada en una ficha de producto.",
      "Presenta una imagen desde un recurso disponible."
    ],
    "CircleAvatar": [
      "La foto redonda de un carnet de identificación.",
      "Representa una persona u objeto dentro de un círculo."
    ],
    "Chip": [
      "Una etiqueta pequeña que identifica una característica.",
      "Presenta una categoría o valor compacto."
    ],
    "Tooltip": [
      "Una pequeña nota al colocar el cursor sobre una herramienta.",
      "Ofrece una explicación breve sin ocupar la pantalla todo el tiempo."
    ],
    "TextField": [
      "El espacio donde el cliente escribe su solicitud.",
      "Recibe texto, pero no valida ni guarda por sí solo."
    ],
    "TextFormField": [
      "Un campo de formulario que admite revisión de requisitos.",
      "Integra validación en un `Form`."
    ],
    "Form": [
      "Una hoja que reúne varios campos revisables.",
      "Coordina campos y sus validaciones mediante `FormState`."
    ],
    "ElevatedButton": [
      "Un botón de acción bien visible en el mostrador.",
      "Muestra una acción; `onPressed` define qué hace al pulsarlo."
    ],
    "TextButton": [
      "Una opción escrita que puedes pulsar sin un gran fondo.",
      "Representa una acción de menor énfasis visual."
    ],
    "IconButton": [
      "Un pictograma convertido en botón.",
      "El icono es accionable porque el widget recibe un callback."
    ],
    "Switch": [
      "El interruptor de una lámpara.",
      "Representa una opción activada o desactivada."
    ],
    "Checkbox": [
      "Una casilla para marcar una opción independiente.",
      "Representa una selección booleana que debes actualizar."
    ],
    "Radio": [
      "Elegir un único plato entre varias alternativas.",
      "Selecciona una opción dentro de un grupo excluyente."
    ],
    "Slider": [
      "Mover el control de volumen a un valor.",
      "Permite elegir un valor en un rango."
    ],
    "DropdownMenu": [
      "Desplegar una lista para escoger un vehículo.",
      "Presenta opciones y comunica la seleccionada."
    ],
    "SearchBar": [
      "La casilla de consulta de un catálogo.",
      "Recibe una búsqueda; la lógica de filtrado sigue siendo responsabilidad de tu código."
    ],
    "FilterChip": [
      "Activar una etiqueta para ver solo una categoría.",
      "Representa un filtro seleccionable."
    ],
    "ListView": [
      "Un pasillo largo de fichas una debajo de otra.",
      "Muestra contenido desplazable en forma de lista."
    ],
    "GridView": [
      "Una estantería de casillas organizadas por filas y columnas.",
      "Muestra elementos en una cuadrícula desplazable."
    ],
    "SingleChildScrollView": [
      "Mirar una hoja que no cabe completa y desplazarla.",
      "Permite recorrer un solo hijo más grande que el espacio."
    ],
    "PageView": [
      "Pasar las páginas de un álbum con un deslizamiento.",
      "Presenta páginas desplazables horizontal o verticalmente."
    ],
    "ExpansionTile": [
      "Un cajón que se abre para mostrar detalles.",
      "Expande y contrae contenido secundario."
    ],
    "DataTable": [
      "Un registro de inventario con filas y columnas.",
      "Presenta datos en una tabla estructurada."
    ],
    "Dismissible": [
      "Quitar una ficha del estante deslizando la mano.",
      "Reconoce un gesto de descarte; debes decidir qué ocurre con el dato."
    ],
    "RefreshIndicator": [
      "Tirar de una lista para pedir una actualización.",
      "Muestra y dispara una acción de actualización."
    ],
    "SnackBar": [
      "Un aviso temporal que aparece en el mostrador.",
      "Muestra un mensaje breve sin cambiar de pantalla."
    ],
    "AlertDialog": [
      "Una pregunta que exige confirmar o cancelar.",
      "Presenta una ventana de diálogo sobre la interfaz."
    ],
    "CircularProgressIndicator": [
      "La rueda que muestra que una tarea sigue en curso.",
      "Indica progreso indeterminado o determinado; no ejecuta el trabajo por sí misma."
    ],
    "BottomSheet": [
      "Una bandeja de opciones que sube desde abajo.",
      "Muestra acciones o contenido contextual en la zona inferior."
    ],
    "Stepper": [
      "Un formulario dividido en estaciones sucesivas.",
      "Guía al usuario a través de varias etapas."
    ],
    "GestureDetector": [
      "Un sensor invisible que reconoce el toque sobre una superficie.",
      "Detecta gestos; no añade una apariencia de botón automáticamente."
    ],
    "InkWell": [
      "Una zona pulsable que responde con una onda visual.",
      "Detecta pulsaciones con retroalimentación Material."
    ],
    "Draggable": [
      "Arrastrar una ficha de producto de una bandeja a otra.",
      "Permite iniciar el arrastre de un elemento."
    ],
    "Focus": [
      "Decidir qué casilla recibe la atención del teclado.",
      "Participa en la gestión del foco de entrada."
    ],
    "StatelessWidget": [
      "Un cartel que muestra la información que le entregas.",
      "No administra un objeto `State` propio y mutable en esa clase."
    ],
    "StatefulWidget": [
      "Una pizarra cuya información puede cambiar mientras está abierta.",
      "Se relaciona con un objeto `State` que conserva datos durante su ciclo de vida."
    ],
    "FutureBuilder": [
      "Esperar que llegue un pedido una vez y mostrar su resultado.",
      "Construye widgets según las etapas de un `Future`."
    ],
    "StreamBuilder": [
      "Escuchar una radio donde siguen llegando mensajes.",
      "Construye widgets al recibir valores de un `Stream`."
    ],
    "ValueListenableBuilder": [
      "Un tablero que reacciona a un marcador observado.",
      "Reconstruye su hijo cuando cambia un `ValueListenable`."
    ],
    "InheritedWidget": [
      "Una información del edificio disponible a distintas oficinas.",
      "Comparte datos con widgets descendientes de manera controlada."
    ],
    "AnimatedContainer": [
      "Una caja que cambia suavemente de tamaño o color.",
      "Anima automáticamente cambios en propiedades compatibles."
    ],
    "AnimatedOpacity": [
      "Un cartel que aparece o desaparece gradualmente.",
      "Anima la transparencia de su hijo."
    ],
    "AnimatedSwitcher": [
      "Cambiar un cartel por otro con transición.",
      "Anima el paso de un widget hijo a otro."
    ],
    "Hero": [
      "La misma imagen que parece viajar entre dos páginas.",
      "Coordina una animación compartida durante la navegación."
    ],
    "CupertinoApp": [
      "Un reglamento de apariencia para pantallas con estilo iOS.",
      "Da el entorno de widgets Cupertino a la aplicación."
    ],
    "CupertinoNavigationBar": [
      "El rótulo superior con el estilo habitual de iOS.",
      "Presenta navegación superior con apariencia Cupertino."
    ],
    "CupertinoButton": [
      "Un botón con el estilo visual de iOS.",
      "Ejecuta la acción definida en `onPressed`."
    ]
  },
  "familias": {
    "Estructura y navegación": [
      "El plano y las señales de un edificio.",
      "Los widgets de esta familia organizan pantallas, destinos y barras de navegación."
    ],
    "Diseño y distribución": [
      "Los separadores y estanterías de una tienda.",
      "Los widgets de esta familia reparten espacio, alinean y agrupan otros widgets."
    ],
    "Texto, iconos e imágenes": [
      "Los letreros y fotografías de un catálogo.",
      "Esta familia comunica información visual, sin decidir automáticamente qué hará la aplicación."
    ],
    "Botones y formularios": [
      "El mostrador donde el usuario entrega datos y pulsa botones.",
      "Esta familia permite interacción; los valores y respuestas deben programarse."
    ],
    "Listas y desplazamiento": [
      "Los pasillos de un archivo con muchas fichas.",
      "Esta familia organiza colecciones y permite recorrer contenido grande."
    ],
    "Mensajes y avisos": [
      "Los avisos del tablero de atención.",
      "Esta familia comunica estados o pide confirmaciones; no realiza por sí sola la operación pendiente."
    ],
    "Gestos e interacción": [
      "Los sensores que reconocen manos y teclas.",
      "Estos widgets detectan acciones para que el código pueda responder."
    ],
    "Estado y asincronía": [
      "Una pizarra que se actualiza mientras llegan noticias.",
      "Esta familia permite reconstruir widgets a partir de datos o resultados."
    ],
    "Animación": [
      "Mover suavemente un cartel de una posición a otra.",
      "Esta familia modifica la apariencia de los cambios con transiciones."
    ],
    "Cupertino (iOS)": [
      "La decoración de una sucursal diseñada con estilo iOS.",
      "Estos widgets ofrecen una apariencia y patrones de interacción propios de Cupertino."
    ]
  }
};

data.catalogo.familias['Accesibilidad']=[
  'Las señales en braille y los avisos claros de una tienda.',
  'Esta familia permite describir controles a lectores de pantalla y ayudar a las personas a comprenderlos.'
];
Object.assign(data.catalogo.exactas, {
  'IndexedStack':[
    'Tres mostradores preparados: solo uno se ve a la vez.',
    'Muestra la pestaña seleccionada, pero conserva los otros widgets montados para que no pierdan su estado local.'
  ],
  'AnimatedList':[
    'Una fila nueva entra a la sala con una transición suave.',
    'Inserta y retira visualmente filas con una animación que debes coordinar con los registros reales.'
  ],
  'CheckboxListTile':[
    'Una fila de una lista de compras con una casilla para marcar.',
    'Muestra título y casilla en una misma fila; el State debe guardar si está seleccionada.'
  ],
  'SwitchListTile':[
    'Un interruptor junto al nombre de una máquina.',
    'Cambia una preferencia booleana con su etiqueta, pero la app debe registrar el valor.'
  ],
  'Semantics':[
    'Un rótulo accesible que describe un control para quien no puede verlo.',
    'Expone etiquetas y roles a tecnologías de asistencia, sin alterar necesariamente el dibujo de la pantalla.'
  ],
  'GridTile':[
    'Una fotografía en una celda de una vitrina de productos.',
    'Permite presentar una celda dentro de GridView con contenido y bandas opcionales.'
  ],
  'DraggableScrollableSheet':[
    'Un cajón que puedes arrastrar hacia arriba para ver más.',
    'Combina el movimiento del panel con el desplazamiento del listado interno mediante un controlador compartido.'
  ]
});
})();
