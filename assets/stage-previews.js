(function flutterStagePreviews(){
  'use strict';
  const data=window.FlutterLabStageData||{};
  const modules=['preparacion','punto-entrada','estructura','diseno','campo-texto','responsive','estado','formularios','proyecto','bloc'];
  const baseCars=['Renault 9','Renault 21','Mazda 3','Chevrolet Spark'];
  const runtimeMap=new Map();
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
  function editorUI(v){
    return `<div class="pv-editor">
      <div class="pv-editor-title"><span>● ● ●</span> VS Code · ejemplo visual</div>
      <div class="pv-editor-tab">▦　main.dart　　pubspec.yaml</div>
      <div class="pv-editor-lines">
        <div><em>01</em> <b>import</b> 'package:flutter/material.dart';</div>
        <div><em>02</em></div><div><em>03</em> <b>void</b> main() {</div>
        <div><em>04</em>　runApp(<b>const</b> MainApp());</div><div><em>05</em> }</div>
        <div><em>06</em></div><div><em>07</em> <b>class</b> MainApp...</div>
      </div>
      <div class="pv-editor-status">${v.opened?'lib/main.dart localizado':'Abre el proyecto actividad2a'}${v.ready?' · ✓ Dependencias preparadas':''}</div>
    </div>`;
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
    return `<section class="pv-form">
      ${showTitle?`<strong class="${highlight==='form-title'&&which==='after'?'pv-glow':''}">Agregar un vehículo</strong>`:''}
      ${showField?`${v.simpleForm?'':`<label class="${highlight==='form-field'&&which==='after'?'pv-glow':''}">Nombre del vehículo</label>`}
      <input type="text" data-pv-model="${which}" value="${which==='after'?esc(r.model):''}"
        class="${highlight==='form-field'&&which==='after'?'pv-glow':''}"
        placeholder="${v.simpleForm?'Nombre del vehículo':'Ej. Toyota Corolla'}" autocomplete="off"
        ${which==='before'?'readonly tabindex="-1"':''}>`:''}
      ${showButton?`<button type="button" class="pv-submit${highlight==='button'&&which==='after'?' pv-glow':''}"
        ${which==='after'&&ready?'data-pv-submit':''}
        ${which==='before'?'disabled':''}>Agregar vehículo</button>`:''}
    </section>`;
  }
  function screenUI(v,which,highlight,r){
    if(v.editor)return editorUI(v);
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
        model:'',invalid:!!after.validationError,snackbar:after.snackbar||'',
        clearAfterSave:!!after.clearAfterSave,debugMessage:''};
    runtimeMap.set(id,runtime);
    const internal=item.visual===false;
    const status={original:'Basado en el código real',reconstruct:'Reconstrucción didáctica',proposed:'Funcionalidad propuesta',conceptual:'Concepto futuro'};
    slot.innerHTML=`<section class="pv-shell" data-pv-module="${id}">
      <header class="pv-header"><div><span class="pv-kicker">${status[item.kind||cfg.kind]}</span>
        <h2>Así va cambiando tu aplicación</h2>
        <p>Elige un paso, compara el antes y el después y reconoce la instrucción que lo produjo.</p></div>
        <strong class="pv-index">PASO ${i+1} / ${cfg.steps.length}</strong>
      </header>
      <nav class="pv-step-list" aria-label="Cambios de ${esc(cfg.name)}">
        ${cfg.steps.map((s,n)=>`<button type="button" class="pv-step${n===i?' pv-active':''}" data-pv-step="${n}" aria-pressed="${n===i}"><span>${String(n+1).padStart(2,'0')}</span>${esc(s.name)}</button>`).join('')}
      </nav>
      <div class="pv-effect"><div class="pv-effect-top"><strong>${esc(item.name)}</strong>
          <span class="pv-effect-type${internal?' pv-internal':''}">${internal?'Sin cambio visual inmediato':'Cambio representado'}</span></div>
        <p>${esc(item.effect)}</p>${item.note?`<p class="pv-special-note">${esc(item.note)}</p>`:''}
      </div>
      <div class="pv-mobile-toggle" aria-label="Comparar las dos versiones">
        <button type="button" data-pv-phase="before" aria-pressed="${phase==='before'}" class="${phase==='before'?'active':''}">Antes</button>
        <button type="button" data-pv-phase="after" aria-pressed="${phase==='after'}" class="${phase==='after'?'active':''}">Después</button>
      </div>
      <div class="pv-compare">
        <div class="pv-side${phase==='before'?' pv-selected':''}" data-pv-side="before">
          <div class="pv-side-heading"><strong>ANTES</strong><span>Antes de aplicar el cambio</span></div>
          <div class="pv-preview-area">${screenUI(before,'before',item.highlight,
            {...runtime,query:before.query||'',addedCars:before.added?[before.added]:[],invalid:!!before.validationError})}</div>
        </div>
        <div class="pv-side pv-after${phase==='after'?' pv-selected':''}" data-pv-side="after">
          <div class="pv-side-heading"><strong>DESPUÉS</strong><span>${internal?'Interfaz igual; cambia el código':'Elemento modificado resaltado'}</span></div>
          <div class="pv-preview-area">${screenUI(after,'after',item.highlight,runtime)}</div>
        </div>
      </div>
      ${id==='proyecto'?'<div class="pv-debug-console" data-pv-debug-console hidden><strong>Salida simulada de la consola de Flutter</strong><code data-pv-debug-message></code><p>La instrucción debugPrint escribe en la consola de desarrollo, no en la pantalla del móvil.</p></div>':''}
      ${id==='bloc'?'<div class="pv-bloc-flow">Flujo conceptual fuera de la pantalla: <strong>Evento → BLoC → Estado</strong> · Sin implementación en main.dart</div>':''}
      <div class="pv-notices">
        ${after.form?'<span class="pv-scroll-tip">↕ Desplázate dentro del teléfono para ver el campo y el botón.</span>':''}
        <span class="pv-result-status">${internal?'Este paso prepara lógica o estructura y no introduce nuevos elementos visuales.':'El contorno amarillo señala lo nuevo o modificado.'}</span>
        <span class="pv-simulation-note">Simulación HTML: no es una captura ni una ejecución real de Flutter.</span>
      </div>
      <div class="pv-code-explain">
        <div class="pv-code-intro"><div><strong>¿Qué código provoca este efecto?</strong><p>Identifica las líneas resaltadas: verde para añadir, ámbar para reemplazar y azul para observar. La guía inferior indica dónde van en main.dart.</p></div><span>${status[item.kind||cfg.kind]}</span></div>
        <div class="code-label">${id==='preparacion'?(i===0?'Esquema de archivos':'Terminal · PowerShell'):id==='bloc'?'Concepto BLoC (pseudocódigo)':'Dart'} · ${esc(item.name)}</div>
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
    const error=after.querySelector('[data-pv-error]');if(error)error.hidden=!r.invalid;
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
    if(submit){
      const id=submit.closest('[data-pv-module]')?.dataset.pvModule,r=runtimeMap.get(id);if(!r)return;
      const name=r.model.trim();
      if(!name)return;
      if(id==='proyecto') r.debugMessage='Vehículo escrito: '+name;
      else r.addedCars.push(name);
      r.invalid=false;
      r.snackbar='';
      if(r.clearAfterSave) {
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