(() => { 'use strict';
const glossary={"trim":"Quita espacios en blanco al principio y al final del texto; no borra los espacios entre palabras.","parse":"Convierte texto al tipo indicado y lanza FormatException si no se puede convertir.","tryParse":"Intenta convertir texto a número; devuelve null cuando falla.","setState":"Le avisa a Flutter que los datos de esta pantalla cambiaron y debe reconstruir su interfaz.","ListView":"Widget que dibuja una lista desplazable de elementos.","itemBuilder":"Función que Flutter ejecuta para construir cada elemento de una lista.","itemCount":"Cantidad de elementos que ListView.builder puede solicitar.","removeAt":"Elimina el elemento de una lista según su posición (índice).","add":"Agrega un elemento al final de una lista.","onPressed":"Función que se llama cuando el usuario presiona el botón.","required":"Indica que un argumento con nombre debe ser proporcionado.","const":"Permite construir valores constantes cuando los argumentos lo permiten.","final":"La variable solo puede asignarse una vez, aunque el objeto referenciado pueda cambiar.","Expanded":"Ocupa el espacio disponible en una Row o Column.","TextEditingController":"Permite leer, establecer y limpiar el texto de un campo.","dispose":"Libera recursos cuando el State deja de utilizarse.","null":"Representa ausencia de valor.","return":"Termina una función y, cuando corresponde, devuelve un resultado.","void":"Indica que una función no devuelve un valor.","String":"Tipo de datos de texto.","bool":"Tipo verdadero o falso.","int":"Tipo de número entero.","double":"Tipo de número decimal.","tooltip":"Texto breve que explica qué hace un botón o una propiedad.","build":"Método que devuelve el árbol de widgets que se debe mostrar.","validator":"Función que comprueba si un campo es válido y devuelve un mensaje de error o null.","Bloc":"Componente encargado de procesar eventos y publicar estados, separado de la interfaz.","BlocProvider":"Widget que crea y ofrece el BLoC a los widgets descendientes; también cierra el BLoC que creó.","BlocBuilder":"Widget que reconstruye una parte de la pantalla cuando el BLoC emite un estado nuevo.","VehiculosBloc":"Encargado de administrar el inventario de vehículos del ejemplo.","VehiculosEstado":"Fotografía de la información que la pantalla debe representar.","VehiculosEvento":"Tipo base de las órdenes que puede recibir el BLoC.","VehiculoGuardado":"Evento que pide crear o actualizar un vehículo según el índice de edición.","EdicionIniciada":"Evento que selecciona un vehículo para editar.","EdicionCancelada":"Evento que sale del modo edición.","VehiculoEliminado":"Evento que solicita borrar un vehículo.","BusquedaCambiada":"Evento que comunica el texto escrito en el buscador.","Emitter":"Objeto que BLoC entrega al manejador y que permite publicar nuevos estados.","emit":"Publica un estado nuevo desde el manejador de un evento.","on":"Registra qué función debe responder a un tipo de evento.","state":"Propiedad que contiene el estado actual administrado por BLoC.","context.read":"Obtiene un BLoC desde el árbol de widgets sin reconstruir por sí mismo el widget.","onChanged":"Función que se ejecuta cuando cambia el valor escrito en un campo.","indexOf":"Devuelve la posición de un objeto en la lista, o -1 si no está.","where":"Filtra elementos de una colección según una condición.","contains":"Comprueba si un texto o colección contiene el valor buscado.","toLowerCase":"Convierte las letras a minúsculas para comparar nombres sin distinguir mayúsculas.","unmodifiable":"Construye una lista que no se puede modificar a través de esa referencia."};
const entries=Object.entries(glossary).sort((a,b)=>b[0].length-a[0].length);
const pattern=new RegExp('\\b(?:'+entries.map(e=>e[0]).join('|')+')\\b','g');
function decorate(root=document){
 const regions=root.querySelectorAll('#crud pre.code-block code, #crud p code, #crud .next-where code, #objeto pre.code-block code, #bloc-crud pre.code-block code, #bloc-crud p code, #bloc-crud .next-where code');
 for(const code of regions){
   if(code.dataset.conceptReady==='yes')continue;
   const walker=document.createTreeWalker(code,NodeFilter.SHOW_TEXT);
   const texts=[];while(walker.nextNode())texts.push(walker.currentNode);
   for(const node of texts){
    if(node.parentElement?.closest('.code-tooltip-term'))continue;
    const source=node.nodeValue;pattern.lastIndex=0;let match,pos=0,fragment=null;
    while((match=pattern.exec(source))){
      const definition=glossary[match[0]];if(!definition)continue;
      if(!fragment)fragment=document.createDocumentFragment();
      fragment.append(source.slice(pos,match.index));
      const span=document.createElement('span');span.className='code-tooltip-term';
      span.tabIndex=0;span.setAttribute('data-explain',definition);span.setAttribute('aria-label',match[0]+': '+definition);span.textContent=match[0];fragment.append(span);
      pos=match.index+match[0].length;
    }
    if(fragment){fragment.append(source.slice(pos));node.replaceWith(fragment);}
   }
   code.dataset.conceptReady='yes';
 }
}
function instalarTooltips() {
  const panel = document.createElement('div');
  panel.id = 'flutter-codigo-tooltip';
  panel.className = 'flutter-codigo-tooltip';
  panel.setAttribute('role', 'tooltip');
  panel.hidden = true;
  document.body.append(panel);
  let activo = null;
  function ubicar() {
    if (!activo || panel.hidden) return;
    const box = activo.getBoundingClientRect();
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;
    const left = Math.max(8, Math.min(box.left, window.innerWidth - width - 8));
    let top = box.top - height - 9;
    if (top < 8) top = box.bottom + 9;
    panel.style.left = left + 'px';
    panel.style.top = Math.min(top, window.innerHeight - height - 8) + 'px';
  }
  function abrir(term) {
    if (activo === term) { ubicar(); return; }
    cerrar();
    activo = term;
    panel.textContent = term.dataset.explain || '';
    term.setAttribute('aria-describedby', panel.id);
    panel.hidden = false;
    ubicar();
  }
  function cerrar() {
    if (activo) activo.removeAttribute('aria-describedby');
    activo = null;
    panel.hidden = true;
  }
  document.addEventListener('pointerover', e => {
    const term = e.target.closest?.('.code-tooltip-term');
    if (term) abrir(term);
  });
  document.addEventListener('pointerout', e => {
    if (activo && (e.target === activo || activo.contains(e.target))) cerrar();
  });
  document.addEventListener('focusin', e => {
    const term = e.target.closest?.('.code-tooltip-term');
    if (term) abrir(term);
  });
  document.addEventListener('focusout', e => {
    if (activo && (e.target === activo || activo.contains(e.target))) cerrar();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrar();
  });
  window.addEventListener('scroll', ubicar, {passive:true,capture:true});
  window.addEventListener('resize', ubicar);
}
function iniciar() { decorate(); instalarTooltips(); }
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar,{once:true});else iniciar();
})();