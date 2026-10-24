/* Simulador educativo de ListView: todas las interacciones son HTML, no Flutter. */
(() => {
  'use strict';
  const root=document.getElementById('catalog-listview-lab');
  if(!root)return;

  const source=root.querySelector('#wc-lab-source');
  const title=root.querySelector('#wc-lab-mode-title');
  const explanation=root.querySelector('#wc-lab-mode-explain');
  const list=root.querySelector('#wc-lab-list');
  const search=root.querySelector('#wc-lab-search');
  const input=root.querySelector('#wc-lab-new');
  const form=root.querySelector('#wc-lab-form');
  const amount=root.querySelector('#wc-lab-count');
  const notice=root.querySelector('#wc-lab-feedback');
  const modes=Array.from(root.querySelectorAll('[data-wc-mode]'));
  const records=[
    {id:1,nombre:'Renault 9'},
    {id:2,nombre:'Mazda 3'},
    {id:3,nombre:'Renault 21'},
    {id:4,nombre:'Chevrolet Spark'},
  ];
  let nextId=5, mode='builder';

  const snippets={
    children:{
      title:'ListView con children',
      explanation:'Úsalo cuando las filas son pocas y conocidas. Cada ListTile se escribe dentro de children. Si la lista cambia constantemente o crece mucho, prefiere builder.',
      code:[
        'ListView(',
        '  children: const [',
        "    ListTile(title: Text('Renault 9')),",
        "    ListTile(title: Text('Mazda 3')),",
        '  ],',
        ')',
      ].join('\n')
    },
    builder:{
      title:'ListView.builder',
      explanation:'itemCount indica cuántas filas existen. itemBuilder recibe context e indice y crea una fila ListTile cuando Flutter necesita mostrarla. En Column, normalmente envuélvelo con Expanded.',
      code:[
        'Expanded(',
        '  child: ListView.builder(',
        '    itemCount: vehiculos.length,',
        '    itemBuilder: (context, indice) {',
        '      return ListTile(',
        '        leading: const Icon(Icons.directions_car),',
        '        title: Text(vehiculos[indice]),',
        '      );',
        '    },',
        '  ),',
        ')',
      ].join('\n')
    },
    separated:{
      title:'ListView.separated',
      explanation:'Funciona como builder, pero separatorBuilder crea un Divider entre filas. No añade separador después del último elemento.',
      code:[
        'ListView.separated(',
        '  itemCount: vehiculos.length,',
        '  separatorBuilder: (context, indice) =>',
        '      const Divider(height: 1),',
        '  itemBuilder: (context, indice) {',
        '    return ListTile(title: Text(vehiculos[indice]));',
        '  },',
        ')',
      ].join('\n')
    },
    grid:{
      title:'GridView.builder',
      explanation:'Convierte la colección en tarjetas de dos columnas. El gridDelegate determina la cuadrícula, itemCount su tamaño e itemBuilder construye cada tarjeta.',
      code:[
        'GridView.builder(',
        '  gridDelegate:',
        '      const SliverGridDelegateWithFixedCrossAxisCount(',
        '        crossAxisCount: 2,',
        '        childAspectRatio: 1.25,',
        '      ),',
        '  itemCount: vehiculos.length,',
        '  itemBuilder: (context, indice) => Card(',
        '    child: Center(child: Text(vehiculos[indice])),',
        '  ),',
        ')',
      ].join('\n')
    }
  };

  function say(message,error=false){
    if(!notice)return;
    notice.textContent=message;
    notice.classList.toggle('is-error',error);
  }
  function makeRow(item){
    const row=document.createElement('div');
    row.className='wc-lab-item';
    row.setAttribute('role','listitem');
    const avatar=document.createElement('span');
    avatar.className='wc-lab-avatar';
    avatar.setAttribute('aria-hidden','true');
    avatar.textContent='🚘';
    const body=document.createElement('span');
    body.className='wc-lab-item-text';
    const name=document.createElement('strong');
    name.textContent=item.nombre;
    const sub=document.createElement('small');
    sub.textContent='Disponible · ID '+item.id;
    body.append(name,sub);
    const remove=document.createElement('button');
    remove.type='button';
    remove.className='wc-lab-delete';
    remove.dataset.wcDelete=String(item.id);
    remove.textContent='×';
    remove.setAttribute('aria-label','Eliminar '+item.nombre);
    remove.title='Eliminar vehículo';
    row.append(avatar,body,remove);
    return row;
  }
  function render(){
    const filter=search.value.trim().toLocaleLowerCase('es');
    const shown=records.filter(item=>item.nombre.toLocaleLowerCase('es').includes(filter));
    list.replaceChildren();
    list.classList.toggle('is-grid',mode==='grid');
    list.classList.toggle('is-separated',mode==='separated');
    list.setAttribute('role','list');
    list.setAttribute('aria-label','Vehículos del simulador');
    if(shown.length===0){
      const empty=document.createElement('p');
      empty.className='wc-lab-no-results';
      empty.textContent=records.length?'No hay vehículos que coincidan con la búsqueda.':'El inventario está vacío. Agrega el primer vehículo.';
      list.append(empty);
    }else{
      const fragment=document.createDocumentFragment();
      shown.forEach(item=>fragment.append(makeRow(item)));
      list.append(fragment);
    }
    amount.textContent=shown.length+' visible'+(shown.length===1?'':'s')+' · '+records.length+' registrado'+(records.length===1?'':'s');
    const selected=snippets[mode];
    source.textContent=selected.code;
    title.textContent=selected.title;
    explanation.textContent=selected.explanation;
    modes.forEach(button=>{
      const active=button.dataset.wcMode===mode;
      button.setAttribute('aria-pressed',String(active));
      button.classList.toggle('active',active);
    });
  }

  root.addEventListener('click',event=>{
    const selected=event.target.closest('[data-wc-mode]');
    if(selected){
      mode=selected.dataset.wcMode;
      render();
      say('Cambiando la vista de la misma colección. Los vehículos no se borraron.');
      return;
    }
    const deletion=event.target.closest('[data-wc-delete]');
    if(deletion){
      const id=Number(deletion.dataset.wcDelete);
      const index=records.findIndex(item=>item.id===id);
      if(index<0)return;
      const [removed]=records.splice(index,1);
      render();
      say('Se eliminó '+removed.nombre+'. El índice visible puede cambiar, pero el ID identifica al mismo vehículo.');
    }
  });
  form?.addEventListener('submit',event=>{
    event.preventDefault();
    const name=input.value.trim();
    if(name.length<3){
      say('Escribe un nombre de al menos tres caracteres antes de agregarlo.',true);
      input.focus();
      return;
    }
    records.push({id:nextId++,nombre:name});
    input.value='';
    render();
    say('Se agregó '+name+'. Ahora el listado tiene '+records.length+' elementos.');
    input.focus();
  });
  search?.addEventListener('input',()=>{render();say('Búsqueda aplicada sin cambiar la colección original.');});
  root.querySelector('[data-wc-reset]')?.addEventListener('click',()=>{
    records.splice(0,records.length,
      {id:1,nombre:'Renault 9'},
      {id:2,nombre:'Mazda 3'},
      {id:3,nombre:'Renault 21'},
      {id:4,nombre:'Chevrolet Spark'});
    nextId=5;
    mode='builder';
    search.value='';
    input.value='';
    render();
    say('Ejemplo restablecido con cuatro vehículos.');
  });
  root.querySelector('[data-wc-copy-snippet]')?.addEventListener('click',async event=>{
    const button=event.currentTarget;
    try{
      await navigator.clipboard.writeText(source.textContent);
      button.textContent='Copiado ✓';
    }catch{
      button.textContent='Selecciona el código';
    }
    window.setTimeout(()=>{button.textContent='Copiar este fragmento';},1500);
  });
  render();
})();
