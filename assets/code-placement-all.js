/* Ubicaciones de TODOS los ejemplos: lecciones, vistas y catalogo de widgets. */
(() => {
  'use strict';
  const data=window.FlutterCodePlacementData;
  if(!data)return;
  const readOnly=new Set(['lectura','esquema','comprobar']);
  const typeNames={
    terminal:'EJECUTAR EN TERMINAL',lectura:'SOLO LECTURA',esquema:'ESQUEMA · NO PEGAR',
    comprobar:'COMPROBAR · NO DUPLICAR',completo:'ARCHIVO COMPLETO',
    reemplazar:'REEMPLAZAR',añadir:'AÑADIR',ejemplo:'EJEMPLO EN CONTEXTO'
  };
  const escape=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const repo='https://github.com/diln20/tallerFlutterDesarrollo/blob/main/';
  const fileLabel=(meta)=>meta.kind==='terminal'?'Terminal / PowerShell':
    meta.kind==='esquema'&&!meta.reference?'Pizarra / lectura':
    'lib/main.dart (en la copia del estudiante)';
  const colorKind=(kind)=>readOnly.has(kind)?'reference':kind==='terminal'?'terminal':kind==='completo'?'complete':'action';
  function chooseFocus(reference,meta,codeText){
    if(!reference)return null;
    const lines=reference.text.split('\n');
    const clean=(s)=>String(s).trim().replace(/\s+/g,' ');
    const codeLines=String(codeText).split('\n').map(clean).filter(Boolean);
    // Resaltar todo el bloque si se encuentra identico en el archivo de referencia.
    if(codeLines.length&&codeLines.length<=55){
      for(let n=0;n<=lines.length-codeLines.length;n++){
        if(codeLines.every((s,i)=>clean(lines[n+i])===s)){
          return {start:n+1,end:n+codeLines.length,exact:true};
        }
      }
    }
    const find=meta.find||'';
    let idx=lines.findIndex(x=>x.includes(find));
    if(idx<0&&codeLines.length){
      idx=lines.findIndex(x=>codeLines.some(c=>c.length>12&&clean(x).includes(c)));
    }
    if(idx<0)return null;
    return {start:idx+1,end:idx+1,exact:false};
  }
  function contextText(reference,focus){
    if(!reference||!focus)return '';
    const lines=reference.text.split('\n');
    const first=Math.max(1,focus.start-5),last=Math.min(lines.length,focus.end+5);
    const items=[];
    for(let line=first;line<=last;line++){
      const emph=line>=focus.start&&line<=focus.end;
      items.push('<div class="cpl-context-line'+(emph?' cpl-context-highlight':'')+'">'+
        '<span class="cpl-number" aria-hidden="true">'+line+'</span>'+
        '<code>'+escape(lines[line-1]||' ')+'</code></div>');
    }
    return items.join('');
  }
  function placementPanel(meta,codeText,origin){
    const reference=meta.reference?data.references[meta.reference]:null;
    const focus=chooseFocus(reference,meta,codeText);
    const file=fileLabel(meta);
    const sourceUrl=reference?(repo+reference.path+(focus?'#L'+focus.start+(focus.end>focus.start?'-L'+focus.end:''):'')):null;
    const type=typeNames[meta.kind]||'UBICACIÓN DEL FRAGMENTO';
    const panel=document.createElement('section');
    panel.className='cpl-panel cpl-'+colorKind(meta.kind)+' cpl-origin-'+origin;
    panel.setAttribute('aria-label','Indicaciones para ubicar este fragmento');
    panel.innerHTML='<div class="cpl-top"><span class="cpl-type">'+escape(type)+'</span>'+
      '<span class="cpl-file">'+escape(file)+'</span></div>'+
      '<h4>¿Dónde va este fragmento?</h4>'+
      '<dl class="cpl-location">'+
       '<div><dt>Dentro de</dt><dd>'+escape(meta.scope||'Archivo correspondiente')+'</dd></div>'+
       '<div><dt>Busca con Ctrl + F</dt><dd><code>'+escape(meta.find||'En este paso no requiere busqueda')+'</code></dd></div>'+
       '<div><dt>Qué hacer</dt><dd>'+escape(meta.action||'Lee la explicación antes de modificar el código')+'</dd></div>'+
      '</dl>'+
      (meta.note?'<p class="cpl-note">'+escape(meta.note)+'</p>':'')+
      (readOnly.has(meta.kind)?'<p class="cpl-do-not-paste">Esquema o referencia: no lo copies como si fuera un programa completo.</p>':
       meta.kind==='completo'?'<p class="cpl-copynote">Si lo usas, sustituye únicamente el archivo completo de una copia de práctica; no lo insertes dentro de otra clase.</p>':
       meta.kind==='terminal'?'<p class="cpl-copynote">Estas órdenes se ejecutan en la terminal, nunca en el editor de Dart.</p>':
       '<p class="cpl-copynote">Copia solo el bloque superior y colócalo donde se indica. No dupliques el código existente.</p>')+
      (reference?'<details class="cpl-reference"><summary>Ver ubicación en el código de referencia'+(focus?' · línea '+focus.start:'')+'</summary>'+
       (focus?'<div class="cpl-context" role="group" aria-label="Código de referencia con números de línea">'+contextText(reference,focus)+'</div>':
       '<p>No hay una coincidencia literal para este ejemplo de enseñanza; utiliza el texto ancla de arriba para localizar el bloque correcto.</p>')+
       '<a href="'+escape(sourceUrl)+'" target="_blank" rel="noopener noreferrer">Abrir '+escape(reference.path)+' en GitHub ↗</a>'+
      '</details>':'');
    return panel;
  }
  function annotate(pre,meta,origin){
    if(!pre||!meta||pre.dataset.codePlaced==='yes')return false;
    const code=pre.querySelector('code');
    if(!code)return false;
    pre.dataset.codePlaced='yes';
    pre.dataset.codeMode=meta.kind;
    if(readOnly.has(meta.kind)){
      pre.dataset.codeReadonly='true';
      pre.querySelectorAll('button.copy-button').forEach(button=>button.remove());
    }
    const panel=placementPanel(meta,code.textContent,origin);
    pre.insertAdjacentElement('afterend',panel);
    return true;
  }
  function statics(){
    Object.entries(data.static).forEach(([id,meta])=>{
      const lesson=document.getElementById(id);
      if(!lesson)return;
      const blocks=[...lesson.querySelectorAll('pre.code-block')].filter(pre=>
        !pre.closest('.pv-shell')&&!pre.closest('.form-stage')&&!pre.closest('.wc-detail-example'));
      const wanted=meta.filter(Boolean);
      // Proyecto contiene nueve bloques de pasos atendidos por form-placement-guide.js.
      if(id==='proyecto'){
        const extras=blocks.filter(pre=>!pre.closest('.form-stage'));
        extras.forEach((pre,i)=>annotate(pre,meta[i+9],'lesson'));
      }else blocks.forEach((pre,i)=>annotate(pre,meta[i],'lesson'));
      if(id!=='proyecto'&&blocks.length!==meta.length){
        console.warn('FlutterLab: recuento de fragmentos',id,blocks.length,meta.length);
      }
    });
  }
  function previews(){
    for(const [id,items]of Object.entries(data.preview)){
      if(id==='proyecto')continue; // Ya tiene una guía más extensa con código incremental.
      const host=document.getElementById('pv-'+id);
      if(!host)continue; // Otros modulos pueden no estar montados todavia.
      const preview=host.querySelector('.pv-shell');
      if(!preview)continue;
      const chosen=preview.querySelector('.pv-step[data-pv-step][aria-pressed="true"]');
      const step=chosen?Number(chosen.dataset.pvStep):0;
      const pre=preview.querySelector('.pv-code-explain pre.code-block');
      annotate(pre,items[step]||items[0],'preview');
    }
  }
  const dialog=document.getElementById('widget-detail');
  function widgetPlacement(name){
    const parent='MainApp.build → Scaffold.body → Column.children';
    const common='Este es un ejemplo del catálogo, NO un paso obligatorio de actividad2a. Pruébalo en una copia independiente y revisa si necesita un controller, un State o datos previos.';
    const direct=new Map([
      ['MaterialApp',['MainApp.build → return MaterialApp(...)','return MaterialApp(','Se ubica normalmente como widget raíz devuelto por build; no lo insertes dentro de otra Column.']],
      ['Scaffold',['MaterialApp.home → Scaffold','home: Scaffold(','Es la estructura principal; reemplaza o modifica el Scaffold existente, no agregues otro por accidente.']],
      ['AppBar',['MainApp.build → Scaffold.appBar','appBar: AppBar(','Reemplaza la propiedad appBar del Scaffold existente, no la pegues dentro de body.']],
      ['AboutDialog',['Dentro de una acción onPressed → showDialog → builder','onPressed:','AboutDialog se crea en builder de showDialog; no es un hijo fijo de Column.']],
      ['AlertDialog',['Dentro de showDialog → builder','onPressed:','Para mostrarlo hace falta invocar showDialog(context: context, builder: ...).']],
      ['SimpleDialog',['Dentro de showDialog → builder','onPressed:','Se crea dentro de builder de showDialog; no lo agregues directamente a Column.children.']],
      ['SnackBar',['ScaffoldMessenger.of(context).showSnackBar(...)','onPressed:','Construye el SnackBar dentro de una acción y muéstralo con ScaffoldMessenger.']],
      ['BottomSheet',['Acción de apertura con showModalBottomSheet','onPressed:','Para abrir una hoja modal utiliza showModalBottomSheet con un contexto válido.']],
      ['Drawer',['MainApp.build → Scaffold.drawer','home: Scaffold(','Se ubica en la propiedad drawer del Scaffold.']],
      ['FloatingActionButton',['MainApp.build → Scaffold.floatingActionButton','home: Scaffold(','Se ubica en la propiedad floatingActionButton, no dentro de AppBar.']],
      ['BottomNavigationBar',['MainApp.build → Scaffold.bottomNavigationBar','home: Scaffold(','Se ubica como barra inferior del Scaffold.']],
      ['NavigationBar',['MainApp.build → Scaffold.bottomNavigationBar','home: Scaffold(','Se ubica normalmente en bottomNavigationBar del Scaffold.']],
      ['Expanded',['Dentro de Row.children o Column.children','children: [','Expanded debe ser hijo directo de un widget Flex como Row o Column.']],
      ['Flexible',['Dentro de Row.children o Column.children','children: [','Flexible debe estar dentro de Row o Column; no como hijo directo de Scaffold.']],
      ['Spacer',['Dentro de Row.children o Column.children','children: [','Spacer funciona dentro de Row o Column para ocupar espacio libre.']],
      ['TextField',[parent,"children: [","Si utilizas un controlador, decláralo en State fuera de build y libéralo con dispose()."]],
      ['TextFormField',['Dentro de Form → Column.children','Form(','Requiere comprender Form, la validación y dónde vive el controlador; es un tema posterior a la práctica básica.']],
      ['Form',['MainApp.build → dentro del body, envolviendo sus campos','body:','Form agrupa campos para gestionar su validación; no forma parte aún del primer formulario simple.']],
      ['Row',['Dentro de Column.children u otro child compatible','children: [','Agrega una Row como hijo del contenedor donde necesites varios elementos horizontales.']],
      ['Column',['Dentro de Center.child, Padding.child o Scaffold.body','child:','Agrega una Column solo cuando quieras un grupo vertical; no dupliques sin necesidad la Column actual.']],
      ['IconButton',['AppBar.actions o Row.children','appBar:','IconButton es un widget interactivo; necesitas explicar onPressed para que realice acciones.']]
    ]);
    const special=direct.get(name);
    if(special)return mWidget(special[0],special[1],special[2]);
    if(name.startsWith('Cupertino'))return mWidget('En una pantalla con CupertinoApp o un contenedor compatible','Widget build(BuildContext context)','Los widgets Cupertino tienen estilo iOS; antes de usarlos, estudia el contexto y la importación correspondiente.');
    if(/Dialog$/.test(name))return mWidget('Dentro del builder de showDialog','onPressed:','El diálogo necesita la acción que lo abra y un BuildContext válido.');
    if(/ListView|GridView|PageView|CustomScrollView/.test(name))return mWidget('Scaffold.body o un contenedor con altura delimitada','body:','Si lo insertas dentro de Column necesitarás comprobar las restricciones de altura, Expanded o un diseño equivalente.');
    return mWidget(parent,'children: [',common);
  }
  function mWidget(scope,find,action){return {kind:'ejemplo',scope,find,action,note:'CATÁLOGO INDEPENDIENTE: ubica la propiedad y prepara las dependencias antes de copiar; algunos ejemplos no son aplicaciones completas.'};}
  function catalog(){
    if(!dialog||!dialog.querySelector('#wc-detail-title'))return;
    const name=dialog.querySelector('#wc-detail-title').textContent.trim();
    const widgetExample=dialog.querySelector('pre.code-block:has(#wc-example-code)');
    if(widgetExample)annotate(widgetExample,widgetPlacement(name),'catalog');
    dialog.querySelectorAll('.wc-full-example pre.code-block').forEach(pre=>
      annotate(pre,{kind:'completo',scope:'lib/main.dart de una copia de prueba → contenido completo del archivo',
        find:"import 'package:flutter/material.dart';",
        action:'Esta es una aplicación completa de ejemplo del catálogo. Si la ejecutas, reemplaza temporalmente todo el main.dart de una copia de práctica; no insertes estas clases dentro de otra clase ya existente.',
        note:'Una vez probada, vuelve a tu Tienda original o al paso que estabas siguiendo.'},'catalog'));
  }
  function update(){
    statics();previews();catalog();
  }
  document.addEventListener('flutterlab:catalog-code',()=>{previews();catalog();});
  if(dialog&&typeof MutationObserver==='function'){
    const observer=new MutationObserver(()=>catalog());
    observer.observe(dialog,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update,{once:true});
  else update();
})();