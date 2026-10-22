/* FlutterLab · Secuencia visual fiel a las etapas verificadas de actividad2a.
   Las pantallas se recrean en HTML, no son capturas ni ejecuciones Flutter. */
(() => {
  'use strict';
  const S = (name, effect, code, before, after, highlight, more={}) =>
    ({name,effect,code,before,after,highlight,...more});
  const data = {
    preparacion: {
      name:'Preparación del proyecto',
      kind:'original',
      steps:[
        S('Ubicar lib/main.dart','Se localiza el archivo original con la clase MainApp. Todavía no se cambia ningún widget.',
          "actividad2a/\n  pubspec.yaml\n  lib/\n    main.dart",
          {stage:0,opened:false},{stage:0,opened:true},'editor',{visual:false}),
        S('Comprobar dependencias','flutter pub get prepara paquetes. No modifica la apariencia de la Tienda.',
          "flutter pub get",
          {stage:0,opened:true},{stage:0,opened:true,ready:true},'editor',{visual:false}),
        S('Ejecutar actividad2a','flutter run abre la pantalla que existe en el proyecto: AppBar «Tienda», textos, iconos y un campo de búsqueda todavía sin lógica.',
          "flutter run",
          {stage:0,opened:true,ready:true},{stage:5},'body',
          {note:'La pantalla representa la versión original de la clase, no un avance inventado.'})
      ]
    },
    'punto-entrada': {
      name:'El punto de entrada de Dart',
      kind:'reconstruct',
      steps:[
        S('Importar Material','La importación pone a disposición los widgets Material. Todavía no hay nada dibujado.',
          "import 'package:flutter/material.dart';",
          {stage:0,opened:false},{stage:0,opened:true,editorLabel:'material.dart importado'},'editor',{visual:false}),
        S('Escribir main() y runApp','main() arranca el programa y runApp recibe MainApp; sin definir MainApp todavía no podemos ejecutarlo.',
          "void main() {\n  runApp(const MainApp());\n}",
          {stage:0,opened:true},{stage:0,opened:true,editorLabel:'main() definido'},'editor',{visual:false}),
        S('Crear StatelessWidget','MainApp extiende StatelessWidget y crea su constructor. Todavía falta el método build para devolver widgets.',
          "class MainApp extends StatelessWidget {\n  const MainApp({super.key});\n  // Falta build(...)\n}",
          {stage:0,opened:true},{stage:0,opened:true,editorLabel:'MainApp definido'},'editor',{visual:false}),
        S('Construir la primera pantalla','MaterialApp, Scaffold, Center y Text permiten ejecutar el primer ejemplo: «Primer widget».',
          "return const MaterialApp(\n  home: Scaffold(\n    body: Center(\n      child: Text('Primer widget'),\n    ),\n  ),\n);",
          {stage:0,opened:true},{stage:2},'firstText'),
        S('Entender const y super.key','Son parte del constructor y de la creación del widget. Añadir o quitar un const válido no dibuja nuevos controles.',
          "const MainApp({super.key});\nrunApp(const MainApp());",
          {stage:2},{stage:2},'firstText',{visual:false})
      ]
    },
    estructura: {
      name:'MaterialApp, Scaffold y AppBar',
      kind:'reconstruct',
      steps:[
        S('Scaffold y body','Scaffold establece la zona principal. La primera etapa sigue mostrando «Primer widget».',
          "Scaffold(\n  body: Center(\n    child: Text('Primer widget'),\n  ),\n)",
          {stage:2},{stage:2},'body',{visual:false}),
        S('Agregar AppBar','Con appBar aparece una barra superior con el título «Tienda». El cuerpo conserva el texto anterior.',
          "appBar: AppBar(\n  title: const Text('Tienda'),\n),",
          {stage:2},{stage:3,bodyText:'Primer widget'},'appbar'),
        S('Cambiar el Text del body','El cuerpo muestra «Hello dsfdsWorld»; el título «Tienda» no cambia porque pertenece a AppBar.',
          "body: const Center(\n  child: Text('Hello dsfdsWorld'),\n),",
          {stage:3,bodyText:'Primer widget'},{stage:3},'firstText'),
        S('Probar centerTitle (ampliación)','centerTitle centra el título. Es una demostración opcional: no está configurada en el archivo original.',
          "centerTitle: true,",
          {stage:3},{stage:3,appbarCentered:true},'appbar',{kind:'proposed'}),
        S('Agregar acciones (ampliación)','actions coloca controles junto al título; onPressed vacío aún no busca vehículos.',
          "actions: [\n  IconButton(\n    onPressed: () {},\n    icon: const Icon(Icons.search),\n  ),\n],",
          {stage:3},{stage:3,appbarActions:true},'appbar',{kind:'proposed'})
      ]
    },
    diseno: {
      name:'Column, Row, Icon y SizedBox',
      kind:'reconstruct',
      steps:[
        S('Reemplazar Center por Column','La Column organiza sus hijos desde arriba. Ya no vemos una única frase centrada en medio.',
          "child: Column(\n  children: [\n    Text('Hello dsfdsWorld'),\n  ],\n),",
          {stage:3},{stage:4,topIcon:false,row:false,firstGap:0},'firstText'),
        S('Agregar el primer Icon','Aparece el icono de automóvil debajo del texto de la clase.',
          "Icon(Icons.directions_car),",
          {stage:4,topIcon:false,row:false,firstGap:0},{stage:4,topIcon:true,row:false,firstGap:0},'topIcon'),
        S('Separar con SizedBox','height: 20 aumenta el espacio vertical entre el texto inicial y el icono.',
          "const SizedBox(height: 20),",
          {stage:4,row:false,firstGap:0},{stage:4,row:false,firstGap:20},'spacer'),
        S('Crear una Row','Aparece una fila nueva con icono y «Ingenieria de Sistemas». Esta fila será el lugar del buscador.',
          "Row(\n  children: [\n    Icon(Icons.directions_car),\n    Text('Ingenieria de Sistemas'),\n  ],\n),",
          {stage:4,row:false},{stage:4,row:true,rowGap:0},'row'),
        S('Separación horizontal','width: 8 deja distancia entre el segundo icono y el texto dentro de Row.',
          "const SizedBox(width: 8),",
          {stage:4,rowGap:0},{stage:4,rowGap:8},'row')
      ]
    },
    'campo-texto': {
      name:'TextField y Expanded',
      kind:'original',
      steps:[
        S('Partir de la fila de clase','La Row ya tiene un icono, una separación horizontal y un texto. El buscador aún no existe.',
          "Row(\n  children: [\n    Icon(Icons.directions_car),\n    const SizedBox(width: 8),\n    Text('Ingenieria de Sistemas'),\n  ],\n),",
          {stage:4},{stage:4},'row',{visual:false}),
        S('Incorporar el TextField con Expanded','El campo aparece dentro de Row. Expanded permite que use el ancho flexible restante.',
          "Expanded(\n  child: TextField(),\n),",
          {stage:4},{stage:5,hintText:false},'search'),
        S('Colocar el hintText','El campo muestra «Buscar marca o modelo» cuando está vacío. Esto solo añade una sugerencia visual.',
          "decoration: const InputDecoration(\n  hintText: 'Buscar marca o modelo',\n),",
          {stage:5,hintText:false},{stage:5},'search'),
        S('Escribir sin lógica de búsqueda','El TextField ya admite escritura, pero aún no filtra vehículos ni muestra resultados.',
          "TextField(\n  decoration: const InputDecoration(\n    hintText: 'Buscar marca o modelo',\n  ),\n),",
          {stage:5},{stage:5,query:'Renault'},'search',
          {note:'El resultado no cambia: en el main.dart original todavía no hay onChanged ni catálogo.'})
      ]
    },
    responsive: {
      name:'Mejorar el diseño de la misma Tienda',
      kind:'proposed',
      steps:[
        S('Agregar Padding','Un margen de 16 píxeles lógicos separa el contenido de los bordes.',
          "body: Padding(\n  padding: const EdgeInsets.all(16),\n  child: Center(child: Column(...)),\n),",
          {stage:5},{stage:5,padding:16},'body'),
        S('Permitir desplazamiento','SingleChildScrollView admite desplazarse si el contenido crece. El cambio puede no ser visible sin desbordamiento.',
          "SingleChildScrollView(\n  child: Column(children: [...]),\n),",
          {stage:5,padding:16},{stage:5,padding:16,scroll:true},'scroll',{visual:false}),
        S('Dar ancho a la Column','crossAxisAlignment.stretch aprovecha el ancho disponible. La distribución sigue en preparación.',
          "crossAxisAlignment: CrossAxisAlignment.stretch,",
          {stage:5,padding:16,scroll:true},{stage:5,padding:16,scroll:true,stretch:true},'body',{visual:false}),
        S('Ajustar el texto largo','Expanded sobre el Text y maxLines permiten acomodar «Ingenieria de Sistemas» en la fila.',
          "Expanded(\n  child: Text(\n    'Ingenieria de Sistemas',\n    maxLines: 2,\n    overflow: TextOverflow.ellipsis,\n  ),\n),",
          {stage:5,padding:16,scroll:true},{stage:5,padding:16,scroll:true,rowFlexible:true},'row'),
        S('Mover el buscador debajo','El TextField sale de la Row y ocupa una línea completa debajo de ella.',
          "Row(children: [...]),\nconst SizedBox(height: 12),\nTextField(...),",
          {stage:5,padding:16,scroll:true,rowFlexible:true},{stage:6,outlined:false},'search'),
        S('Añadir OutlineInputBorder','Aparece un borde alrededor del buscador. El campo sigue sin filtrar por sí solo.',
          "decoration: const InputDecoration(\n  hintText: 'Buscar marca o modelo',\n  border: OutlineInputBorder(),\n),",
          {stage:6,outlined:false},{stage:6},'search')
      ]
    },
    estado: {
      name:'Búsqueda con StatefulWidget',
      kind:'proposed',
      steps:[
        S('Crear StatefulWidget','El widget ahora cuenta con un objeto State. Por sí mismo, el cambio no añade nada visible.',
          "class MainApp extends StatefulWidget {\n  const MainApp({super.key});\n  @override\n  State<MainApp> createState() => _MainAppState();\n}",
          {stage:6},{stage:6},'body',{visual:false}),
        S('Definir la variable busqueda','String busqueda inicia vacía dentro de _MainAppState. Todavía no hay etiqueta para mostrarla.',
          "class _MainAppState extends State<MainApp> {\n  String busqueda = '';\n}",
          {stage:6},{stage:6},'search',{visual:false}),
        S('Escuchar onChanged','El campo captura lo escrito y setState actualiza busqueda, pero la pantalla no muestra todavía ese dato.',
          "onChanged: (valor) {\n  setState(() {\n    busqueda = valor;\n  });\n},",
          {stage:6},{stage:6,query:'Renault'},'search',{visual:false}),
        S('Mostrar una etiqueta reactiva','Se añade el texto «Estás buscando: …» debajo del campo; ahora podemos visualizar la variable.',
          "const SizedBox(height: 12),\nText('Estás buscando: $busqueda'),",
          {stage:6,query:'Renault'},{stage:7,query:'Renault'},'searchLabel'),
        S('Probar la escritura','Escribe Renault o Mazda en la vista previa: cambiará la etiqueta, pero todavía no habrá resultados.',
          "Text('Estás buscando: $busqueda'),",
          {stage:7,query:''},{stage:7,query:'Renault'},'searchLabel',
          {interactive:true,note:'Prueba el buscador de la pantalla «Después».'})
      ]
    },
    formularios: {
      name:'Filtrar vehículos con Dart',
      kind:'proposed',
      steps:[
        S('Declarar la lista de modelos','Una lista local conserva cuatro nombres de prueba. No se ve hasta que se crea la interfaz de resultados.',
          "final List<String> vehiculos = [\n  'Renault 9',\n  'Renault 21',\n  'Mazda 3',\n  'Chevrolet Spark',\n];",
          {stage:7},{stage:7},'body',{visual:false}),
        S('Filtrar con where','where y contains seleccionan las coincidencias, pero todavía no se dibujan en la pantalla.',
          "final resultados = vehiculos.where((vehiculo) {\n  return vehiculo.toLowerCase().contains(\n    busqueda.trim().toLowerCase(),\n  );\n}).toList();",
          {stage:7,query:'Renault'},{stage:7,query:'Renault'},'searchLabel',{visual:false}),
        S('Mostrar cada ListTile','Una lista visible aparece debajo del buscador. Con la búsqueda vacía se ven los cuatro modelos.',
          "for (final vehiculo in resultados)\n  ListTile(\n    leading: const Icon(Icons.directions_car),\n    title: Text(vehiculo),\n  ),",
          {stage:7,query:''},{stage:8,query:''},'results'),
        S('Buscar Renault','El filtro conserva Renault 9 y Renault 21; los modelos que no coinciden dejan de verse.',
          "vehiculo.toLowerCase().contains(\n  busqueda.trim().toLowerCase(),\n)",
          {stage:8,query:''},{stage:8,query:'Renault'},'results',
          {interactive:true,note:'Escribe una marca en «Después» y comprueba las coincidencias.'}),
        S('Manejar cero resultados','Si ningún vehículo coincide, aparece «No se encontraron vehículos».',
          "if (resultados.isEmpty)\n  const Text('No se encontraron vehículos.'),",
          {stage:8,query:'Renault'},{stage:8,query:'xyz'},'results',{interactive:true})
      ]
    },
    proyecto: {
      name:'Nuestro primer formulario sencillo',
      kind:'proposed',
      steps:[
        S('Escribir el título con Text','Solo aparece el título «Agregar un vehículo» debajo de los resultados. Todavía no hay campo ni botón.',
          "const SizedBox(height: 20),\nconst Text('Agregar un vehículo'),",
          {stage:8,query:''},{stage:9,query:'',formTitle:true,formField:false,addButton:false},'form-title'),
        S('Poner un TextField','Ahora aparece una caja en la que podemos escribir un nombre. De momento no guarda los datos.',
          "TextField(\n  decoration: const InputDecoration(\n    hintText: 'Ej. Toyota Corolla',\n    border: OutlineInputBorder(),\n  ),\n),",
          {stage:9,query:'',formTitle:true,formField:false,addButton:false},
          {stage:9,query:'',formTitle:true,formField:true,addButton:false},'form-field'),
        S('Agregar ElevatedButton','El botón ya se ve. Su onPressed vacío significa que todavía no tiene una acción.',
          "ElevatedButton(\n  onPressed: () {},\n  child: const Text('Agregar vehículo'),\n),",
          {stage:9,query:'',formTitle:true,formField:true,addButton:false},
          {stage:9,query:'',formTitle:true,formField:true,addButton:true,formReady:false},'button'),
        S('Preparar una variable String','String nuevoVehiculo conserva lo escrito hasta que pulsemos el botón. Crear la variable no modifica la pantalla.',
          "String nuevoVehiculo = '';",
          {stage:9,query:'',formReady:false},{stage:9,query:'',formReady:false},'form-field',{visual:false}),
        S('Leer el texto con onChanged','Cada cambio en el campo guarda el nuevo valor en la variable. El diseño se mantiene igual.',
          "onChanged: (valor) {\n  nuevoVehiculo = valor;\n},",
          {stage:9,query:'',formReady:false},{stage:9,query:'',formReady:false},'form-field',{visual:false}),
        S('Conectar la acción del botón','Con onPressed tomamos el nombre, evitamos cadenas vacías y lo agregamos a vehiculos con setState. Escribe uno y pulsa el botón en la simulación.',
          "onPressed: () {\n  final nombre = nuevoVehiculo.trim();\n  if (nombre.isEmpty) return;\n  setState(() {\n    vehiculos.add(nombre);\n  });\n},",
          {stage:9,query:'',formReady:false},{stage:9,query:'',formReady:true},'button',
          {interactive:true,note:'Todavía no limpiamos el campo ni mostramos mensajes. Eso se enseña después.'}),
        S('Encontrar el modelo nuevo','Después de agregar «Toyota Corolla», podemos escribir Toyota en el buscador y ver la coincidencia.',
          "final resultados = vehiculos.where((vehiculo) {\n  return vehiculo.toLowerCase().contains(busqueda.trim().toLowerCase());\n}).toList();",
          {stage:9,query:'',added:'Toyota Corolla',formReady:true},
          {stage:9,query:'Toyota',added:'Toyota Corolla',formReady:true},'results',{interactive:true})
      ]
    },
        bloc: {
      name:'BLoC explicado sobre la Tienda',
      kind:'conceptual',
      steps:[
        S('Comparar responsabilidades','La versión anterior almacena y filtra datos en el State. Separar lógica con BLoC no obliga a cambiar la apariencia.',
          "Interfaz → Evento → BLoC → Estado → Interfaz",
          {stage:9},{stage:9,blocFlow:true},'body',
          {visual:false,note:'Flujo conceptual: aún no hemos implementado BLoC en actividad2a.'}),
        S('Enviar evento BuscarVehiculos','Al escribir «Renault», la pantalla comunica una intención de búsqueda. La lógica devolvería la lista filtrada.',
          "BuscarVehiculos('Renault')\n  → BLoC\n  → VehiculosEncontrados([...])",
          {stage:9,query:''},{stage:9,query:'Renault',blocFlow:true},'results',{interactive:true}),
        S('Representar un estado de carga','Si la búsqueda dependiera de una API, el estado de carga podría mostrar un indicador temporal.',
          "BuscandoVehiculos()  // Estado conceptual",
          {stage:9,query:'Renault',blocFlow:true},{stage:9,query:'Renault',blocFlow:true,loading:true},'results',
          {note:'Esta es una posibilidad futura, no parte del main.dart actual.'}),
        S('Representar cero resultados','Cuando la lógica no encuentra coincidencias, el estado permitiría mostrar un mensaje comprensible.',
          "VehiculosEncontrados([])\n  → Text('No se encontraron vehículos')",
          {stage:9,query:'Renault',blocFlow:true},{stage:9,query:'xyz',blocFlow:true},'results',{interactive:true})
      ]
    }
  };
  window.FlutterLabStageData = data;
})();
