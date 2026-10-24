/* Explicaciones verificables, linea por linea, de los ejemplos del catalogo. */
(() => {
  'use strict';
  const dialog=document.getElementById('widget-detail');
  if(!dialog)return;
  const data=window.FlutterLabWidgetData||[];
  const keyPattern=/\b(itemBuilder|itemCount|separatorBuilder|ListTile|trailing|mainAxisSize|onPressed|onChanged|setState|Expanded|IndexedStack|ListView|GridView|validator|NavigationBar)\b/;

  function describir(raw,item){
    const line=raw.trim();
    const name=item?.name||'Widget';
    if(!line)return null;
    if(/^import\s/.test(line))return 'Importa la biblioteca que contiene los widgets y funciones usados en este archivo. En los ejemplos Material suele ser package:flutter/material.dart.';
    if(/^void main\s*\(/.test(line))return 'Es la función de entrada de Dart. Flutter la ejecuta al iniciar la aplicación.';
    if(/\brunApp\s*\(/.test(line))return 'Entrega el widget raíz a Flutter para comenzar a construir el árbol de la aplicación.';
    if(/^class\s/.test(line))return 'Declara una clase que podrá representar un widget o su estado; extends indica de qué clase base hereda.';
    if(/\bWidget build\s*\(BuildContext context\)/.test(line))return 'Describe qué interfaz construye este widget. context señala su posición en el árbol y permite acceder a servicios heredados desde sus antecesores.';
    if(/^@override/.test(line))return 'Indica que el método o propiedad redefine un miembro de una clase base.';
    if(/^(final|const|var)\s/.test(line))return 'Declara un valor. final permite asignarlo una sola vez; const necesita un valor constante en compilación; var infiere el tipo.';
    if(/^Expanded\s*\(/.test(line))return 'Asigna el espacio vertical disponible al listado cuando su padre es Column; evita darle una altura infinita a ListView.';
    if(/^ListView\.builder\s*\(/.test(line))return 'Usa el constructor que solicita las filas según se necesitan. Es útil cuando el inventario crece o se actualiza.';
    if(/^ListView\.separated\s*\(/.test(line))return 'Usa el constructor que permite insertar un separador entre filas sin añadirlo después del último elemento.';
    if(/^ListView\s*\(/.test(line))return 'Construye una lista desplazable. Con children todos los widgets se enumeran explícitamente; para muchos registros considera ListView.builder.';
    if(/^GridView\.builder\s*\(/.test(line))return 'Construye las celdas de una cuadrícula bajo demanda, igual que ListView.builder pero con columnas.';
    if(/^GridView\.count\s*\(/.test(line))return 'Construye una cuadrícula con una cantidad fija de columnas indicada por crossAxisCount.';
    if(/^itemCount\s*:/.test(line))return 'Determina cuántas filas o celdas solicitar a itemBuilder. Por ejemplo, si vehiculos.length vale 3, se pueden pedir los índices 0, 1 y 2.';
    if(/^itemBuilder\s*:/.test(line))return 'Declara la función que construye cada elemento: context identifica el lugar del árbol e indice es la posición solicitada, comenzando desde cero.';
    if(/^separatorBuilder\s*:/.test(line))return 'Construye un separador entre filas, por ejemplo Divider(height: 1). Se llama entre los elementos visibles de ListView.separated.';
    if(/^gridDelegate\s*:/.test(line))return 'Define cómo se distribuyen las celdas: número de columnas, proporciones y separación.';
    if(/^crossAxisCount\s*:/.test(line))return 'Cantidad de columnas. Si es 2, la cuadrícula coloca dos tarjetas por fila cuando hay ancho suficiente.';
    if(/^childAspectRatio\s*:/.test(line))return 'Relaciona el ancho con el alto de cada celda; un valor superior a 1 hace las celdas relativamente más anchas.';
    if(/^return\s+ListTile\s*\(/.test(line)||/^ListTile\s*\(/.test(line))return 'Crea la fila visual de un vehículo. Puede contener icono inicial, título, subtítulo y botones de acción.';
    if(/^title\s*:/.test(line))return 'Texto o widget principal de la fila o barra. En ListTile suele mostrar vehiculo.nombre.';
    if(/^subtitle\s*:/.test(line))return 'Texto secundario debajo de title; permite mostrar disponibilidad, modelo o un dato complementario.';
    if(/^leading\s*:/.test(line))return 'Widget ubicado al inicio de la fila, normalmente un Icon o CircleAvatar.';
    if(/^trailing\s*:\s*Row/.test(line))return 'Agrupa varias acciones en el extremo final del ListTile, por ejemplo editar y eliminar. Esta Row necesita mainAxisSize: MainAxisSize.min.';
    if(/^trailing\s*:/.test(line))return 'Widget al final de la fila, habitualmente un botón para eliminar o abrir detalles.';
    if(/^mainAxisSize\s*:\s*MainAxisSize\.min/.test(line))return 'Hace que Row ocupe solo el ancho que necesitan los botones, sin invadir el espacio del título.';
    if(/^children\s*:\s*(const\s*)?\[/.test(line))return 'Inicia una lista ordenada de widgets hijos. En Column se ubican verticalmente; en Row horizontalmente.';
    if(/^onPressed\s*:/.test(line))return 'Asocia una función que se ejecuta al pulsar el botón. Se pasa la referencia sin ejecutarla de inmediato.';
    if(/^onChanged\s*:/.test(line))return 'Recibe el valor nuevo al cambiar el campo o selector. Si afecta la pantalla, hay que actualizar el estado apropiado.';
    if(/^onSubmitted\s*:/.test(line))return 'Ejecuta la acción cuando el usuario confirma el texto desde el teclado, por ejemplo al pulsar Enter.';
    if(/^setState\s*\(/.test(line))return 'Notifica a Flutter que cambió el estado local y debe reconstruir los widgets que lo consultan.';
    if(/^validator\s*:/.test(line))return 'Define una regla para comprobar un campo del Form. Devuelve un mensaje cuando no es válido y null cuando pasa la validación.';
    if(/^padding\s*:/.test(line))return 'Crea espacio interior alrededor del contenido; evita que los widgets queden pegados a los bordes.';
    if(/^controller\s*:/.test(line))return 'Asocia un controlador existente para leer, cambiar o gestionar el dato del campo o desplazamiento.';
    if(/^selectedIndex\s*:/.test(line))return 'Es el índice de la pestaña seleccionada en NavigationBar. Debe coincidir con el index del IndexedStack.';
    if(/^onDestinationSelected\s*:/.test(line))return 'Recibe el índice de la pestaña que eligió el usuario y permite actualizar el estado visual.';
    if(/^index\s*:/.test(line))return 'Selecciona el hijo que se muestra en un IndexedStack. En Flutter la primera posición tiene índice cero.';
    if(/^shrinkWrap\s*:/.test(line))return 'Hace que una lista adapte su tamaño a su contenido cuando el padre lo exige. Puede resultar más costoso para listas extensas.';
    if(/^physics\s*:/.test(line))return 'Configura cómo responde el desplazamiento a los gestos. Puede evitar scroll anidado cuando el padre ya se desplaza.';
    if(/^child\s*:/.test(line))return 'Asigna el widget hijo dentro de este componente. La posición depende del constructor exterior.';
    if(/^\}\s*,?\s*$/.test(line))return 'Cierra el bloque de instrucciones iniciado con una llave {, como un método o la función itemBuilder.';
    if(/^\],?\s*$/.test(line))return 'Cierra la lista de widgets que se abrió con [ en children o destinations.';
    if(/^\),?\s*$/.test(line))return 'Cierra el constructor o llamada anterior. La coma permite continuar enumerando los widgets o argumentos del padre.';
    const argument=line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.+)$/);
    if(argument){
      const prop=item?.properties?.find(p=>p[0]===argument[1]);
      if(prop)return prop[2]+'. Ejemplo: se establece mediante '+argument[1]+': en el constructor de '+name+'.';
      if(argument[1]==='label')return 'Texto visible que identifica el control o pestaña; debe ser corto y significativo.';
      if(argument[1]==='key')return 'Identifica un elemento de forma estable para que Flutter no confunda registros al moverlos o eliminarlos.';
      return 'Configura '+argument[1]+' del widget. El valor tras los dos puntos corresponde a esta propiedad; consulta su tipo en la tabla superior.';
    }
    if(/^\]\s*\),?/.test(line))return 'Cierra primero la lista de elementos y después el constructor padre.';
    if(/^\(/.test(line))return 'Continúa la llamada iniciada antes; revisa cómo se cierra para entender a qué widget pertenece.';
    if(/^\/\//.test(line))return 'Comentario que explica el propósito del fragmento. No se ejecuta en Dart.';
    if(/^\s*\w+\s*\(/.test(line))return 'Crea el widget o ejecuta el método escrito antes de (. Sus argumentos determinan su comportamiento.';
    return 'Continúa el fragmento de código. Comprueba el constructor padre y qué valores recibe antes de copiarlo.';
  }

  function render(){
    const code=dialog.querySelector('#wc-example-code');
    const sample=code?.textContent||'';
    const example=dialog.querySelector('.wc-detail-example');
    const name=dialog.querySelector('#wc-detail-title')?.textContent?.trim();
    if(!code||!example||!name)return;
    let panel=example.querySelector('#wc-code-line-notes');
    if(!panel){
      panel=document.createElement('details');
      panel.id='wc-code-line-notes';
      panel.className='wc-line-explainer';
      panel.open=['ListView','ListTile','GridView'].includes(name);
      const summary=document.createElement('summary');
      summary.textContent='Explicación línea por línea del código';
      const p=document.createElement('p');
      p.className='wc-line-intro';
      p.textContent='Lee cada instrucción en el orden en que se escribe. Las líneas importantes para cambiar el comportamiento aparecen resaltadas.';
      const scroll=document.createElement('div');
      scroll.className='wc-line-scroll';
      const table=document.createElement('table');
      table.className='wc-line-table';
      const thead=document.createElement('thead');
      const tr=document.createElement('tr');
      ['Línea','Instrucción','Qué significa y por qué se usa'].forEach(text=>{
        const th=document.createElement('th');
        th.textContent=text;tr.append(th);
      });
      thead.append(tr);table.append(thead);
      const body=document.createElement('tbody');table.append(body);
      scroll.append(table);panel.append(summary,p,scroll);example.append(panel);
    }
    const key=name+'\n'+sample;
    if(panel.dataset.previewHash===key)return;
    panel.dataset.previewHash=key;
    const tbody=panel.querySelector('tbody');
    const item=data.find(widget=>widget.name===name);
    const fragment=document.createDocumentFragment();
    const lines=sample.split('\n');
    let total=0;
    for(let i=0;i<lines.length;i++){
      if(!lines[i].trim())continue;
      const row=document.createElement('tr');
      if(keyPattern.test(lines[i]))row.classList.add('wc-line-important');
      const number=document.createElement('td');
      number.textContent=String(i+1);
      number.className='wc-line-number';
      const raw=document.createElement('td');
      const piece=document.createElement('code');
      piece.textContent=lines[i].trim();
      raw.append(piece);
      const description=document.createElement('td');
      description.textContent=describir(lines[i],item)||'';
      row.append(number,raw,description);
      fragment.append(row);total++;
    }
    tbody.replaceChildren(fragment);
    panel.querySelector('summary').textContent='Explicación línea por línea · '+total+' instrucciones';
  }

  const observer=new MutationObserver(render);
  observer.observe(dialog,{subtree:true,childList:true});
  dialog.addEventListener('flutterlab:catalog-code',render);
  dialog.addEventListener('click',event=>{
    if(event.target.closest('[data-example-variant]'))queueMicrotask(render);
  });
  render();
})();
