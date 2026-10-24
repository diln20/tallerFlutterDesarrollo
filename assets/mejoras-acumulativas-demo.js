/* Simulaciones HTML educativas; no sustituyen la ejecución del proyecto Flutter. */
(() => {
  'use strict';
  const original=[
    {id:1,nombre:'Renault 9',precio:14500000,disponible:true,favorito:true},
    {id:2,nombre:'Mazda 3',precio:36000000,disponible:true,favorito:false},
    {id:3,nombre:'Renault 21',precio:17500000,disponible:false,favorito:false},
    {id:4,nombre:'Chevrolet Spark',precio:16000000,disponible:true,favorito:false},
    {id:5,nombre:'Kia Rio',precio:28500000,disponible:true,favorito:true},
  ];
  const money=n=>new Intl.NumberFormat('es-CO',{maximumFractionDigits:0}).format(n);

  document.querySelectorAll('[data-ux-demo]').forEach(root=>{
    let autos=original.map(x=>({...x})),filter='todos',order='recientes',pending=null,removed=null;
    const list=root.querySelector('[data-ux-list]');
    const feedback=root.querySelector('[data-ux-feedback]');
    const confirm=root.querySelector('[data-ux-confirm]');
    const snackbar=root.querySelector('[data-ux-snackbar]');
    const summary=root.querySelector('[data-ux-summary]');
    const isSummary=root.dataset.uxDemo==='summary';

    function note(message){if(feedback)feedback.textContent=message;}
    function button(text,action,id,title){
      const b=document.createElement('button');b.type='button';
      b.dataset.uxAction=action;b.dataset.uxId=String(id);
      b.textContent=text;b.title=title||text;b.setAttribute('aria-label',title||text);
      return b;
    }
    function makeRow(v){
      const row=document.createElement('div');row.className='ux-example-row';
      const fav=button(v.favorito?'★':'☆','favorite',v.id,(v.favorito?'Quitar ':'Marcar ')+v.nombre+' como favorito');
      fav.className='ux-example-star'+(v.favorito?' is-active':'');
      const details=document.createElement('div');details.className='ux-example-main';
      const name=document.createElement('strong');name.textContent=v.nombre;
      const desc=document.createElement('span');desc.textContent='$ '+money(v.precio)+' · '+(v.disponible?'Disponible':'No disponible');
      details.append(name,desc);
      const actions=document.createElement('div');actions.className='ux-example-actions';
      if(isSummary)actions.append(button('Eliminar','ask',v.id,'Confirmar eliminación de '+v.nombre));
      else actions.append(button(v.disponible?'Disponible':'No disponible','availability',v.id,'Cambiar disponibilidad de '+v.nombre));
      row.append(fav,details,actions);return row;
    }
    function render(){
      let items=autos.filter(v=>filter==='todos'||(filter==='favoritos'?v.favorito:v.disponible));
      if(order==='nombre')items.sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));
      if(order==='precio')items.sort((a,b)=>a.precio-b.precio);
      if(list){
        const all=document.createDocumentFragment();
        items.forEach(v=>all.append(makeRow(v)));
        list.replaceChildren(all);
        if(!items.length){
          const empty=document.createElement('p');empty.className='ux-example-empty';
          empty.textContent='No hay vehículos en este filtro.';list.append(empty);
        }
      }
      root.querySelectorAll('[data-ux-filter]').forEach(chip=>{
        const active=chip.dataset.uxFilter===filter;
        chip.setAttribute('aria-pressed',String(active));
      });
      const select=root.querySelector('[data-ux-order]');
      if(select)select.value=order;
      if(summary){
        const available=autos.filter(v=>v.disponible).length;
        const favorites=autos.filter(v=>v.favorito).length;
        const mean=autos.length?autos.reduce((s,v)=>s+v.precio,0)/autos.length:0;
        const values={total:autos.length,available,favorites,mean:'$ '+money(mean)};
        Object.entries(values).forEach(([name,value])=>{
          const slot=summary.querySelector('[data-ux-stat="'+name+'"]');
          if(slot)slot.textContent=String(value);
        });
        const progress=root.querySelector('[data-ux-progress]');
        if(progress){progress.value=autos.length?available/autos.length:0;}
      }
    }
    root.addEventListener('click',e=>{
      const filterBtn=e.target.closest('[data-ux-filter]');
      if(filterBtn){
        filter=filterBtn.dataset.uxFilter;render();note('Filtro aplicado a los mismos objetos de la Tienda.');return;
      }
      if(e.target.closest('[data-ux-reset]')){
        autos=original.map(x=>({...x}));pending=null;removed=null;filter='todos';order='recientes';
        if(confirm)confirm.hidden=true;if(snackbar)snackbar.hidden=true;
        render();note('La práctica volvió a sus valores iniciales.');return;
      }
      if(e.target.closest('[data-ux-cancel]')){
        pending=null;if(confirm)confirm.hidden=true;note('Cancelaste: no se eliminó ningún vehículo.');return;
      }
      if(e.target.closest('[data-ux-accept]')){
        if(pending!==null){
          const ix=autos.findIndex(v=>v.id===pending);
          if(ix>=0){const [car]=autos.splice(ix,1);removed={car,index:ix};}
        }
        pending=null;if(confirm)confirm.hidden=true;
        if(snackbar)snackbar.hidden=false;
        render();note('La eliminación fue confirmada. Usa Deshacer para restaurar.');return;
      }
      if(e.target.closest('[data-ux-undo]')){
        if(removed){autos.splice(Math.min(removed.index,autos.length),0,removed.car);removed=null;}
        if(snackbar)snackbar.hidden=true;
        render();note('Vehículo restaurado con su estrella y disponibilidad.');return;
      }
      const act=e.target.closest('[data-ux-action]');
      if(!act)return;
      const id=Number(act.dataset.uxId),car=autos.find(v=>v.id===id);if(!car)return;
      if(act.dataset.uxAction==='favorite'){
        car.favorito=!car.favorito;
        note(car.nombre+(car.favorito?' está en favoritos.':' se quitó de favoritos.'));
      }
      if(act.dataset.uxAction==='availability'){
        car.disponible=!car.disponible;note('Disponibilidad de '+car.nombre+' actualizada.');
      }
      if(act.dataset.uxAction==='ask'){
        pending=id;if(confirm){confirm.hidden=false;const t=confirm.querySelector('[data-ux-confirm-name]');if(t)t.textContent=car.nombre;}
        note('Confirma o cancela antes de eliminar.');
      }
      render();
    });
    root.querySelector('[data-ux-order]')?.addEventListener('change',e=>{
      order=e.target.value;render();note('Se ordenó la lista visible sin cambiar el orden original.');
    });
    render();
  });
})();