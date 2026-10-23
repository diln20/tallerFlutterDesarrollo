(function flutterStagePreviews(){
  'use strict';
  const data=window.FlutterLabStageData||{};
  const modules=['preparacion','punto-entrada','estructura','diseno','campo-texto','proyecto','carpetas','reutilizacion','validacion','objeto','extraccion','navegacion','responsive','estado','formularios','bloc'];
  const baseCars=['Renault 9','Renault 21','Mazda 3','Chevrolet Spark'];
  const runtimeMap=new Map();
  // Ampliacion visible por defecto; el usuario puede alternar por modulo.
  const expandedViews=new Map();
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const S={
    0:{editor:true,opened:false,ready:false},
    2:{appbar:false,centered:true,bodyText:'Primer widget'},
    3:{appbar:true,centered:true,bodyText:'Hello dsfdsWorld'},
    4:{appbar:true,bodyText:'Hello dsfdsWorld',topIcon:true,firstGap:20,row:true,rowGap:8},
    5:{appbar:true,bodyText:'Hello dsfdsWorld',topIcon:true,firstGap:20,row:true,rowGap:8,search:true,searchInline:true,hintText:true},
    6:{appbar:true,bodyText:'Hello dsfdsWorld',topIcon:true,firstGap:20,row:true,rowGap:8,search:true,searchInline:false,hintText:true,padding:16,scroll:true,outlined:true,rowFlexible:true},
    7:{appbar:true,bodyText:'Hello dsfdsWorld',topIcon:true,firstGap:20,row:true,rowGap:8,search:true,searchInline:false,hintText:true,padding:16,scroll:true,outlined:true,rowFlexible:true,reactive:true},
    8:{appbar:true,bodyText:'Hello dsfdsWorld',topIcon:true,firstGap:20,row:true,rowGap:8,search:true,searchInline:false,hintText:true,padding:16,scroll:true,outlined:true,rowFlexible:true,reactive:true,results:true},
    9:{appbar:true,bodyText:'Hello dsfdsWorld',topIcon:true,firstGap:20,row:true,rowGap:8,search:true,searchInline:false,hintText:true,padding:16,scroll:true,outlined:true,rowFlexible:true,reactive:true,results:true,form:true,formTitle:true,formField:true,addButton:true,formReady:true},
    11:{appbar:true,bodyText:'Hello dsfdsWorld',topIcon:true,firstGap:20,row:true,rowGap:8,search:true,searchInline:true,hintText:true,form:true,formTitle:true,formField:true,addButton:true,formReady:true,simpleForm:true}
  };
  const state=desc=>({...S[desc.stage],...desc});
    function editorUI(v,which,highlight){
  const mode=v.editorMode||'workspace';
  const opened=Boolean(v.opened);
  const codeStage=Number.isInteger(v.codeStage)?v.codeStage:0;
  const stageCode=[
    {text:"import 'package:flutter/material.dart';",tier:1},
    {text:"",tier:0},
    {text:"void main() {",tier:2},
    {text:"  runApp(const MainApp());",tier:2},
    {text:"}",tier:2},
    {text:"",tier:0},
    {text:"class MainApp extends StatelessWidget {",tier:3},
    {text:"  const MainApp({super.key});",tier:3},
    {text:"  // Aquí añadiremos build en el siguiente paso.",tier:3},
    {text:"}",tier:3}
  ];
  const line=(text,n,isNew)=>`<div class="pv-ide-code-row${isNew?' pv-ide-new':''}"><em>${String(n).padStart(2,'0')}</em><code>${esc(text)||' '}</code></div>`;
  const folder=`<aside class="pv-ide-explorer"><div class="pv-ide-explorer-title">EXPLORADOR</div>
      <div class="pv-tree-root">▾ actividad2a</div>
      <div class="pv-tree-item">▸ android</div>
      <div class="pv-tree-item">▾ lib</div>
      <div class="pv-tree-item pv-ide-selected">▤ main.dart <span>ABIERTO</span></div>
      <div class="pv-tree-item">▸ web</div>
      <div class="pv-tree-item">◇ pubspec.yaml</div></aside>`;
  const title=`<div class="pv-editor-title"><span aria-hidden="true">● ● ●</span> VS Code · ilustración didáctica</div>`;
  const tabs=opened?`<div class="pv-editor-tab"><span>▤ main.dart</span><span>▣ pubspec.yaml</span></div>`:
    `<div class="pv-editor-tab"><span>Inicio de VS Code</span><span>Sin archivos abiertos</span></div>`;
  let content='',footer='';
  if(mode==='workspace'&&!opened){
    content=`<div class="pv-ide-welcome"><div class="pv-ide-welcome-icon">◇</div>
      <strong>Sin carpeta de proyecto abierta</strong>
      <p>En el Explorador todavía no aparece <b>actividad2a</b> ni puedes seleccionar <b>lib/main.dart</b>.</p>
      <div class="pv-ide-welcome-hint">Archivo → Abrir carpeta…</div></div>`;
    footer='PENDIENTE · Abrir actividad2a';
  } else if(mode==='workspace'){
    content=`<div class="pv-ide-grid">${folder}
      <div class="pv-ide-code-pane"><div class="pv-ide-code-caption">lib/main.dart · archivo original de clase</div>
        ${line("import 'package:flutter/material.dart';",1,true)}
        ${line("",2,false)}
        ${line("void main() {",3,false)}
        ${line("  runApp(const MainApp());",4,false)}
        ${line("}",5,false)}
        ${line("",6,false)}
        ${line("class MainApp extends StatelessWidget {",7,false)}
        <div class="pv-ide-file-found">✓ Archivo seleccionado: lib/main.dart</div>
      </div></div>`;
    footer='UBICADO · actividad2a / lib / main.dart';
  } else if(mode==='dependencies'){
    const command= v.ready?
       `<div class="pv-ide-term-line pv-ide-command">PS actividad2a&gt; <strong>flutter pub get</strong></div>
        <div class="pv-ide-term-line">Resolving dependencies...</div>
        <div class="pv-ide-term-line">Downloading packages...</div>
        <div class="pv-ide-term-line pv-ide-success">✓ Got dependencies!</div>`:
       `<div class="pv-ide-term-line">PS actividad2a&gt; <span class="pv-ide-muted">[escribe aquí el comando]</span></div>
        <div class="pv-ide-term-suggest">Pendiente: <strong>flutter pub get</strong></div>
        <p class="pv-ide-term-tip">Todavía no se han preparado las dependencias en esta representación.</p>`;
    content=`<div class="pv-ide-term"><strong class="pv-ide-term-title">TERMINAL · POWERSHELL</strong>${command}
      <div class="pv-ide-demo-note">Salida de ejemplo: esta página NO ejecuta comandos</div>
      </div>`;
    footer=v.ready?'EJEMPLO · Dependencias resueltas':'PENDIENTE · Ejecutar flutter pub get';
  } else if(mode==='run'){
    content=`<div class="pv-ide-term"><strong class="pv-ide-term-title">TERMINAL · POWERSHELL</strong>
      <div class="pv-ide-term-line">PS actividad2a&gt; <strong>flutter pub get</strong></div>
      <div class="pv-ide-term-line pv-ide-success">✓ Dependencias preparadas (simulación)</div>
      <div class="pv-ide-term-suggest">Siguiente comando: <strong>flutter run</strong></div>
      <p class="pv-ide-term-tip">La pantalla aún no se ha iniciado. En «Después» verás cómo se representa la aplicación original.</p>
      </div>`;
    footer='PENDIENTE · Iniciar la aplicación';
  } else if(mode==='folders'){
    const names=['pages','widgets','models','services','repositories','bloc'];
    const count=Math.max(0,Math.min(names.length,Number(v.folderCount)||0));
    const rows=names.map((name,i)=>i<count?
      '<div class="pv-tree-item pv-folder-created'+(i===count-1&&which==='after'?' pv-folder-new':'')+'">▣ '+esc(name)+'/</div>':
      '<div class="pv-tree-item pv-folder-pending">○ '+esc(name)+'/ · pendiente</div>').join('');
    content='<div class="pv-ide-folder-tree">'+
      '<div class="pv-ide-explorer-title">EXPLORADOR · actividad2a</div>'+
      '<div class="pv-tree-root">▾ actividad2a</div>'+
      '<div class="pv-tree-item">▾ lib/</div>'+
      '<div class="pv-tree-item pv-folder-original">▤ main.dart · no mover</div>'+
      rows+
      '<div class="pv-tree-item pv-folder-original">◇ pubspec.yaml · raíz del proyecto</div>'+
      '<div class="pv-folder-footnote">Solo carpetas vacías: no se han añadido archivos ni funcionalidades.</div></div>';
    footer='CARPETAS CREADAS · '+count+' / 6 · main.dart conservado';
  } else if(mode==='newfile'){
    const file=String(v.fileName||'archivo.dart');
    const dir=file==='vehiculo.dart'?'models':file.endsWith('_page.dart')?'pages':'widgets';
    const exists=Boolean(v.filePresent);
    const filled=Boolean(v.fileCode);
    const examples={
      "titulo_seccion.dart": "import 'package:flutter/material.dart';\n\nclass TituloSeccion extends StatelessWidget {\n  const TituloSeccion({\n    super.key,\n    required this.texto,\n  });\n\n  final String texto;\n\n  @override\n  Widget build(BuildContext context) {\n    return Text(texto);\n  }\n}",
      "vehiculo.dart": "class Vehiculo {\n  const Vehiculo({\n    required this.nombre,\n    this.disponible = true,\n  });\n\n  final String nombre;\n  final bool disponible;\n}",
      "campo_nombre_vehiculo.dart": "import 'package:flutter/material.dart';\n\nclass CampoNombreVehiculo extends StatelessWidget {\n  const CampoNombreVehiculo({\n    super.key,\n    required this.controller,\n  });\n\n  final TextEditingController controller;\n\n  @override\n  Widget build(BuildContext context) {\n    return TextFormField(\n      controller: controller,\n      decoration: const InputDecoration(\n        hintText: 'Nombre del vehículo',\n        border: OutlineInputBorder(),\n      ),\n    );\n  }\n}",
      "boton_tienda.dart": "import 'package:flutter/material.dart';\n\nclass BotonTienda extends StatelessWidget {\n  const BotonTienda({\n    super.key,\n    required this.texto,\n    required this.alPresionar,\n  });\n\n  final String texto;\n  final VoidCallback alPresionar;\n\n  @override\n  Widget build(BuildContext context) {\n    return ElevatedButton(\n      onPressed: alPresionar,\n      child: Text(texto),\n    );\n  }\n}",
      "ayuda_page.dart": "import 'package:flutter/material.dart';\nimport '../widgets/titulo_seccion.dart';\n\nclass AyudaPage extends StatelessWidget {\n  const AyudaPage({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return Scaffold(\n      appBar: AppBar(title: const Text('Ayuda')),\n      body: Center(\n        child: Column(\n          mainAxisAlignment: MainAxisAlignment.center,\n          children: [\n            const TituloSeccion(texto: 'Ayuda de la Tienda'),\n            const SizedBox(height: 12),\n            const Text('Escribe al menos tres caracteres para crear un vehículo.'),\n          ],\n        ),\n      ),\n    );\n  }\n}",
      "acerca_page.dart": "import 'package:flutter/material.dart';\nimport '../widgets/titulo_seccion.dart';\nimport '../widgets/boton_tienda.dart';\n\nclass AcercaPage extends StatelessWidget {\n  const AcercaPage({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return Scaffold(\n      appBar: AppBar(title: const Text('Acerca de')),\n      body: Center(\n        child: Column(\n          mainAxisAlignment: MainAxisAlignment.center,\n          children: [\n            const TituloSeccion(texto: 'Nuestra Tienda'),\n            const SizedBox(height: 12),\n            const Text('Un ejercicio para aprender Flutter.'),\n            const SizedBox(height: 8),\n            BotonTienda(\n              texto: 'Volver a la Tienda',\n              alPresionar: () {\n                Navigator.pop(context);\n              },\n            ),\n          ],\n        ),\n      ),\n    );\n  }\n}"
};
    const example=(examples[file]||'// Consulta el ejemplo completo en la lección').split('\n');
    const codes=filled?example.map((text,i)=>line(text,i+1,which==='after')).join(''):
      '<div class="pv-ide-file-empty">'+(exists?'El archivo está creado. El siguiente paso será escribir su clase.':
      'Todavía no existe este archivo en la carpeta '+esc(dir)+'.')+'</div>';
    content='<div class="pv-ide-grid"><aside class="pv-ide-explorer">'+
      '<div class="pv-ide-explorer-title">EXPLORADOR</div>'+
      '<div class="pv-tree-root">▾ actividad2a</div>'+
      '<div class="pv-tree-item">▾ lib/</div>'+
      '<div class="pv-tree-item">▾ '+esc(dir)+'/</div>'+
      (exists?'<div class="pv-tree-item pv-ide-selected">▤ '+esc(file)+'</div>':
      '<div class="pv-tree-item pv-folder-pending">○ Sin archivo todavía</div>')+
      '<div class="pv-tree-item">▤ main.dart · intacto</div>'+
      '</aside><div class="pv-ide-code-pane">'+
      '<div class="pv-ide-code-caption">'+esc(dir)+'/'+esc(file)+'</div>'+
      '<div class="pv-ide-code-scroll">'+codes+'</div></div></div>';
    footer=exists?'ARCHIVO CREADO · lib/'+dir+'/'+file:
      'PENDIENTE · Crear '+file;
  } else if(mode==='dart'){
    const visible=stageCode.filter(x=>x.tier<=codeStage);
    const code=codeStage>0?visible.map((x,i)=>line(x.text,i+1,x.tier===codeStage&&which==='after')).join(''):
      '<div class="pv-ide-file-empty">El archivo de práctica está vacío.<br>La primera instrucción será <code>import</code>.</div>';
    content=`<div class="pv-ide-grid">${folder}<div class="pv-ide-code-pane">
      <div class="pv-ide-code-caption">${codeStage===0?'Antes de escribir Dart':'Contenido acumulado en main.dart'}</div>
      <div class="pv-ide-code-scroll">${code}</div></div></div>`;
    footer=codeStage===0?'ETAPA 00 · Archivo de práctica vacío':
      `ETAPA 0${codeStage} · ${codeStage===1?'Importación':codeStage===2?'Función main()':'Encabezado de MainApp'}${codeStage===3?' · build pendiente':''}`;
  }
  return `<div class="pv-editor pv-editor-${mode}" data-pv-editor-mode="${mode}" data-pv-editor-stage="${codeStage}">
    ${title}${tabs}<div class="pv-ide-viewport">${content}</div>
    <div class="pv-editor-status">${esc(footer)}</div>
  </div>`;
}
    function nonVisualUI(id,index,item){
 const matrix={
  'punto-entrada':{4:['Reconocer sin escribir código nuevo','const y super.key ya estaban presentes','Entiendes para qué sirven y cuándo usar const','No se agrega ni se elimina ningún widget.']},
  estructura:{0:['Ubicar lo que ya existía','Scaffold ya muestra «Primer widget»','Identificamos dónde están body, Center y Text','Este paso es de lectura: no modifica la interfaz ni necesita pegar código.']},
  'campo-texto':{0:['Partir de la fila existente','Row con icono, espacio y texto','Reconoces dónde se añadirá Expanded con TextField','El buscador aún no se ha incorporado en esta etapa.']},
  responsive:{1:['Preparar desplazamiento','Column sin contenedor desplazable','SingleChildScrollView envuelve la misma Column','El scroll solo es evidente si el contenido supera la altura disponible.'],
    2:['Configurar la alineación','Column con alineación predeterminada','Column con crossAxisAlignment.stretch','El efecto se apreciará al reorganizar los widgets siguientes.']},
  estado:{0:['Cambiar la clase principal','MainApp: StatelessWidget','MainApp: StatefulWidget y _MainAppState','El árbol de widgets se conserva; cambia la estructura del programa.'],
    1:['Declarar estado','_MainAppState sin busqueda','_MainAppState guarda String busqueda = \'\';','La nueva variable no se muestra hasta que agreguemos un Text que la lea.'],
    2:['Leer lo escrito','TextField sin onChanged','TextField con onChanged que actualiza busqueda mediante setState','Ya se procesa la entrada, pero todavía falta el widget que muestra ese valor.']},
  formularios:{0:['Agregar datos de ejemplo','State sin catálogo','State con cuatro nombres dentro de List<String>','La lista existe en el código, pero todavía no se está dibujando.'],
    1:['Calcular coincidencias','build sin resultados','build calcula resultados usando where y busqueda','Hasta añadir ListTile, la pantalla no muestra estos resultados.']},
  proyecto:{3:['Preparar el estado','MainApp: StatelessWidget','MainApp: StatefulWidget y _MainAppState','Se conserva el contenido del método build y toda la pantalla de la Tienda.'],
    4:['Crear el controlador','State sin controlador de nombre','State con vehiculoController declarado una vez','La apariencia del campo no cambia por declarar el objeto.'],
    5:['Enlazar el campo','Segundo TextField sin controller','Segundo TextField con controller: vehiculoController','Visualmente es el mismo campo, pero ahora podemos leer su texto y limpiarlo.'],
    8:['Liberar recursos','State sin método dispose propio','dispose() libera vehiculoController y llama super.dispose()','La limpieza sucede al finalizar el State, no al dibujar ni pulsar.']},
  bloc:{0:['Comparar arquitectura futura','State agrupa la lógica de búsqueda','Evento → BLoC → Estado separaría responsabilidades','Es una explicación conceptual: BLoC aún no está implementado.']}
 };
 const d=matrix[id]?.[index] || (item?.beforeCode&&item?.afterCode?[item.name,item.beforeCode,item.afterCode,item.effect]:null);if(!d)return '';
 const [name,before,after,detail]=d;
 return `<section class="pv-code-difference" aria-label="Diferencia real de este paso">
    <header><span>DIFERENCIA REAL DEL PASO</span><strong>${esc(name)}</strong></header>
    <div class="pv-diff-row"><div class="pv-diff-old"><small>ANTES</small><p>${esc(before)}</p></div>
      <span class="pv-diff-arrow" aria-hidden="true">→</span>
      <div class="pv-diff-new"><small>DESPUÉS</small><p>${esc(after)}</p></div></div>
    <p class="pv-diff-detail">${esc(detail)} <strong>El fragmento exacto y su ubicación se explican debajo.</strong></p>
    <small class="pv-diff-warning">Mapa conceptual para comparar; no es código para copiar.</small>
  </section>`;
}
  function searchUI(v,which,highlight,r){
    const value=which==='after'?r.query:(v.query||'');
    return `<div class="pv-search${v.searchInline?' pv-search-inline':''}${v.outlined?' pv-bordered':''}${highlight==='search'&&which==='after'?' pv-glow':''}">
      <input type="text" placeholder="${v.hintText===false?'':"Buscar marca o modelo"}" value="${esc(value)}"
        ${which==='after'?'data-pv-query':''} ${which==='before'?'readonly tabindex="-1"':''}
        aria-label="Buscar marca o modelo en la vista previa" autocomplete="off">
    </div>`;
  }
  function carsUI(v,which,highlight,r){
    const query=which==='after'?r.query:(v.query||'');
    const models=baseCars.concat(which==='after'?r.addedCars:(v.added?[v.added]:[]));
    const matches=models.filter(c=>c.toLowerCase().includes(query.trim().toLowerCase()));
    return `<section class="pv-results${highlight==='results'&&which==='after'?' pv-glow':''}">
       <strong>Vehículos encontrados:</strong>
       <small data-pv-count>${matches.length} resultado${matches.length===1?'':'s'}</small>
       <div data-pv-items>${matches.length?matches.map(c=>`<div class="pv-car-item"><span>🚘</span>${esc(c)}</div>`).join(''):'<div class="pv-no-results">No se encontraron vehículos.</div>'}</div>
    </section>`;
  }
  function formUI(v,which,highlight,r){
    const showTitle=v.formTitle!==false;
    const showField=v.formField!==false;
    const showButton=v.addButton!==false;
    const ready=v.formReady!==false;
    const errorText=r.validationMessage||(r.model&&r.model.trim().length<3?'Mínimo 3 caracteres':'Escribe un nombre');
    return `<section class="pv-form">
      ${showTitle?`<strong class="${highlight==='form-title'&&which==='after'?'pv-glow':''}">Agregar un vehículo</strong>`:''}
      ${showField?`${v.simpleForm?'':`<label class="${highlight==='form-field'&&which==='after'?'pv-glow':''}">Nombre del vehículo</label>`}
      <input type="text" data-pv-model="${which}" value="${which==='after'?esc(r.model):''}"
        class="${highlight==='form-field'&&which==='after'?'pv-glow':''}"
        placeholder="${v.simpleForm?'Nombre del vehículo':'Ej. Toyota Corolla'}" autocomplete="off"
        ${which==='before'?'readonly tabindex="-1"':''}>${v.validationEnabled&&which==='after'?`<div class="pv-validation" data-pv-error ${r.invalid?'':'hidden'}>${esc(errorText)}</div>`:''}`:''}
      ${showButton?`<button type="button" class="pv-submit${highlight==='button'&&which==='after'?' pv-glow':''}"
        ${which==='after'&&ready?'data-pv-submit':''}
        ${which==='before'?'disabled':''}>Agregar vehículo</button>`:''}
    </section>`;
  }
  function pageUI(page,which){
 const help=page==='ayuda';
 const top=help?'Ayuda':'Acerca de';
 const heading=help?'Ayuda de la Tienda':'Nuestra Tienda';
 const message=help?'Escribe al menos tres caracteres para crear un vehículo.':'Un ejercicio para aprender Flutter.';
 const buttons=help?
   '<button type="button" class="pv-nav-button" data-pv-nav="back">Volver</button>':
   '<button type="button" class="pv-nav-button" data-pv-nav="ayuda">Ver ayuda</button><button type="button" class="pv-nav-button pv-nav-secondary" data-pv-nav="back">Volver a la Tienda</button>';
 return `<div class="pv-device pv-page-demo">
   <div class="pv-status">9:41 <span>◉ ▰</span></div>
   <div class="pv-app-screen">
     <div class="pv-appbar"><button type="button" class="pv-nav-back" data-pv-nav="back" aria-label="Regresar">←</button><strong>${esc(top)}</strong></div>
     <div class="pv-content pv-nav-page-content">
       <strong>${esc(heading)}</strong>
       <p>${esc(message)}</p>
       ${buttons}
     </div>
   </div>
   <div class="pv-home-indicator"><span></span></div>
 </div>`;
}
  function screenUI(v,which,highlight,r){
    if(v.editor)return editorUI(v,which,highlight);
    if(v.navigationEnabled&&which==='after'&&r.pageStack?.length>1)return pageUI(r.pageStack.at(-1),which);
    const centered=v.centered?' pv-centered':'';
    const bodyHL=highlight==='body'&&which==='after'?' pv-body-glow':'';
    const noteHL=(kind)=>highlight===kind&&which==='after'?' pv-glow':'';
    return `<div class="pv-device">
      <div class="pv-status">9:41 <span>◉ ▰</span></div>
      <div class="pv-app-screen">
        ${v.appbar!==false?`<div class="pv-appbar${noteHL('appbar')}${v.appbarCentered?' pv-title-center':''}">
          <strong>Tienda</strong>${v.appbarActions?'<span>⌕ ⋮</span>':''}
        </div>`:''}
        <div class="pv-content${centered}${bodyHL}" style="--pv-indent:${v.padding||0}px">
          <div class="pv-body-text${noteHL('firstText')}">${esc(v.bodyText)}</div>
          ${v.topIcon?`
            <div class="pv-gap${highlight==='spacer'&&which==='after'?' pv-gap-highlight':''}" style="height:${v.firstGap??20}px"></div>
            <div class="pv-big-icon${noteHL('topIcon')}">🚘</div>
            <div style="height:8px"></div>`:''}
          ${v.row?`<div class="pv-row${noteHL('row')}${v.rowFlexible?' pv-row-flexible':''}">
            <span>🚘</span><span class="pv-row-gap" style="width:${v.rowGap??8}px"></span>
            <span class="pv-row-text">Ingenieria de Sistemas</span>
            ${v.search&&v.searchInline?searchUI(v,which,highlight,r):''}
          </div>`:''}
          ${v.search&&!v.searchInline?searchUI(v,which,highlight,r):''}
          ${v.reactive?`<p class="pv-search-label${noteHL('searchLabel')}" data-pv-label>Estás buscando: ${esc(which==='after'?r.query:(v.query||''))}</p>`:''}
          ${v.results?carsUI(v,which,highlight,r):''}
          ${v.form?formUI(v,which,highlight,r):''}
          ${v.navigationEnabled?`<button type="button" class="pv-nav-button pv-nav-from-home${which==='after'?' pv-glow':''}" ${which==='after'?'data-pv-nav="acerca"':'disabled'}>Acerca de y ayuda</button>`:''}
        </div>
        ${''}
        ${v.loading?'<div class="pv-loading"><span class="pv-spinner"></span> Buscando vehículos...</div>':''}
        ${(which==='after'&&r.snackbar)||(which==='before'&&v.snackbar)?
          `<div class="pv-snackbar" data-pv-snackbar>✓ ${esc(which==='after'?r.snackbar:v.snackbar)}</div>`:''}
      </div>
      <div class="pv-home-indicator"><span></span></div>
    </div>`;
  }
  function render(id,index,phase='after',preserveState=false){
    const cfg=data[id],slot=document.getElementById('pv-'+id);
    if(!cfg||!slot)return;
    const i=Math.max(0,Math.min(index,cfg.steps.length-1));
    const item=cfg.steps[i];
    const before=state(item.before),after=state(item.after);
    const oldRuntime=runtimeMap.get(id);
    const runtime=preserveState&&oldRuntime?.step===i?
      {...oldRuntime,phase}:
      {id,step:i,phase,query:after.query||'',addedCars:after.added?[after.added]:[],
        model:'',invalid:!!after.validationError,validationMessage:'Escribe un nombre',snackbar:after.snackbar||'',
        clearAfterSave:!!after.clearAfterSave,debugMessage:'',pageStack:['tienda']};
    runtimeMap.set(id,runtime);
    const internal=item.visual===false;
    const editorTransition=internal&&before.editor&&after.editor;
    const effectType=editorTransition?'Cambio en VS Code o terminal':internal?'La pantalla Flutter sigue igual':'Cambio representado';
    const status={original:'Basado en el código real',reconstruct:'Reconstrucción didáctica',proposed:'Funcionalidad propuesta',conceptual:'Concepto futuro'};
    const isExpanded=expandedViews.get(id)!==false;
    slot.innerHTML=`<section class="pv-shell${isExpanded?' pv-large-view':''}" data-pv-module="${id}">
      <header class="pv-header"><div><span class="pv-kicker">${status[item.kind||cfg.kind]}</span>
        <h2>Así va cambiando tu aplicación</h2>
        <p>Elige un paso, compara el antes y el después y reconoce la instrucción que lo produjo.</p></div>
        <strong class="pv-index">PASO ${i+1} / ${cfg.steps.length}</strong>
      </header>
      <nav class="pv-step-list" aria-label="Cambios de ${esc(cfg.name)}">
        ${cfg.steps.map((s,n)=>`<button type="button" class="pv-step${n===i?' pv-active':''}" data-pv-step="${n}" aria-pressed="${n===i}"><span>${String(n+1).padStart(2,'0')}</span>${esc(s.name)}</button>`).join('')}
      </nav>
      <div class="pv-effect"><div class="pv-effect-top"><strong>${esc(item.name)}</strong>
          <span class="pv-effect-type${internal?' pv-internal':''}">${esc(effectType)}</span></div>
        <p>${esc(item.effect)}</p>${item.note?`<p class="pv-special-note">${esc(item.note)}</p>`:''}
      </div>
      <div class="pv-mobile-toggle" aria-label="Comparar las dos versiones">
        <button type="button" data-pv-phase="before" aria-pressed="${phase==='before'}" class="${phase==='before'?'active':''}">Antes</button>
        <button type="button" data-pv-phase="after" aria-pressed="${phase==='after'}" class="${phase==='after'?'active':''}">Después</button>
      </div>
      <div class="pv-view-controls"><div><strong>Comparación de tamaño legible</strong><span>${isExpanded?'Cada vista ocupa todo el ancho para leer archivos y pantallas.':'Comparación reducida en dos columnas.'}</span></div><button type="button" data-pv-zoom aria-pressed="${isExpanded}" aria-label="${isExpanded?'Mostrar comparación compacta':'Ampliar comparación'}">${isExpanded?'↙ Vista compacta':'⤢ Ampliar comparación'}</button></div>
      <div class="pv-compare">
        <div class="pv-side${phase==='before'?' pv-selected':''}" data-pv-side="before">
          <div class="pv-side-heading"><strong>ANTES</strong><span>Antes de aplicar el cambio</span></div>
          <div class="pv-preview-area">${screenUI(before,'before',item.highlight,
            {...runtime,query:before.query||'',addedCars:before.added?[before.added]:[],invalid:!!before.validationError})}</div>
        </div>
        <div class="pv-side pv-after${phase==='after'?' pv-selected':''}" data-pv-side="after">
          <div class="pv-side-heading"><strong>DESPUÉS</strong><span>${editorTransition?'Ahora puedes identificar el cambio':internal?'Misma pantalla; cambia el código':'Elemento modificado resaltado'}</span></div>
          <div class="pv-preview-area">${screenUI(after,'after',item.highlight,runtime)}</div>
        </div>
      </div>
      ${internal&&!editorTransition?nonVisualUI(id,i,item):''}
       ${['proyecto','validacion','objeto','extraccion'].includes(id)?'<div class="pv-debug-console" data-pv-debug-console hidden><strong>Salida simulada de la consola de Flutter</strong><code data-pv-debug-message></code><p>La instrucción debugPrint escribe en la consola de desarrollo, no en la pantalla del móvil.</p></div>':''}
      ${id==='bloc'?'<div class="pv-bloc-flow">Flujo conceptual fuera de la pantalla: <strong>Evento → BLoC → Estado</strong> · Sin implementación en main.dart</div>':''}
      <div class="pv-notices">
        ${after.form?'<span class="pv-scroll-tip">↕ Desplázate dentro del teléfono para ver el campo y el botón.</span>':''}
        <span class="pv-result-status">${editorTransition?'Observa el cambio en el VS Code o terminal simulados; Flutter aún no cambia.':internal?'La pantalla sigue igual: revisa el mapa de la diferencia real y el fragmento Dart.':'El contorno amarillo señala lo nuevo o modificado.'}</span>
        <span class="pv-simulation-note">Simulación HTML: no es una captura ni una ejecución real de Flutter.</span>
      </div>
      <div class="pv-code-explain">
        <div class="pv-code-intro"><div><strong>${id==='preparacion'?'¿Qué archivo localizar o comando ejecutar?':id==='bloc'?'¿Qué idea representa el paso?':'¿Qué código corresponde a este paso?'}</strong><p>La vista o el mapa muestran el cambio real. Las líneas coloreadas y la guía inferior indican qué añadir, reemplazar u observar.</p></div><span>${status[item.kind||cfg.kind]}</span></div>
        <div class="code-label">${id==='preparacion'?(i===0?'Esquema de archivos':'Terminal · PowerShell'):id==='bloc'?'Concepto BLoC (pseudocódigo)':id==='carpetas'?'PowerShell · carpetas':id==='reutilizacion'&&i===0||id==='objeto'&&i===0?'Ruta de archivo':'Dart'} · ${esc(item.name)}</div>
        <pre class="code-block"><code>${esc(item.code)}</code></pre>
      </div>
      <div class="pv-nav-bottom">
        <button type="button" data-pv-prev ${i===0?'disabled':''}>← Anterior</button>
        <span class="pv-progress" style="--pv-progress:${(i+1)*100/cfg.steps.length}%"></span>
        <button type="button" data-pv-next ${i===cfg.steps.length-1?'disabled':''}>Siguiente →</button>
      </div>
    </section>`;
    document.dispatchEvent(new CustomEvent('flutterlab:catalog-code'));
    // Recorre el propio teléfono hasta el elemento cambiado, sin mover el scroll del documento.
    if(typeof window.requestAnimationFrame==='function') {
      window.requestAnimationFrame(()=>{
        const screen=slot.querySelector('.pv-after .pv-app-screen');
        const changed=slot.querySelector('.pv-after .pv-glow');
        if(!screen||!changed||!screen.getBoundingClientRect||!changed.getBoundingClientRect)return;
        const box=screen.getBoundingClientRect();
        const target=changed.getBoundingClientRect();
        if(target.bottom>box.bottom-16 || target.top<box.top+13){
          screen.scrollTop+=target.top-box.top-58;
        }
      });
    }
  }
  const maps={
    preparacion:[1,2,0,2],
    'punto-entrada':[4,3,4],
    estructura:[1,2,0,3,4],
    diseno:[4,0,2,3],
    'campo-texto':[1,2,3,1,2],
    responsive:[0,0,4,5],
    estado:[0,2,3,4],
    formularios:[0,1,2,3],
    proyecto:[0,1,2,3,4,5,6,7,8,0,8],
    carpetas:[0,0,1,2,3,4,5],
    reutilizacion:[0,1,2,3,4,4,4],
    validacion:[0,1,2,3,4,4,4],
    objeto:[0,1,2,3,4,4,4],
    extraccion:[0,1,2,3,4,5,6,7,8,2,6,8],
    navegacion:[0,1,2,3,4,5,6,7,8,8,1,4,8],
    bloc:[]
  };
  function linkCodeBlocks(){
    for(const id of modules){
      const section=document.getElementById(id);if(!section)continue;
      const codes=[...section.querySelectorAll('pre.code-block')].filter(p=>!p.closest('.pv-shell'));
      codes.forEach((pre,n)=>{
        const index=Math.min(data[id].steps.length-1,(maps[id]||[])[n]??n);
        const item=data[id].steps[index];if(!item||pre.nextElementSibling?.classList.contains('pv-code-link'))return;
        const box=document.createElement('div');box.className='pv-code-link';
        box.innerHTML=`<div><strong>Ver qué cambia en la aplicación</strong><span>${esc(item.name)}</span></div>
          <button type="button" data-pv-jump="${id}" data-pv-index="${index}">Vista antes/después ↗</button>`;
        pre.insertAdjacentElement('afterend',box);
      });
    }
  }
  function updateResults(id){
    const r=runtimeMap.get(id);if(!r)return;
    const wrapper=document.getElementById('pv-'+id);if(!wrapper)return;
    const after=wrapper.querySelector('[data-pv-side="after"]');if(!after)return;
    const label=after.querySelector('[data-pv-label]');if(label)label.textContent='Estás buscando: '+r.query;
    const container=after.querySelector('[data-pv-items]');
    if(container){
      const match=baseCars.concat(r.addedCars).filter(c=>c.toLowerCase().includes(r.query.trim().toLowerCase()));
      container.innerHTML=match.length?match.map(c=>`<div class="pv-car-item"><span>🚘</span>${esc(c)}</div>`).join(''):'<div class="pv-no-results">No se encontraron vehículos.</div>';
      const count=after.querySelector('[data-pv-count]');
      if(count)count.textContent=match.length+' resultado'+(match.length===1?'':'s');
    }
    const debug=wrapper.querySelector('[data-pv-debug-console]');
    if(debug){debug.hidden=!r.debugMessage;const line=debug.querySelector('[data-pv-debug-message]');if(line)line.textContent=r.debugMessage||'';}
    const error=after.querySelector('[data-pv-error]');if(error){error.hidden=!r.invalid;error.textContent=r.validationMessage||'Escribe un nombre';}
    let snackbar=after.querySelector('[data-pv-snackbar]');
    if(snackbar)snackbar.textContent='✓ '+r.snackbar;
    else if(r.snackbar){
      const area=after.querySelector('.pv-app-screen');
      if(area){snackbar=document.createElement('div');snackbar.className='pv-snackbar';snackbar.dataset.pvSnackbar='';
        snackbar.textContent='✓ '+r.snackbar;area.appendChild(snackbar)}
    }
  }
  function init(){
    for(const id of modules){
      const lesson=document.getElementById(id),cfg=data[id];
      if(!lesson||!cfg)continue;
      const anchor=lesson.querySelector('.goal-box')||lesson.querySelector('.lesson-heading');
      if(!anchor)continue;
      const slot=document.createElement('div');
      slot.className='pv-mount';slot.id='pv-'+id;
      anchor.insertAdjacentElement('afterend',slot);
    }
    for(const id of modules)render(id,0);
    linkCodeBlocks();
    document.documentElement.dataset.stagePreviews=String(modules.filter(id=>document.getElementById('pv-'+id)).length);
  }
  document.addEventListener('click',event=>{
    const target=event.target;if(!target.closest)return;
    const step=target.closest('[data-pv-step]'),dir=target.closest('[data-pv-prev],[data-pv-next]');
    const phase=target.closest('[data-pv-phase]'),jump=target.closest('[data-pv-jump]');
    const submit=target.closest('[data-pv-submit]');
    const zoom=target.closest('[data-pv-zoom]');
    if(zoom){
      const shell=zoom.closest('[data-pv-module]');
      const id=shell?.dataset.pvModule;
      if(!shell||!id)return;
      const large=!shell.classList.contains('pv-large-view');
      expandedViews.set(id,large);
      shell.classList.toggle('pv-large-view',large);
      zoom.setAttribute('aria-pressed',String(large));
      zoom.setAttribute('aria-label',large?'Mostrar comparación compacta':'Ampliar comparación');
      zoom.textContent=large?'↙ Vista compacta':'⤢ Ampliar comparación';
      const detail=shell.querySelector('.pv-view-controls span');
      if(detail)detail.textContent=large?'Cada vista ocupa todo el ancho para leer archivos y pantallas.':'Comparación reducida en dos columnas.';
      return;
    }
    if(step||dir||phase){
      const id=(step||dir||phase).closest('[data-pv-module]')?.dataset.pvModule,r=runtimeMap.get(id);if(!r)return;
      if(step)render(id,Number(step.dataset.pvStep),r.phase);
      else if(dir)render(id,r.step+(dir.hasAttribute('data-pv-next')?1:-1),r.phase);
      else render(id,r.step,phase.dataset.pvPhase,true);
      return;
    }
    if(jump){
      const id=jump.dataset.pvJump;
      render(id,Number(jump.dataset.pvIndex));
      document.getElementById('pv-'+id)?.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
    const navAction=target.closest('[data-pv-nav]');
    if(navAction){
      const id=navAction.closest('[data-pv-module]')?.dataset.pvModule;
      if(id!=='navegacion')return;
      const r=runtimeMap.get(id);if(!r)return;
      const action=navAction.dataset.pvNav;
      if(action==='back'){
        if(r.pageStack.length>1)r.pageStack.pop();
      }else if((action==='acerca'&&r.pageStack.at(-1)==='tienda')||
               (action==='ayuda'&&r.pageStack.at(-1)==='acerca')){
        r.pageStack.push(action);
      }
      const slot=document.getElementById('pv-'+id);
      const area=slot?.querySelector('.pv-after .pv-preview-area');
      const current=data[id]?.steps[r.step];
      if(area&&current)area.innerHTML=screenUI(state(current.after),'after',current.highlight,r);
      return;
    }
    if(submit){
      const id=submit.closest('[data-pv-module]')?.dataset.pvModule,r=runtimeMap.get(id);if(!r)return;
      const name=r.model.trim();
      if(id==='validacion'||id==='objeto'||id==='extraccion'){
        if(name.length<3){
          r.invalid=true;
          r.validationMessage=name.length?'Mínimo 3 caracteres':'Escribe un nombre';
          r.debugMessage='';
          updateResults(id);
          return;
        }
      }
      if(!name)return;
      if(id==='objeto'||id==='extraccion') r.debugMessage='Vehículo creado: '+name+' - Disponible: true';
      else if(['proyecto','validacion','reutilizacion'].includes(id)) r.debugMessage='Vehículo escrito: '+name;
      else r.addedCars.push(name);
      r.invalid=false;
      r.snackbar='';
      if(r.clearAfterSave||id==='validacion'||id==='objeto'||id==='extraccion') {
        r.model='';
        const field=submit.closest('[data-pv-side]')?.querySelector('[data-pv-model="after"]');
        if(field)field.value='';
      }
      updateResults(id);
    }
  });
  document.addEventListener('input',event=>{
    const target=event.target;if(!target.matches)return;
    if(target.matches('[data-pv-query]')){
      const id=target.closest('[data-pv-module]')?.dataset.pvModule,r=runtimeMap.get(id);
      if(r){r.query=target.value;updateResults(id);}
    }
    if(target.matches('[data-pv-model="after"]')){
      const id=target.closest('[data-pv-module]')?.dataset.pvModule,r=runtimeMap.get(id);
      if(r){r.model=target.value;r.invalid=false;updateResults(id);}
    }
  });
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();