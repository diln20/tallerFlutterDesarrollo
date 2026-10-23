(() => { 'use strict';
const glossary={"trim":"Quita espacios en blanco al principio y al final del texto; no borra los espacios entre palabras.","parse":"Convierte texto al tipo indicado y lanza FormatException si no se puede convertir.","tryParse":"Intenta convertir texto a número; devuelve null cuando falla.","setState":"Le avisa a Flutter que los datos de esta pantalla cambiaron y debe reconstruir su interfaz.","ListView":"Widget que dibuja una lista desplazable de elementos.","itemBuilder":"Función que Flutter ejecuta para construir cada elemento de una lista.","itemCount":"Cantidad de elementos que ListView.builder puede solicitar.","removeAt":"Elimina el elemento de una lista según su posición (índice).","add":"Agrega un elemento al final de una lista.","onPressed":"Función que se llama cuando el usuario presiona el botón.","required":"Indica que un argumento con nombre debe ser proporcionado.","const":"Permite construir valores constantes cuando los argumentos lo permiten.","final":"La variable solo puede asignarse una vez, aunque el objeto referenciado pueda cambiar.","Expanded":"Ocupa el espacio disponible en una Row o Column.","TextEditingController":"Permite leer, establecer y limpiar el texto de un campo.","dispose":"Libera recursos cuando el State deja de utilizarse.","null":"Representa ausencia de valor.","return":"Termina una función y, cuando corresponde, devuelve un resultado.","void":"Indica que una función no devuelve un valor.","String":"Tipo de datos de texto.","bool":"Tipo verdadero o falso.","int":"Tipo de número entero.","double":"Tipo de número decimal.","tooltip":"Texto breve que explica qué hace un botón o una propiedad.","build":"Método que devuelve el árbol de widgets que se debe mostrar.","validator":"Función que comprueba si un campo es válido y devuelve un mensaje de error o null."};
const entries=Object.entries(glossary).sort((a,b)=>b[0].length-a[0].length);
const pattern=new RegExp('\\b(?:'+entries.map(e=>e[0]).join('|')+')\\b','g');
function decorate(root=document){
 const regions=root.querySelectorAll('#crud pre.code-block code, #crud p code, #crud .next-where code, #objeto pre.code-block code');
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
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>decorate(),{once:true});else decorate();
})();