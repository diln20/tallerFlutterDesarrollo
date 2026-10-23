/* FlutterLab: resaltar SOLO las lineas nuevas, cambiadas o importantes.
   No cambia el codigo que se copia: los saltos de linea siguen presentes en textContent. */
(() => {
  'use strict';
  const guide=window.FlutterCodePlacementData;
  const steps=window.FlutterLabStageData;
  if(!guide||!steps)return;

  // Selectores concretos por paso: evita colorear por igual cada linea del ejemplo.
  const focus={
    'punto-entrada':[
      ["import 'package:flutter"],['void main()', 'runApp('],
      ['class MainApp extends StatelessWidget','const MainApp('],
      ['return const MaterialApp(','home: Scaffold(','body: Center(','child: Text('],
      ['const MainApp(', 'runApp(']
    ],
    estructura:[
      ['Scaffold(', 'body: Center('],
      ['appBar: AppBar(', "title: const Text('Tienda')"],
      ['body: const Center(', "child: Text('Primer widget')"],
      ['centerTitle: true'],
      ['actions: [','IconButton(','onPressed:','icon:']
    ],
    diseno:[
      ['child: Column(', 'children: ['],['Icon(Icons.directions_car)'],
      ['SizedBox(height: 20)'],['Row(', 'children: ['],
      ['SizedBox(width: 8)']
    ],
    'campo-texto':[
      ['Row(', "Text('Ingenieria de Sistemas')"],
      ['Expanded(', 'child: TextField('],
      ['decoration: const InputDecoration(', 'hintText:'],
      ['TextField(', 'hintText:']
    ],
    responsive:[
      ['body: Padding(', 'padding: const EdgeInsets.all(16)'],
      ['SingleChildScrollView('],
      ['crossAxisAlignment:'],
      ['Expanded(', 'maxLines:', 'overflow:'],
      ['SizedBox(height: 12)', 'TextField(...)'],
      ['border: OutlineInputBorder()']
    ],
    estado:[
      ['class MainApp extends StatefulWidget','State<MainApp> createState'],
      ["String busqueda = ''"],
      ['onChanged:', 'setState(', 'busqueda = valor'],
      ['SizedBox(height: 12)', "Text('Estás buscando:"],
      ["Text('Estás buscando:"]
    ],
    formularios:[
      ['final List<String> vehiculos', "'Renault 9'", "'Renault 21'", "'Mazda 3'", "'Chevrolet Spark'"],
      ['final resultados = vehiculos.where','return vehiculo.toLowerCase','busqueda.trim()', '}).toList()'],
      ['for (final vehiculo in resultados)', 'ListTile(', 'title: Text(vehiculo)'],
      ['vehiculo.toLowerCase().contains', 'busqueda.trim().toLowerCase()'],
      ['if (resultados.isEmpty)', "const Text('No se encontraron"]
    ],
    proyecto:[
      ['SizedBox(height: 20)', "Text('Agregar un vehículo')"],
      ['SizedBox(height: 10)', 'TextField(', 'hintText:', 'border:'],
      ['SizedBox(height: 12)', 'ElevatedButton(', 'onPressed:', 'child:'],
      ['class MainApp extends StatefulWidget','State<MainApp> createState', 'class _MainAppState'],
      ['final TextEditingController vehiculoController'],
      ['controller: vehiculoController'],
      ['onPressed: () {', 'final nombre =', 'if (nombre.isEmpty)', 'debugPrint('],
      ['vehiculoController.clear();'],
      ['void dispose()', 'vehiculoController.dispose()', 'super.dispose()']
    ],
    carpetas:[
      ['New-Item', 'lib/pages'],['New-Item','lib/widgets'],['New-Item','lib/models'],
      ['New-Item','lib/services'],['New-Item','lib/repositories'],['New-Item','lib/bloc']
    ],
    reutilizacion:[
      ['lib/widgets/titulo_seccion.dart'],
      ['class TituloSeccion', 'required this.texto', 'final String texto', 'Text(texto)'],
      ["import 'widgets/titulo_seccion.dart'"],
      ["TituloSeccion(texto: 'Primer widget')"],
      ["TituloSeccion(texto: 'Agregar un vehículo')"]
    ],
    validacion:[
      ['TextFormField(', 'controller:', 'hintText:'],
      ['GlobalKey<FormState>', 'formularioKey'],
      ['Form(', 'key: formularioKey', 'TextFormField('],
      ['validator:', 'isEmpty', 'length < 3', 'return null'],
      ['currentState?.validate()', 'return;']
    ],
    objeto:[
      ['lib/models/vehiculo.dart'],
      ['class Vehiculo', 'required this.nombre', 'disponible = true', 'final String', 'final bool'],
      ["import 'models/vehiculo.dart'"],
      ['final vehiculo = Vehiculo(nombre: nombre)'],
      ['Vehículo creado:', 'vehiculo.nombre', 'vehiculo.disponible']
    ],

    extraccion:[
      ["main.dart", "CampoNombreVehiculo", "BotonTienda"],
      ["lib/widgets/campo_nombre_vehiculo.dart"],
      ["class CampoNombreVehiculo", "TextEditingController", "TextFormField("],
      ["validator:", "length < 3", "return null"],
      ["import 'widgets/campo_nombre_vehiculo.dart'"],
      ["CampoNombreVehiculo(", "controller:"],
      ["class BotonTienda", "VoidCallback", "onPressed:"],
      ["import 'widgets/boton_tienda.dart'"],
      ["BotonTienda(", "alPresionar:", "Vehiculo(nombre: nombre)"]
    ],
    navegacion:[
      ["lib/pages/ayuda_page.dart"],
      ["class AyudaPage", "Scaffold(", "AppBar("],
      ["import '../widgets/boton_tienda.dart'"],
      ["BotonTienda(", "Navigator.pop(context)"],
      ["class AcercaPage", "Scaffold(", "Navigator.pop(context)"],
      ["import 'ayuda_page.dart'"],
      ["BotonTienda(", "Navigator.push(", "MaterialPageRoute("],
      ["import 'pages/acerca_page.dart'"],
      ["Builder(", "Navigator.push(", "AcercaPage()"]
    ],
    bloc:[
      ['Interfaz → Evento → BLoC → Estado → Interfaz'],
      ["BuscarVehiculos('Renault')", 'VehiculosEncontrados('],
      ['BuscandoVehiculos()'],
      ['VehiculosEncontrados([])', "Text('No se encontraron"]
    ]
  };
  const statics={
    'punto-entrada':[
      ["import 'package", 'void main()', 'runApp(', 'class MainApp', 'Widget build'],
      ["import 'package","void main()", "runApp(", "class MainApp", "Widget build(", "return const MaterialApp(", "body: Center(", "child: Text("],
      ["const Text('Tienda')","const SizedBox(height: 20)"]
    ],
    estructura:[
      ['return MaterialApp(', 'home: Scaffold(', 'appBar: AppBar(', 'body: Center('],
      null,
      ['Scaffold(', 'appBar:', 'body:'],
      ["appBar: AppBar(title:"],
      ['appBar: AppBar(', 'centerTitle:', 'backgroundColor:', 'foregroundColor:', 'actions:', 'IconButton(']
    ],
    diseno:[
      ['body: Center(', 'child: Column(', 'Row('],
      ['body: Center', 'Column', 'Row', 'Expanded', 'TextField'],
      ['Column(', 'mainAxisAlignment:', 'crossAxisAlignment:'],
      ['children: [','Row(', "Text('Ingenieria de Sistemas')"]
    ],
    'campo-texto':[
      ['Expanded(', 'child: TextField(', 'hintText:'],
      ['hintText:'],
      ["Row(", "Expanded(", "TextField(", "hintText:"],
      ['Row(', 'Expanded(', 'child: TextField('],
      ['31 →','36 →','42 →']
    ],
    responsive:[
      ['Row(', 'Expanded(', 'hintText:'],
      ['body: Padding(', 'padding: const EdgeInsets.all(16)'],
      ['Expanded(', 'maxLines:', 'overflow:', 'const TextField('],
      null
    ],
    estado:[
      ['class MainApp extends StatefulWidget','State<MainApp> createState','class _MainAppState', "String busqueda = ''"],
      ['onChanged:', 'setState(', 'busqueda = valor'],
      ["SizedBox(height: 12)", "Text('Estás buscando:"],
      null
    ],
    formularios:[
      ['final List<String> vehiculos','Renault 9','Renault 21','Mazda 3','Chevrolet Spark'],
      ['final resultados = vehiculos.where','return vehiculo.toLowerCase','busqueda.trim()','}).toList()'],
      ['SizedBox(height: 16)', "Text('Vehículos encontrados')", 'for (final vehiculo', 'ListTile('],
      null
    ],
    proyecto:[
      ['Row(', "Text('Agregar un vehículo')"],
      null
    ],
    carpetas:[
      ['pages/', 'widgets/', 'models/', 'services/', 'repositories/', 'bloc/'],
      ['New-Item'],['New-Item'],['New-Item'],['New-Item'],['New-Item'],['New-Item']
    ],
    reutilizacion:[
      ['lib/widgets/titulo_seccion.dart'],
      ['class TituloSeccion', 'required this.texto', 'final String texto'],
      ["import 'widgets/titulo_seccion.dart'"],
      ["TituloSeccion(texto: 'Primer widget')"],
      ["TituloSeccion(texto: 'Agregar un vehículo')"],
      ['class TituloSeccion', 'return Text(texto)'],
      null
    ],
    validacion:[
      ['TextFormField(', 'controller:'],
      ['GlobalKey<FormState>', 'formularioKey'],
      ['Form(', 'key: formularioKey', 'TextFormField('],
      ['validator:', 'isEmpty', 'length < 3', 'return null'],
      ['currentState?.validate()', 'return;'],
      ['Form(', 'key: formularioKey', 'validator:'],
      null
    ],
    objeto:[
      ['lib/models/vehiculo.dart'],
      ['class Vehiculo', 'final String', 'final bool', 'required this.nombre'],
      ["import 'models/vehiculo.dart'"],
      ['final vehiculo = Vehiculo(nombre: nombre)'],
      ['Vehículo creado:', 'vehiculo.nombre'],
      ['class Vehiculo', 'final String', 'final bool'],
      null
    ],
    extraccion:[
      ["main.dart", "CampoNombreVehiculo", "BotonTienda"],
      ["lib/widgets/campo_nombre_vehiculo.dart"],
      ["class CampoNombreVehiculo", "TextEditingController", "TextFormField("],
      ["validator:", "length < 3", "return null"],
      ["import 'widgets/campo_nombre_vehiculo.dart'"],
      ["CampoNombreVehiculo(", "controller:"],
      ["class BotonTienda", "VoidCallback", "onPressed:"],
      ["import 'widgets/boton_tienda.dart'"],
      ["BotonTienda(", "alPresionar:", "Vehiculo(nombre: nombre)"],
      ["class CampoNombreVehiculo", "validator:"],
      ["class BotonTienda", "VoidCallback"],
      ["CampoNombreVehiculo(", "BotonTienda("]
    ],
    navegacion:[
      ["lib/pages/ayuda_page.dart"],
      ["class AyudaPage", "Scaffold(", "AppBar("],
      ["import '../widgets/boton_tienda.dart'"],
      ["BotonTienda(", "Navigator.pop(context)"],
      ["class AcercaPage", "Scaffold(", "Navigator.pop(context)"],
      ["import 'ayuda_page.dart'"],
      ["BotonTienda(", "Navigator.push(", "MaterialPageRoute("],
      ["import 'pages/acerca_page.dart'"],
      ["Builder(", "Navigator.push(", "AcercaPage()"],
      ["Tienda", "AcercaPage", "AyudaPage"],
      ["class AyudaPage", "Navigator.pop("],
      ["class AcercaPage", "Navigator.push("],
      ["Builder(", "Navigator.push("]
    ]
  };
  const previous={p03:'p02',p04:'p03',p05:'p04',p06:'p05',p07:'p06',p08:'p07',p09:'p05',p10:'p09',p11:'p10',p12:'p11',p13main:'p12',p14main:'p13main'};

  function meaningful(s){
    const t=s.trim();
    return t!==''&&!/^[)\]};,]+$/.test(t);
  }
  function lineSelections(source,selectors){
    const lines=source.split('\n');
    const result=[];
    for(let i=0;i<lines.length;i++){
      if(selectors.some(q=>q&&lines[i].includes(q)))result.push(i);
    }
    return result;
  }
  function fallback(source){
    const lines=source.split('\n'),chosen=[];
    for(let i=0;i<lines.length;i++){
      if(!meaningful(lines[i])||lines[i].trim().startsWith('//'))continue;
      chosen.push(i);
      if(chosen.length>=Math.min(4,Math.max(1,Math.ceil(lines.length/5))))break;
    }
    return chosen.length?chosen:[0];
  }
  function diffLineIndices(before,after){
    const a=before.split('\n'),b=after.split('\n');
    const norm=t=>t.trim().replace(/\s+/g,' ');
    const left=a.map(norm),right=b.map(norm),n=a.length,m=b.length;
    const grid=Array.from({length:n+1},()=>new Uint16Array(m+1));
    for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--){
      grid[i][j]=left[i]===right[j]?1+grid[i+1][j+1]:Math.max(grid[i+1][j],grid[i][j+1]);
    }
    const additions=[];
    for(let i=0,j=0;j<m;){
      if(i<n&&left[i]===right[j]){i++;j++;}
      else if(i<n&&grid[i+1][j]>=grid[i][j+1]){i++;}
      else {
        if(meaningful(b[j])) additions.push(j);
        j++;
      }
    }
    return additions;
  }
  function getChangeLines(source,meta,opts){
    const type=meta?.kind||'ejemplo',id=opts.id,index=opts.index;
    const fromSelectors=opts.preview?focus[id]?.[index]:statics[id]?.[index];
    if(fromSelectors?.length){
      const selected=lineSelections(source,fromSelectors);
      if(selected.length)return selected;
    }
    if(type==='completo'&&meta?.reference){
      const target=guide.references[meta.reference];
      const old=guide.references[previous[meta.reference]];
      if(target&&old){
        const changed=diffLineIndices(old.text,source);
        if(changed.length)return changed;
      }
    }
    if(meta?.find){
      const result=lineSelections(source,[meta.find]);
      if(result.length)return result;
    }
    return fallback(source);
  }
  const description={
    'añadir':['NUEVO CÓDIGO','Estas son las líneas que debes agregar'],
    'reemplazar':['CÓDIGO MODIFICADO','Estas líneas se introducen al reemplazar el fragmento anterior'],
    'completo':['CAMBIOS EN EL ARCHIVO','Lo nuevo respecto a la etapa anterior, cuando hay comparación'],
    'lectura':['OBSERVA ESTAS LÍNEAS','Son partes importantes para reconocer; no se pegan otra vez'],
    'esquema':['ESQUEMA DE REFERENCIA','Se utiliza para comprender, no para pegar en Dart'],
    'comprobar':['COMPRUEBA ESTE CÓDIGO','Ya debería estar en tu archivo: no lo dupliques'],
    'terminal':['COMANDOS PARA EJECUTAR','Se escriben en la terminal y no en main.dart'],
    'ejemplo':['LÍNEAS CLAVE DEL EJEMPLO','Comprueba el contexto antes de copiar este widget']
  };
  function visualType(type){return ['lectura','esquema','comprobar'].includes(type)?'observe':type==='reemplazar'?'replace':type==='completo'?'add':type==='terminal'?'terminal':'add';}
  function appendColored(node,target,text){
    if(!text)return;
    if(node.nodeType===1){
      const clone=node.cloneNode(false);
      clone.textContent=text;
      target.appendChild(clone);
    } else target.appendChild(document.createTextNode(text));
  }
  function decorate(code,highlightIndices,category){
    const original=code.textContent;
    if(code.dataset.chApplied===original)return false;
    // Si una edicion externa reemplaza el texto, rehacemos las lineas de forma idempotente.
    const list=[[]];
    for(const node of Array.from(code.childNodes)){
      const parts=(node.textContent||'').split('\n');
      parts.forEach((part,i)=>{
        if(i>0)list.push([]);
        if(part)list[list.length-1].push({node,part});
      });
    }
    const chosen=new Set(highlightIndices);
    const frag=document.createDocumentFragment();
    for(let i=0;i<list.length;i++){
      const span=document.createElement('span');
      span.className='ch-code-line'+(chosen.has(i)?' ch-code-'+category:'');
      span.dataset.line=String(i+1);
      for(const segment of list[i])appendColored(segment.node,span,segment.part);
      if(i<list.length-1){
        const br=document.createElement('span');
        br.className='ch-invisible-newline';
        br.textContent='\n';br.setAttribute('aria-hidden','true');
        span.appendChild(br);
      }
      frag.appendChild(span);
    }
    code.replaceChildren(frag);
    code.classList.add('ch-color-lines');
    code.dataset.chApplied=original;
    return code.textContent===original;
  }
  function legend(pre,type,count,source){
    const parent=pre.parentElement;
    const current=pre.previousElementSibling?.classList?.contains('ch-code-legend')?pre.previousElementSibling:null;
    const labels=description[type]||description.ejemplo;
    const title=source==='preview'?'LÍNEAS QUE DEBES IDENTIFICAR':labels[0];
    const text=source==='preview'
      ?(type==='lectura'||type==='esquema'||type==='comprobar'
          ?'Las líneas resaltadas explican el concepto; no debes duplicarlas.'
          :type==='terminal'?'Ejecuta estas órdenes en la terminal.':
            'Las líneas resaltadas muestran qué introduces o cambias en este paso.')
      :labels[1];
    const mode=visualType(type);
    const el=current||document.createElement('div');
    el.className='ch-code-legend ch-legend-'+mode;
    el.setAttribute('role','note');
    el.innerHTML='<span class="ch-legend-symbol" aria-hidden="true"></span>'+
      '<div><strong>'+title+'</strong><p>'+text+'</p></div>'+
      '<span class="ch-legend-count">'+count+' '+(count===1?'línea':'líneas')+'</span>';
    if(!current)pre.insertAdjacentElement('beforebegin',el);
  }
  function highlight(pre,meta,opts){
    if(!pre||!meta)return;
    const code=pre.querySelector(':scope > code');
    if(!code)return;
    const source=code.textContent;
    if(pre.dataset.chDone===source)return;
    const marked=getChangeLines(source,meta,opts);
    const mode=visualType(meta.kind);
    const ok=decorate(code,marked,mode);
    if(!ok)return;
    pre.dataset.chDone=source;
    pre.dataset.changeHighlighted='yes';
    legend(pre,meta.kind,marked.length,opts.preview?'preview':'static');
  }
  function highlightStatics(){
    for(const [id,arr]of Object.entries(guide.static)){
      const lesson=document.getElementById(id);
      if(!lesson)continue;
      const blocks=[...lesson.querySelectorAll('pre.code-block')].filter(pre=>!pre.closest('.pv-shell')&&!pre.closest('.wc-detail-example'));
      let standard=0;
      for(const pre of blocks){
        if(id==='proyecto'&&pre.closest('.form-stage')){
          const n=[...lesson.querySelectorAll('.form-stage')].indexOf(pre.closest('.form-stage'));
          if(n>=0)highlight(pre,guide.preview.proyecto[n],{id,index:n,preview:true});
        }else{
          const meta=id==='proyecto'?arr[standard+9]:arr[standard];
          highlight(pre,meta,{id,index:standard,preview:false});
          standard++;
        }
      }
    }
  }
  function highlightPreviews(){
    for(const [id,items]of Object.entries(guide.preview)){
      const slot=document.getElementById('pv-'+id);
      if(!slot)continue;
      const current=slot.querySelector('.pv-step[data-pv-step][aria-pressed="true"]');
      const index=current?Number(current.dataset.pvStep):0;
      const code=slot.querySelector('.pv-code-explain pre.code-block');
      if(code)highlight(code,items[index],{id,index,preview:true});
    }
  }
  function highlightCatalog(){
    const dialog=document.getElementById('widget-detail');
    if(!dialog)return;
    dialog.querySelectorAll('.wc-detail-example pre.code-block').forEach(pre=>{
      const isComplete=Boolean(pre.closest('.wc-full-example'));
      const meta={kind:isComplete?'completo':'ejemplo',find:''};
      const code=pre.querySelector('code');
      if(!code)return;
      const value=code.textContent;
      const title=dialog.querySelector('#wc-detail-title')?.textContent?.trim()||'Widget';
      const nameLine=value.split('\n').find(l=>l.includes(title+'('));
      const contextLine=value.split('\n').find(l=>/(onPressed:|child:|builder:|controller:|decoration:|return )/.test(l));
      const focusItems=[nameLine?.trim(),contextLine?.trim()].filter(Boolean);
      const idx=0;
      // Los ejemplos del catalogo son independientes de la secuencia de las clases.
      const selections=focusItems.length?lineSelections(value,focusItems):fallback(value);
      if(pre.dataset.chDone===value)return;
      if(decorate(code,selections,'observe')){
        pre.dataset.chDone=value;
        legend(pre,'ejemplo',selections.length,'static');
      }
    });
  }
  function run(){
    highlightStatics();
    highlightPreviews();
    highlightCatalog();
  }
  document.addEventListener('flutterlab:catalog-code',run);
  if(typeof MutationObserver==='function'){
    const dialog=document.getElementById('widget-detail');
    if(dialog){
      const obs=new MutationObserver(()=>highlightCatalog());
      obs.observe(dialog,{childList:true,subtree:true});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
})();
