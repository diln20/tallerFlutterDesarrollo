/* FlutterLab: explicación pedagógica, instrucción por instrucción, de todos los fragmentos. */
(() => {
  'use strict';
  const root=window.FlutterLabLineGuide={};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function nameOf(t,kind){
    if(kind==='['){
      if(/children:\s*$/.test(t))return 'la lista children de widgets';
      if(/actions:\s*$/.test(t))return 'la lista actions de AppBar';
      if(/vehiculos\s*=\s*$/.test(t))return 'la lista de vehículos';
      return 'una lista de elementos';
    }
    if(kind==='{'){
      if(/class\s+MainApp\b/.test(t))return 'la clase MainApp';
      if(/class\s+_MainAppState\b/.test(t))return 'la clase _MainAppState';
      if(/void\s+main\s*\(/.test(t))return 'la función main';
      if(/Widget\s+build\s*\(/.test(t))return 'el método build';
      if(/void\s+dispose\s*\(/.test(t))return 'el método dispose';
      if(/onChanged\s*:/.test(t))return 'la función onChanged';
      if(/onPressed\s*:/.test(t))return 'la función onPressed';
      if(/setState\s*\(/.test(t))return 'la función entregada a setState';
      if(/where\s*\(/.test(t))return 'la función que evalúa cada vehículo';
      if(/\bif\s*\(/.test(t))return 'el bloque condicional if';
      return 'el bloque de instrucciones';
    }
    const found=t.match(/([A-Za-z_][\w.]*)\s*$/);
    return found?found[1]:'la llamada o constructor';
  }
  function updateStack(line,stack){
    let quote='',escapeNext=false;
    const chars=line;
    for(let i=0;i<chars.length;i++){
      const c=chars[i];
      if(quote){if(escapeNext){escapeNext=false;continue;}if(c==='\\'){escapeNext=true;continue;}if(c===quote)quote='';continue;}
      if(c==='/'&&chars[i+1]==='/')break;
      if(c==="'"||c==='"'){quote=c;continue;}
      if(c==='('||c==='['||c==='{')stack.push({char:c,label:nameOf(chars.slice(0,i),c)});
      if(c===')'||c===']'||c==='}'){
        const need=c===')'?'(':c===']'?'[':'{';
        let k=stack.length-1;while(k>=0&&stack[k].char!==need)k--;
        if(k>=0)stack.splice(k,1);
      }
    }
  }
  function closeExplanation(t,stack){
    const found=[],tmp=stack.slice();
    for(const c of t){
      if(!')]}'.includes(c))continue;
      const need=c===')'?'(':c===']'?'[':'{';
      let i=tmp.length-1;while(i>=0&&tmp[i].char!==need)i--;
      if(i>=0)found.push({c,label:tmp[i].label}),tmp.splice(i,1);
      else found.push({c,label:null});
    }
    if(!found.length)return null;
    const out=found.map(({c,label})=>
      c===')'?'Cierra los paréntesis de '+(label||'una llamada o constructor'):
      c===']'?'Cierra '+(label||'la lista de widgets o valores'):
      'Cierra '+(label||'el bloque abierto anteriormente'));
    const punctuation=t.endsWith(';')?' El punto y coma termina la instrucción.':
      t.endsWith(',')?' La coma separa este elemento del siguiente.':'';
    return out.join('. ')+'.'+punctuation;
  }
  function explanation(t,stack,index,lines){
    const q=t.trim();
    if(!q)return 'Línea en blanco: separa visualmente las partes del archivo; Dart no ejecuta ninguna instrucción aquí.';
    if(/^(\s*\/\/|\/\/)/.test(q))return 'Comentario que ayuda a leer el ejemplo; Dart lo ignora y no ejecuta ese texto.';
    if(/^(├|└|│|→|Interfaz\s*→|actividad2a\/|pubspec\.yaml|lib\/|main\.dart|\d+\s*→)/.test(q))
      return 'Esquema o representación didáctica para ubicar elementos o seguir un proceso. No se pega en el archivo Dart.';
    if(/^\s*[)\]};,]+\s*$/.test(q))return closeExplanation(q,stack)||'Cierra una estructura que se abrió antes; comprueba el paréntesis, corchete o llave correspondiente.';
    if(/^\}\)\.toList\(\);/.test(q))return 'Cierra la función de filtrado y convierte las coincidencias obtenidas con where en una lista mediante toList().';
    if(/^\bflutter\s+doctor/.test(q))return 'Comprueba el SDK de Flutter, sus herramientas y los requisitos de las plataformas desde la terminal.';
    if(/^\bflutter\s+devices/.test(q))return 'Muestra los destinos disponibles donde se puede ejecutar la aplicación, por ejemplo un emulador, un teléfono o Chrome.';
    if(/^\bflutter\s+pub\s+get/.test(q))return 'Descarga o resuelve las dependencias declaradas en pubspec.yaml; se ejecuta en la raíz del proyecto.';
    if(/^\bflutter\s+run/.test(q))return 'Compila y ejecuta la app en un dispositivo disponible; no se escribe dentro de main.dart.';
    if(/^\bcd\s+/.test(q))return 'Cambia la carpeta actual de la terminal. Las comillas permiten usar una ruta con espacios.';
    if(/^Get-Location/.test(q))return 'Muestra la ruta actual de PowerShell para comprobar que estás en el proyecto correcto.';
    if(/^Get-ChildItem/.test(q))return 'Lista los archivos y carpetas de la ubicación actual en PowerShell.';
    if(/^Test-Path/.test(q))return 'Comprueba si existe el archivo indicado; devuelve True o False.';
    if(/^import\s+/.test(q))return 'Importa una biblioteca. material.dart contiene MaterialApp, Text, Scaffold y los demás widgets Material que utilizamos.';
    if(/^void\s+main\s*\(/.test(q))return 'Declara la función inicial del programa. void indica que no devuelve un valor; la llave abre sus instrucciones.';
    if(/\brunApp\s*\(/.test(q))return 'Entrega a Flutter el widget raíz MainApp para comenzar a construir la interfaz. const es válido si el constructor y sus argumentos son constantes.';
    if(/^class\s+[A-Za-z_]\w*\s+extends\s+\w+/.test(q))return 'Declara una nueva clase Dart que hereda del tipo indicado con extends. Es un ejemplo de cómo definir un widget o componente propio.';
    if(/^class\s+MainApp\s+extends\s+StatelessWidget/.test(q))return 'Declara nuestro widget MainApp y hereda de StatelessWidget. Esta versión no tiene un objeto State mutable propio.';
    if(/^class\s+MainApp\s+extends\s+StatefulWidget/.test(q))return 'Declara MainApp como StatefulWidget: un widget que tendrá un objeto State asociado para administrar datos o recursos.';
    if(/^class\s+_MainAppState/.test(q))return 'Declara la clase State que pertenece a MainApp. El guion bajo hace privado este nombre dentro de su biblioteca Dart.';
    if(/^const\s+MainApp\s*\(/.test(q))return 'Constructor de MainApp. const permite instancias constantes y super.key reenvía al padre una clave opcional de identidad.';
    if(/^@override/.test(q))return 'Anotación que indica que vamos a implementar o sobrescribir un método definido por el tipo padre.';
    if(/\bState<MainApp>\s+createState\s*\(/.test(q))return 'Crea y devuelve _MainAppState. Los signos < > indican el tipo de widget asociado al State; => es una forma corta de return.';
    if(/^Widget\s+build\s*\(/.test(q))return 'Método que describe los widgets que se muestran. Devuelve un Widget y recibe context, que ubica esta parte en el árbol.';
    if(/^void\s+dispose\s*\(/.test(q))return 'Declara la limpieza que Flutter llamará cuando este objeto State se retire definitivamente; no se ejecuta al pulsar el botón.';
    if(/^\s*super\.dispose\s*\(/.test(q))return 'Ejecuta la limpieza heredada de State. Se coloca al final de nuestro método dispose().';
    if(/Controller\.dispose\s*\(/.test(q))return 'Libera el TextEditingController cuando termina el State, evitando conservar recursos que ya no se necesitan.';
    if(/Controller\.clear\s*\(/.test(q))return 'Vacía el TextField conectado al controlador. Se ejecuta después de leer o utilizar el texto escrito.';
    if(/^final\s+TextEditingController\b/.test(q))return 'Declara una única variable final que contiene el controlador del nuevo campo. Se crea fuera de build para conservarlo y liberarlo con dispose.';
    if(/^controller\s*:/.test(q))return 'Conecta el TextField con el TextEditingController declarado en State, de modo que podamos leer .text y llamar .clear().';
    if(/^\s*final\s+nombre\s*=\s*\w+Controller\.text\.trim\(\)/.test(q))return 'Lee el contenido del campo con .text, elimina espacios de los extremos usando .trim() y guarda el resultado en la variable local final nombre.';
    if(/^\s*if\s*\(nombre\.isEmpty\)\s*return/.test(q))return 'Si el nombre está vacío, return termina la función onPressed sin continuar. Es una comprobación sencilla, no un formulario con validator.';
    if(/^debugPrint\s*\(/.test(q))return 'Escribe un mensaje en la consola de depuración de Flutter. El signo $ inserta el contenido de la variable dentro del texto.';
    if(/^onPressed\s*:/.test(q))return q.includes('{}')?
      'Define la acción de pulsar el botón, pero la función anónima () {} está vacía: todavía no hace nada.':
      'Declara la función anónima que Flutter ejecutará al pulsar el botón. El bloque entre llaves contiene las instrucciones.';
    if(/^onChanged\s*:/.test(q))return 'Recibe el nuevo texto cada vez que cambia el TextField. valor es el parámetro que Flutter pasa a esta función.';
    if(/^setState\s*\(/.test(q))return 'Ejecuta las instrucciones de actualización y avisa a Flutter que debe reconstruir la interfaz con los datos nuevos.';
    if(/^busqueda\s*=\s*valor/.test(q))return 'Asigna el texto actual recibido por onChanged a la variable busqueda que pertenece al State.';
    if(/^String\s+busqueda\s*=/.test(q))return 'Declara una variable de texto inicialmente vacía. Más adelante guardará el texto introducido en el buscador.';
    if(/^final\s+List<String>\s+vehiculos/.test(q))return 'Declara una lista de cadenas String para guardar nombres de vehículos. final impide reasignar la variable a otra lista, pero su contenido puede cambiar.';
    if(/^final\s+resultados\s*=\s*vehiculos\.where/.test(q))return 'Calcula las coincidencias de búsqueda: where recorre la colección y conserva los vehículos para los cuales la condición es verdadera.';
    if(/^return\s+vehiculo\.toLowerCase\(\)\.contains/.test(q))return 'Convierte el nombre del vehículo a minúsculas y comprueba si contiene el texto de búsqueda. return entrega verdadero o falso a where.';
    if(/^vehiculo\.toLowerCase\(\)\.contains/.test(q))return 'Comprueba si el nombre del vehículo (en minúsculas) contiene la cadena de búsqueda; contiene devuelve verdadero o falso.';
    if(/^busqueda\.trim\(\)\.toLowerCase/.test(q))return 'Quita espacios sobrantes de la búsqueda y convierte el texto a minúsculas, para comparar sin distinguir mayúsculas.';
    if(/^if\s*\(resultados\.isEmpty/.test(q))return 'Comprueba si el filtro produjo cero coincidencias; si es así, el widget siguiente muestra un mensaje.';
    if(/^for\s*\(final\s+vehiculo\s+in\s+resultados/.test(q))return 'Recorre los resultados uno a uno. Por cada nombre, construimos un ListTile dentro de la lista children de Column.';
    if(/^ListTile\s*\(/.test(q))return 'Dibuja una fila visual de resultado. leading representa su icono inicial y title el nombre que se va a mostrar.';
    if(/^leading\s*:/.test(q))return 'Configura el widget que aparece a la izquierda de cada ListTile, aquí el icono de automóvil.';
    if(/^title\s*:\s*Text\(vehiculo/.test(q))return 'Muestra como título el valor de la variable vehiculo que llega desde el ciclo for.';
    if(/^final\s+/.test(q))return 'Declara una variable local final, que recibe un valor una vez y se utiliza en las instrucciones siguientes.';
    if(/^return\s+const?\s*MaterialApp\s*\(/.test(q)||/^return\s+MaterialApp\s*\(/.test(q))
      return 'Devuelve el widget raíz MaterialApp desde build; configura el entorno Material de la aplicación.';
    if(/^return\s+/.test(q))return 'Devuelve el valor o la expresión calculada por esta función.';
    if(/^home\s*:\s*Scaffold/.test(q))return 'Define la pantalla inicial de MaterialApp: en este caso un Scaffold.';
    if(/^Scaffold\s*\(/.test(q)||q==='Scaffold')return 'Construye o señala la estructura de una pantalla Material con áreas como appBar y body.';
    if(/^appBar\s*:/.test(q))return 'Asigna la barra superior del Scaffold. AppBar recibe el título y puede tener otros controles o propiedades.';
    if(/^title\s*:/.test(q))return 'Define el título que muestra AppBar, normalmente un Text con el nombre de la pantalla.';
    if(/^body\s*:/.test(q))return 'Define el contenido principal bajo la barra superior. El widget que sigue ocupa esa zona de la pantalla.';
    if(/^child\s*:\s*SingleChildScrollView/.test(q)||/^SingleChildScrollView\s*\(/.test(q))return 'Permite desplazarse verticalmente cuando el contenido de la pantalla es más alto que el espacio disponible.';
    if(/^padding\s*:\s*const\s+EdgeInsets\.all/.test(q))return 'Aplica el mismo margen interior a los cuatro lados; EdgeInsets.all(16) significa 16 píxeles lógicos.';
    if(/^body\s*:\s*Padding/.test(q)||/^child\s*:\s*Padding/.test(q)||/^Padding\s*\(/.test(q))return 'Envuelve el contenido en Padding para dejar espacio interior alrededor de sus widgets.';
    if(/^child\s*:\s*Center/.test(q)||/^Center\s*\(/.test(q))return 'Coloca un widget Center, que centra a su hijo dentro del espacio que recibe.';
    if(/^child\s*:\s*Column/.test(q)||/^Column\s*\(/.test(q))return 'Crea una Column que organiza verticalmente los widgets incluidos en children.';
    if(/^(const\s+)?Row\s*\(/.test(q))return 'Crea una Row que organiza horizontalmente sus hijos. const es posible cuando todo el constructor y sus argumentos son constantes.';
    if(/^children\s*:\s*\[/.test(q))return 'Abre la lista children con los widgets hijos del contenedor; se dibujan en el orden indicado.';
    if(/^actions\s*:\s*\[/.test(q))return 'Abre la lista de acciones de AppBar, que suelen aparecer a la derecha del título.';
    if(/^crossAxisAlignment\s*:/.test(q))return 'Alinea los widgets en el eje transversal. En una Column, stretch intenta extenderlos horizontalmente dentro de sus restricciones.';
    if(/^mainAxisAlignment\s*:/.test(q))return 'Distribuye los widgets en el eje principal. En una Column, el eje principal es vertical.';
    if(/^maxLines\s*:/.test(q))return 'Limita la cantidad máxima de líneas que puede ocupar este Text antes de aplicar overflow.';
    if(/^overflow\s*:/.test(q))return 'Indica qué hacer si el texto no cabe: TextOverflow.ellipsis coloca puntos suspensivos al final visible.';
    if(/^Expanded\s*\(/.test(q)||/^const\s+Expanded\s*\(/.test(q))return 'Permite que su hijo use el espacio flexible disponible del eje principal dentro de una Row o Column.';
    if(/^child\s*:\s*TextField/.test(q)||/^TextField\s*\(/.test(q))return 'Crea una caja de entrada editable. Por sí sola permite escribir, pero no filtra ni guarda registros.';
    if(/^decoration\s*:/.test(q))return 'Asigna la configuración visual del TextField mediante InputDecoration, como hintText y border.';
    if(/^hintText\s*:/.test(q))return 'Muestra una sugerencia mientras el campo está vacío. Esa sugerencia no es el valor que escribe el usuario.';
    if(/^border\s*:/.test(q))return 'Define el borde del campo mediante OutlineInputBorder, que crea un contorno rectangular.';
    if(/^child\s*:\s*Text/.test(q)||/^(const\s+)?Text\s*\(/.test(q))return 'Dibuja un texto. Lo que está entre comillas es una cadena literal; si se usa una variable, muestra su valor.';
    if(/^(const\s+)?SizedBox\s*\(/.test(q))return /width\s*:/.test(q)?
       'Crea una separación horizontal del ancho indicado en píxeles lógicos.':
       'Crea una separación vertical de la altura indicada en píxeles lógicos.';
    if(/^(const\s+)?Icon\s*\(/.test(q))return 'Dibuja un icono Material. Icons.directions_car identifica el dibujo de automóvil.';
    if(/^IconButton\s*\(/.test(q))return 'Crea un botón que muestra un icono y puede ejecutar la acción indicada en onPressed.';
    if(/^icon\s*:/.test(q))return 'Asigna el widget de icono que aparece dentro de un IconButton.';
    if(/^tooltip\s*:/.test(q))return 'Define un texto descriptivo que ayuda a entender el botón y favorece la accesibilidad.';
    if(/^centerTitle\s*:/.test(q))return 'Indica si el título de AppBar debe quedar centrado en la barra superior.';
    if(/^backgroundColor\s*:/.test(q))return 'Elige el color de fondo de la barra o widget correspondiente.';
    if(/^foregroundColor\s*:/.test(q))return 'Elige el color del texto e iconos de la barra o widget.';
    if(/^elevation\s*:/.test(q))return 'Indica el nivel de elevación visual o profundidad de la barra Material.';
    if(/^toolbarHeight\s*:/.test(q))return 'Define la altura de la barra de herramientas en píxeles lógicos.';
    if(/^ElevatedButton\s*\(/.test(q))return 'Construye un botón Material elevado. onPressed define qué pasará al pulsarlo y child determina su contenido.';
    if(/^child\s*:/.test(q))return 'Asigna un único widget hijo al contenedor actual. Para varios hijos se utiliza la lista children de Column o Row.';
    if(/^const\s+/.test(q))return 'Construye o declara un valor constante; revisa el widget y los argumentos que siguen a const.';
    if(/^((\w+):\s*)?Icon\(/.test(q))return 'Crea o asigna un icono como parte de la interfaz.';
    if(/^(\w+)\s*:/.test(q))return 'Asigna un argumento llamado '+q.split(':')[0]+' en el constructor. Los dos puntos separan el nombre de su valor.';
    if(/^(\w+)\s*=/.test(q))return 'Asigna un valor a la variable '+q.split('=')[0].trim()+'. El punto y coma termina la instrucción.';
    if(/^[A-Z][\w]*<[^>]+>\s*\(/.test(q))return 'Construye un widget parametrizado por un tipo genérico indicado entre < > (por ejemplo String o int). Sus argumentos configuran su contenido o sus eventos.';
    if(/^[A-Z][\w]*(?:\.\w+)?\s*\(/.test(q))return 'Construye el widget o llama a un constructor con nombre (por ejemplo .count o .asset). Los argumentos dentro de los paréntesis configuran su comportamiento.';
    if(/^Image\.asset\s*\(/.test(q))return 'Carga una imagen que forma parte de los recursos del proyecto; necesita declararse como asset en pubspec.yaml. width y fit ajustan su presentación.';
    if(/^\w+\s*\(/.test(q))return 'Llama al constructor o método indicado. Los paréntesis contienen sus argumentos.';
    if(/^['"]/.test(q))return 'Es un elemento de texto dentro de una lista; las comillas delimitan una cadena String y la coma separa elementos.';
    return 'Forma parte de la expresión o estructura de este ejemplo. Léela junto con las líneas anteriores y posteriores y revisa dónde se inserta el fragmento.';
  }
  root.explainLine=explanation;
  function buildRows(src){
    const lines=String(src).replace(/\r\n/g,'\n').split('\n');
    const stack=[];const result=[];
    for(let i=0;i<lines.length;i++){
      const row=lines[i],txt=row.trim();
      const message=explanation(txt,stack,i,lines);
      if(txt!==''){
        result.push({num:i+1,code:row,explanation:message,closing:/^[)\]};,]+$/.test(txt)});
      }
      updateStack(row,stack);
    }
    return result;
  }
  root.explain=buildRows;
  function mount(pre){
    if(!pre||pre.dataset.lineGuide==='yes'||pre.closest('.ln-breakdown'))return;
    const code=pre.querySelector(':scope > code');
    if(!code)return;
    const content=code.textContent;
    const rows=buildRows(content);
    if(!rows.length)return;
    const dialog=pre.closest('#widget-detail');
    const widgetName=dialog?.querySelector('#wc-detail-title')?.textContent?.trim();
    const widget=widgetName?(window.FlutterLabWidgetData||[]).find(w=>w.name===widgetName):null;
    if(widget){
      for(const row of rows){
        if(row.explanation.startsWith('Forma parte de la expresión')){
          const used=widget.properties.filter(p=>new RegExp('\\b'+p[0]+'\\s*:').test(row.code));
          const summary=used.slice(0,4).map(p=>p[0]+': '+p[2]).join('; ');
          row.explanation=widget.name+': '+widget.description+
            (summary?' En este ejemplo, las propiedades principales son '+summary+'.':' Consulta las propiedades del widget en la tabla de esta ficha.')+
            ' El ejemplo puede necesitar un contexto, clases o datos que se enseñarán en prácticas posteriores.';
        }
      }
    }
    pre.dataset.lineGuide='yes';
    const isShell=pre.dataset.codeMode==='terminal'||/^\s*(flutter\s|cd\s|Get-Location|Get-ChildItem|Test-Path)/m.test(content);
    const diagram=pre.dataset.codeMode==='esquema';
    const details=document.createElement('details');
    details.className='ln-breakdown';
    const label=diagram?'Leer los elementos de este esquema':isShell?'Explicación de los comandos, línea por línea':'Explicación del código, línea por línea';
    details.innerHTML='<summary><span class="ln-summary-icon">?</span><span>'+label+'</span><small>'+rows.length+' '+(rows.length===1?'línea':'líneas')+' explicadas</small></summary>'+
     '<p class="ln-guide-note">Aquí se explica cada instrucción del fragmento. Este apartado <strong>es para estudiar</strong>; utiliza el botón del recuadro de código original para copiar sin modificar el contenido.</p>'+
     '<div class="ln-table-scroll"><table class="ln-explained-table"><thead><tr><th>Línea</th><th>Instrucción</th><th>Qué significa y por qué se usa</th></tr></thead><tbody>'+
     rows.map(r=>'<tr'+(r.closing?' class="ln-closing"':'')+'><td class="ln-line-number">'+r.num+'</td><td><code>'+esc(r.code.trim())+'</code></td><td>'+esc(r.explanation)+'</td></tr>').join('')+
     '</tbody></table></div>';
    let position=pre;
    while(position.nextElementSibling&&position.nextElementSibling.matches('.cpl-panel, .fg-location-panel, .pv-code-link, .ch-code-legend')){
      position=position.nextElementSibling;
    }
    position.insertAdjacentElement('afterend',details);
  }
  function update(){
    document.querySelectorAll('pre.code-block').forEach(mount);
  }
  document.addEventListener('flutterlab:catalog-code',update);
  if(typeof MutationObserver==='function'){
    const dialog=document.getElementById('widget-detail');
    if(dialog){
      const observer=new MutationObserver(()=>update());
      observer.observe(dialog,{childList:true,subtree:true});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update,{once:true});
  else update();
})();