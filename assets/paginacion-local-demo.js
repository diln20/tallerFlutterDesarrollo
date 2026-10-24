/* P10.1: simulador en memoria, no consume FastAPI ni altera el CRUD de Flutter. */
(() => {
  'use strict';
  const host=document.getElementById('paginacion-local-demo');
  if(!host)return;

  const names=[
    'Renault 9','Mazda 3','Renault 21','Chevrolet Spark','Kia Rio',
    'Ford Fiesta','Toyota Corolla','Renault Logan','Nissan Sentra',
    'Hyundai Accent','Honda Civic','Peugeot 206','Fiat Uno',
    'Chevrolet Onix','Renault Clio','Suzuki Swift','Mazda 2',
    'Renault Sandero','Volkswagen Gol','Kia Picanto','Toyota Yaris',
    'Ford Focus','Chevrolet Aveo'
  ];
  const vehicles=names.map((nombre,index)=>({id:index+1,nombre}));
  let nextId=vehicles.length+1;
  let pagina=1;
  const search=host.querySelector('[data-pl-search]');
  const size=host.querySelector('[data-pl-size]');
  const form=host.querySelector('[data-pl-form]');
  const nameInput=host.querySelector('[data-pl-name]');
  const list=host.querySelector('[data-pl-list]');
  const info=host.querySelector('[data-pl-info]');
  const prev=host.querySelector('[data-pl-prev]');
  const next=host.querySelector('[data-pl-next]');
  const output=host.querySelector('[data-pl-calculation]');
  const feedback=host.querySelector('[data-pl-feedback]');

  function render() {
    const quantity=Number(size.value)||5;
    const query=search.value.trim().toLocaleLowerCase('es');
    const found=vehicles.filter(item=>item.nombre.toLocaleLowerCase('es').includes(query));
    const pages=Math.max(1,Math.ceil(found.length/quantity));
    pagina=Math.max(1,Math.min(pagina,pages));
    const inicio=(pagina-1)*quantity;
    const current=found.slice(inicio,inicio+quantity);
    list.replaceChildren();
    if(!current.length){
      const empty=document.createElement('p');
      empty.className='pl-empty';
      empty.textContent='No hay vehículos que coincidan con la búsqueda.';
      list.append(empty);
    }
    const items=document.createDocumentFragment();
    current.forEach(car=>{
      const row=document.createElement('div');
      row.className='pl-row';
      const detail=document.createElement('div');
      const title=document.createElement('strong');
      title.textContent=car.nombre;
      const subtitle=document.createElement('small');
      subtitle.textContent='Vehículo #'+car.id;
      detail.append(title,subtitle);
      const del=document.createElement('button');
      del.type='button';
      del.textContent='Eliminar';
      del.dataset.plRemove=String(car.id);
      del.setAttribute('aria-label','Eliminar '+car.nombre);
      row.append(detail,del);
      items.append(row);
    });
    list.append(items);
    info.textContent='Página '+pagina+' de '+pages+' · '+current.length+' mostrados de '+found.length+' encontrados';
    prev.disabled=pagina<=1;
    next.disabled=pagina>=pages;
    const ejemplo=found.length===0?'[]':found.map(x=>x.nombre).slice(inicio,inicio+quantity);
    output.textContent='inicio = ('+pagina+' − 1) × '+quantity+' = '+inicio+
      '\nvisibles.skip('+inicio+').take('+quantity+')\n→ '+JSON.stringify(ejemplo,null,2);
    host.dataset.page=String(pagina);
    host.dataset.pages=String(pages);
  }
  function note(msg){
    if(feedback)feedback.textContent=msg;
  }
  prev.addEventListener('click',()=>{if(pagina>1){pagina--;render();}});
  next.addEventListener('click',()=>{pagina++;render();});
  search.addEventListener('input',()=>{pagina=1;render();note('La búsqueda comienza nuevamente en la página 1.');});
  size.addEventListener('change',()=>{pagina=1;render();note('Cambiar el tamaño reinicia la paginación.');});
  list.addEventListener('click',event=>{
    const button=event.target.closest('[data-pl-remove]');
    if(!button)return;
    const id=Number(button.dataset.plRemove);
    const real=vehicles.findIndex(item=>item.id===id);
    if(real<0)return;
    const [removed]=vehicles.splice(real,1);
    render();
    note('Se eliminó '+removed.nombre+'. Si la página quedó fuera del rango, se ajustó automáticamente.');
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const name=nameInput.value.trim();
    if(name.length<3){note('El nombre necesita al menos tres caracteres.');nameInput.focus();return;}
    vehicles.push({id:nextId++,nombre:name});
    nameInput.value='';
    search.value='';
    pagina=Math.max(1,Math.ceil(vehicles.length/Number(size.value)));
    render();
    note('Vehículo agregado. Puedes verlo en la última página.');
  });
  host.querySelector('[data-pl-reset]')?.addEventListener('click',()=>{
    vehicles.splice(0,vehicles.length,...names.map((nombre,index)=>({id:index+1,nombre})));
    nextId=names.length+1;
    pagina=1;size.value='5';search.value='';nameInput.value='';
    render();note('Restablecidos los 23 vehículos originales.');
  });
  render();
})();
