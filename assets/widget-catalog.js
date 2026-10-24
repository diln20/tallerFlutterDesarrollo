(function flutterWidgetCatalog() {
  'use strict';
  const widgets = (window.FlutterLabWidgetData || []).slice().sort((a,b) => a.name.localeCompare(b.name,'es'));
  const grid = document.getElementById('catalog-grid');
  const filters = document.getElementById('catalog-filters');
  const search = document.getElementById('catalog-search');
  const counter = document.getElementById('catalog-count');
  const total = document.getElementById('catalog-total');
  const clear = document.getElementById('catalog-clear');
  const empty = document.getElementById('catalog-empty');
  const dialog = document.getElementById('widget-detail');
  if (!grid || !filters || !search || !dialog || widgets.length === 0) return;

  const groups = [...new Set((window.FlutterLabWidgetData || []).map(w=>w.group))];
  const seenInClass = new Set(['MaterialApp','Scaffold','AppBar','Center','Column','Row','Text','Icon','SizedBox','Expanded','TextField',
    'ListView','ListTile','GridView','SingleChildScrollView','Form','TextFormField','NavigationBar','NavigationDestination','IndexedStack',
    'Drawer','DrawerHeader','IconButton','Card','ElevatedButton','StatefulWidget','StatelessWidget','Padding','CircleAvatar']);
  const order = new Map(groups.map((name,i)=>[name,i]));
  let currentGroup='Todas';
  const preferidos=['ListView','ListTile','GridView','Card','NavigationBar','IndexedStack','SingleChildScrollView','TextFormField','Form',
    'Column','Row','Scaffold','CheckboxListTile','SwitchListTile','ExpansionTile','SearchBar','SearchAnchor'];
  const ranking = new Map(preferidos.map((name,index)=>[name,index]));
  const storeKey='tallerFlutterDesarrollo.catalogo.v2.';
  const saved = (key) => {try {return window.localStorage.getItem(storeKey+key);} catch {return null;}};
  const persist = (key,value) => {try {window.localStorage.setItem(storeKey+key,value);} catch {}};
  let viewMode=saved('vista')==='grid'?'grid':'list';
  let orderMode='recomendados';
  let onlyFavorites=false;
  let lastOpenButton=null;
  let favorites=new Set();
  try{
    const values=JSON.parse(saved('favoritos')||'[]');
    if(Array.isArray(values)) favorites=new Set(values.filter(value=>typeof value==='string'));
  } catch {}
  const sortSelect=document.getElementById('catalog-sort');
  const viewButtons=Array.from(document.querySelectorAll('[data-catalog-view]'));
  const favoriteFilter=document.getElementById('catalog-only-favorites');
  const favoriteCount=document.getElementById('catalog-favorite-count');
  let currentWidget=null;
  let currentAppBar=null;
  const escape = (str) => String(str??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm = (str) => String(str??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const official = (item) => `https://api.flutter.dev/flutter/${item.lib}/${item.name}-class.html`;
  const titles = {
    screen:'Pantalla Material',appbar:'Barra superior',row:'Distribución horizontal',column:'Distribución vertical',
    textfield:'Campo de texto',button:'Botón',nav:'Navegación',grid:'Cuadrícula',loading:'Indicador de progreso'
  };

  function demoContent(item, full=false) {
    const kind=item.preview||'container';
    const name=item.name;
    const face = ` <span class="wc-demo-caption">${escape(name)}</span>`;
    switch (kind) {
      case 'screen':
        return `<div class="wc-phone"><div class="wc-phone-status">9:41 <span>●●●</span></div><div class="wc-toolbar-sim"><span>☰</span><strong>${name.includes('Cupertino')?'Tienda':'Tienda'}</strong><span>⋮</span></div><div class="wc-phone-content"><span>🚘</span><small>Buscar vehículo</small><i></i><i></i></div></div>`;
      case 'appbar':
        return `<div class="wc-appbar-mock"><div class="wc-appbar-sim"><span class="wc-appbar-leading">☰</span><strong class="wc-appbar-title">Tienda</strong><span class="wc-appbar-actions">⌕　⋮</span></div><div class="wc-appbar-under"><span>🚘</span><small>Contenido de la pantalla</small></div></div>`;
      case 'nav':
        return `<div class="wc-demo-pane"><div class="wc-nav-sim"><span class="wc-nav-selected">⌂<small>Inicio</small></span><span>⌕<small>Buscar</small></span><span>♡<small>Favoritos</small></span></div></div>`;
      case 'rail':
        return `<div class="wc-rail-demo"><aside>⌂<br>⌕<br>♡</aside><div><span>Panel</span><div class="wc-ghost"></div><div class="wc-ghost short"></div></div></div>`;
      case 'drawer':
        return `<div class="wc-drawer-demo"><div><strong>Menú</strong><span>⌂ Inicio</span><span>🚘 Vehículos</span><span>⚙ Ajustes</span></div><span class="wc-drawer-shade"></span></div>`;
      case 'fab':
        return `<div class="wc-fab-demo"><div class="wc-ghost"></div><span>+</span></div>`;
      case 'tabs':
        return `<div class="wc-tabs-demo"><div><span class="active">Todos</span><span>Favoritos</span><span>Nuevos</span></div><p>Contenido de la pestaña</p></div>`;
      case 'row':
        return `<div class="wc-orient-demo horizontal"><span>A</span><span>B</span><span>C</span></div>`;
      case 'column':
        return `<div class="wc-orient-demo vertical"><span>A</span><span>B</span><span>C</span></div>`;
      case 'expanded':
        return `<div class="wc-expand-demo"><span>🚘</span><i></i><strong>Ocupa el espacio flexible</strong></div>`;
      case 'wrap':
        return `<div class="wc-wrap-demo"><span>Renault</span><span>Mazda</span><span>Chevrolet</span><span>Kia</span></div>`;
      case 'stack':
        return `<div class="wc-stack-demo"><div></div><span>★</span><small>Capas superpuestas</small></div>`;
      case 'size':
      case 'aspect':
      case 'layout':
        return `<div class="wc-size-demo"><div><span>Área del widget</span><i>↔</i></div></div>`;
      case 'padding':
        return `<div class="wc-padding-demo"><div class="wc-padding-inner">Contenido</div><span>16 px de espacio</span></div>`;
      case 'center':
        return `<div class="wc-align-demo"><span>Centro</span></div>`;
      case 'align':
        return `<div class="wc-align-demo top-right"><span>★</span></div>`;
      case 'container':
        return `<div class="wc-container-demo"><div><b>Tienda</b><small>Contenido y bordes</small></div></div>`;
      case 'card':
        return `<div class="wc-card-demo"><span>🚗</span><strong>Renault 9</strong><small>Modelo disponible</small></div>`;
      case 'list':
        return `<div class="wc-list-demo"><div>🚗　Renault 9 <span>›</span></div><div>🚘　Renault 21 <span>›</span></div><div>🚙　Mazda 3 <span>›</span></div></div>`;
      case 'divider':
        return `<div class="wc-divider-demo"><p>Primer elemento</p><hr><p>Segundo elemento</p></div>`;
      case 'text':
        return `<div class="wc-text-demo"><strong>${name==='RichText'?'Renault ':'Tienda'}${name==='RichText'?'<em>9</em>':''}</strong><span>Texto de ejemplo</span></div>`;
      case 'icon':
        return `<div class="wc-icon-demo"><span>🚘</span><small>Icono de automóvil</small></div>`;
      case 'image':
        return `<div class="wc-image-demo"><div>🚗</div><small>Imagen ilustrativa</small></div>`;
      case 'avatar':
        return `<div class="wc-avatar-demo"><span>R9</span><small>Avatar circular</small></div>`;
      case 'flutter':
        return `<div class="wc-flutter-demo"><span>◢</span><strong>Flutter</strong></div>`;
      case 'chip':
        return `<div class="wc-chip-demo"><span>✓ Renault</span><span>Sedán</span></div>`;
      case 'badge':
        return `<div class="wc-badge-demo"><span>🛒<i>3</i></span><small>Indicador de cantidad</small></div>`;
      case 'tooltip':
        return `<div class="wc-tooltip-demo"><span>Buscar vehículo</span><strong>⌕</strong></div>`;
      case 'placeholder':
        return `<div class="wc-placeholder-demo">╳　Zona pendiente　╳</div>`;
      case 'textfield':
      case 'form':
        return `<div class="wc-field-demo"><label>${name==='TextField'||name==='SearchBar'?'Buscar marca o modelo':'Nombre del vehículo'}</label>${full?'<input type="text" placeholder="Escribe aquí..." aria-label="Ejemplo de campo de texto">':'<span>Escribe aquí...</span>'}<small>Campo visual de práctica</small></div>`;
      case 'button':
        return `<div class="wc-button-demo"><span>${name.includes('Cupertino')?'Guardar':'Agregar vehículo'}</span></div>`;
      case 'button-outline':
        return `<div class="wc-button-demo outline"><span>Cancelar</span></div>`;
      case 'button-text':
        return `<div class="wc-button-demo text-only"><span>Ver más →</span></div>`;
      case 'switch':
        return `<div class="wc-toggle-demo"><span>Notificaciones</span>${full?'<button class="wc-switch is-on" type="button" aria-label="Alternar notificaciones" aria-pressed="true"><i></i></button>':'<span class="wc-switch is-on"><i></i></span>'}</div>`;
      case 'checkbox':
        return `<div class="wc-input-demo"><span class="wc-fake-check">✓</span><strong>Seleccionar vehículo</strong></div>`;
      case 'radio':
        return `<div class="wc-input-demo"><span class="wc-fake-radio"></span><strong>Modelo A</strong><span class="wc-fake-radio empty"></span><strong>Modelo B</strong></div>`;
      case 'slider':
        return `<div class="wc-slider-demo"><span>Valor: <strong class="wc-slider-value">60</strong>%</span>${full?'<input type="range" min="0" max="100" value="60" aria-label="Ejemplo de Slider">':'<div class="wc-range-sim"><span></span></div>'}</div>`;
      case 'select':
        return `<div class="wc-select-demo"><label>Marca</label>${full?'<select aria-label="Elegir una marca"><option>Renault</option><option>Mazda</option><option>Chevrolet</option></select>':'<span>Renault <b>⌄</b></span>'}</div>`;
      case 'segmented':
        return `<div class="wc-segment-demo"><span class="on">Todos</span><span>Marcas</span><span>Modelos</span></div>`;
      case 'grid':
        return `<div class="wc-grid-demo"><span>🚘</span><span>🚗</span><span>🚙</span><span>🚕</span></div>`;
      case 'scroll':
        return `<div class="wc-scroll-demo"><span>Vehículo 1</span><span>Vehículo 2</span><span>Vehículo 3</span><span>Vehículo 4</span></div>`;
      case 'pages':
        return `<div class="wc-pages-demo"><div>1</div><div>2</div><i>● ○ ○</i></div>`;
      case 'expansion':
        return `<div class="wc-expansion-demo"><b>⌄ Detalles del vehículo</b><p>Marca: Renault<br>Modelo: 9</p></div>`;
      case 'table':
        return `<table class="wc-table-demo"><thead><tr><th>Marca</th><th>Modelo</th></tr></thead><tbody><tr><td>Renault</td><td>9</td></tr><tr><td>Mazda</td><td>3</td></tr></tbody></table>`;
      case 'snackbar':
        return `<div class="wc-snackbar-demo"><span>✔ Vehículo agregado</span><b>OK</b></div>`;
      case 'dialog':
        return `<div class="wc-dialog-demo"><div><strong>Confirmar acción</strong><p>¿Deseas continuar?</p><footer><span>Cancelar</span><b>Aceptar</b></footer></div></div>`;
      case 'bottomsheet':
        return `<div class="wc-bottomsheet-demo"><div></div><strong>Opciones</strong><span>Editar　·　Eliminar</span></div>`;
      case 'loading':
        return `<div class="wc-loading-demo"><span class="wc-spinner"></span><small>Cargando…</small></div>`;
      case 'progress':
        return `<div class="wc-progress-demo"><span>Progreso · 60 %</span><div><i></i></div></div>`;
      case 'menu':
        return `<div class="wc-menu-demo"><span>⋮</span><div>Editar<hr>Eliminar<hr>Compartir</div></div>`;
      case 'steps':
        return `<div class="wc-steps-demo"><div><span>1</span><strong>Datos</strong></div><div><span>2</span><strong>Confirmación</strong></div><div><span>3</span><strong>Finalizar</strong></div></div>`;
      case 'gesture':
        return `<div class="wc-gesture-demo"><span>☝</span><strong>Toca el elemento</strong></div>`;
      case 'disabled':
        return `<div class="wc-button-demo disabled"><span>Control inactivo</span></div>`;
      case 'drag':
        return `<div class="wc-drag-demo"><span>Renault</span><b>→</b><div>Suelta aquí</div></div>`;
      case 'animation':
        return `<div class="wc-animation-demo"><span>★</span><p>Transición animada</p></div>`;
      default:
        return `<div class="wc-container-demo"><div><b>${escape(name)}</b><small>Ejemplo visual</small></div></div>`;
    }
  }

  function demo(item, full=false) {
    return `<div class="wc-demo wc-demo-${escape(item.preview||'container')}${full?' wc-demo-large':''}" aria-hidden="${!full}">
      ${demoContent(item,full)}
    </div>`;
  }

  function renderFilters(){
    const freq=Object.fromEntries(groups.map(g=>[g,widgets.filter(w=>w.group===g).length]));
    filters.innerHTML=`<button type="button" class="wc-filter${currentGroup==='Todas'?' active':''}" data-group="Todas" aria-pressed="${currentGroup==='Todas'}">Todos <span>${widgets.length}</span></button>`
      +groups.map(g=>`<button type="button" class="wc-filter${currentGroup===g?' active':''}" data-group="${escape(g)}" aria-pressed="${currentGroup===g}">${escape(g)} <span>${freq[g]}</span></button>`).join('');
  }

  function updateToolbar(){
    viewButtons.forEach(button=>{
      const selected=button.dataset.catalogView===viewMode;
      button.setAttribute('aria-pressed',String(selected));
      button.classList.toggle('active',selected);
    });
    if(favoriteFilter){
      favoriteFilter.setAttribute('aria-pressed',String(onlyFavorites));
      favoriteFilter.classList.toggle('active',onlyFavorites);
    }
    if(favoriteCount) favoriteCount.textContent=String(favorites.size);
    if(sortSelect)sortSelect.value=orderMode;
  }

  function renderCards() {
    const term=norm(search.value.trim());
    const matches=widgets.filter(w=>
      (currentGroup==='Todas'||w.group===currentGroup)
      && (!onlyFavorites||favorites.has(w.name))
      && norm([w.name,w.group,w.description,w.example,w.usage||'',w.placement||'',...w.properties.flat()].join(' ')).includes(term));
    const alpha=(a,b)=>a.name.localeCompare(b.name,'es');
    matches.sort((a,b)=>{
      if(orderMode==='categoria')return order.get(a.group)-order.get(b.group)||alpha(a,b);
      if(orderMode==='az')return alpha(a,b);
      return (ranking.get(a.name)??999)-(ranking.get(b.name)??999)||alpha(a,b);
    });

    if(total) total.textContent=String(widgets.length);
    if(counter) counter.textContent=matches.length+' widget'+(matches.length!==1?'s':'')+' '+(term||onlyFavorites?'encontrados':'para explorar');
    if(clear) clear.hidden=!term&&currentGroup==='Todas'&&!onlyFavorites;
    if(empty){
      empty.hidden=matches.length!==0;
      const hint=empty.querySelector('p');
      if(hint)hint.textContent=onlyFavorites
        ? 'Aún no hay coincidencias guardadas. Desactiva Favoritos o marca una estrella en la colección.'
        : 'Prueba ListView, ListTile, NavigationBar, filtros, formularios o una propiedad de Dart.';
    }
    grid.classList.toggle('is-list',viewMode==='list');
    grid.dataset.view=viewMode;
    grid.setAttribute('aria-label',viewMode==='list'?'Widgets en forma de lista':'Widgets en forma de tarjetas');
    grid.innerHTML=matches.map(w=>{
      const n=widgets.indexOf(w);
      const starred=favorites.has(w.name);
      return `<article class="wc-widget-item">
        <button type="button" class="wc-widget-card" data-widget-index="${n}" aria-label="Ver propiedades, ejemplo y detalles de ${escape(w.name)}">
          <div class="wc-widget-thumbnail">${demo(w)}</div>
          <div class="wc-widget-card-info">
            <div class="wc-widget-card-title"><strong>${escape(w.name)}</strong>${seenInClass.has(w.name)?'<span class="wc-seen">En el taller</span>':''}</div>
            <p>${escape(w.description)}</p>
            <div class="wc-widget-meta"><span>${escape(w.group)}</span><span>${w.properties.length} propiedades <span aria-hidden="true">↗</span></span></div>
          </div>
        </button>
        <button type="button" class="wc-save-widget${starred?' is-saved':''}" data-save-widget="${n}"
          aria-pressed="${starred}" aria-label="${starred?'Quitar '+escape(w.name)+' de':'Guardar '+escape(w.name)+' en'} favoritos"
          title="${starred?'Quitar de favoritos':'Guardar para estudiar'}"><span aria-hidden="true">${starred?'★':'☆'}</span></button>
      </article>`;
    }).join('');
    updateToolbar();
  }

  function updateAppBarSnippet() {
    if(!currentAppBar||!currentWidget||currentWidget.name!=='AppBar')return;
    const title=currentAppBar.title.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\$/g,'\\$');
    const color=currentAppBar.color.slice(1).toUpperCase();
    const snippet=[
      'AppBar(',
      `  title: const Text('${title}'),`,
      `  centerTitle: ${currentAppBar.center},`,
      `  backgroundColor: const Color(0xFF${color}),`,
      '  foregroundColor: Colors.white,',
      `  elevation: ${currentAppBar.elevation},`,
      `  toolbarHeight: ${currentAppBar.height},`,
      ...(currentAppBar.leading?["  leading: IconButton(","    onPressed: () {},","    tooltip: 'Menú',","    icon: const Icon(Icons.menu),","  ),"]:[]),
      ...(currentAppBar.actions?["  actions: [","    IconButton(","      tooltip: 'Buscar',","      onPressed: () {},","      icon: const Icon(Icons.search),","    ),","  ],"]:[]),
      ')'
    ].join('\n');
    const code=dialog.querySelector('#wc-example-code');
    if(code){
      code.textContent=snippet;
      delete code.dataset.highlighted;
      dialog.dispatchEvent(new CustomEvent('flutterlab:catalog-code',{bubbles:true}));
    }
    const toolbar=dialog.querySelector('.wc-appbar-sim');
    if(toolbar){
      toolbar.style.background=currentAppBar.color;
      toolbar.style.color='#fff';
      toolbar.style.height=currentAppBar.height+'px';
      toolbar.style.boxShadow=currentAppBar.elevation?'0 '+Math.max(2,Number(currentAppBar.elevation))+'px '+Math.max(6,Number(currentAppBar.elevation)*3)+'px rgba(19,32,70,.23)':'none';
      toolbar.classList.toggle('centered',currentAppBar.center);
      toolbar.querySelector('.wc-appbar-title').textContent=currentAppBar.title||' ';
      toolbar.querySelector('.wc-appbar-leading').hidden=!currentAppBar.leading;
      toolbar.querySelector('.wc-appbar-actions').hidden=!currentAppBar.actions;
    }
  }

  function bindDetailControls(item){
    dialog.querySelectorAll('[data-example-variant]').forEach(button=>{
      button.addEventListener('click',()=>{
        const option=item.snippetVariants?.[Number(button.dataset.exampleVariant)];
        if(!option)return;
        const code=dialog.querySelector('#wc-example-code');
        if(code){code.textContent=option.code;delete code.dataset.highlighted;}
        const note=dialog.querySelector('#wc-variant-note');
        if(note)note.textContent=option.explain;
        dialog.querySelectorAll('[data-example-variant]').forEach(entry=>{
          entry.setAttribute('aria-pressed',String(entry===button));
        });
        dialog.dispatchEvent(new CustomEvent('flutterlab:catalog-code',{bubbles:true}));
      });
    });
    dialog.querySelector('[data-open-list-lab]')?.addEventListener('click',()=>{
      dialog.close();
      document.getElementById('catalog-listview-lab')?.scrollIntoView({behavior:'smooth',block:'start'});
    });
    if(item.name==='AppBar'){
      currentAppBar={title:'Tienda',color:'#4354b6',center:false,actions:true,leading:true,height:56,elevation:2};
      const entries=['title','color','center','actions','leading','height','elevation'];
      const change=()=>{
        entries.forEach(key=>{
          const control=dialog.querySelector(`#wc-appbar-${key}`);
          if(!control)return;
          currentAppBar[key]=control.type==='checkbox'?control.checked:control.type==='range'?Number(control.value):control.value;
        });
        dialog.querySelector('#wc-height-value').textContent=currentAppBar.height+' px';
        dialog.querySelector('#wc-elevation-value').textContent=String(currentAppBar.elevation);
        updateAppBarSnippet();
      };
      entries.forEach(key=>dialog.querySelector(`#wc-appbar-${key}`)?.addEventListener('input',change));
      change();
    }
    dialog.querySelectorAll('.wc-switch[type="button"]').forEach(button=>{
      button.addEventListener('click',()=>{
        const active=button.getAttribute('aria-pressed')!=='true';
        button.setAttribute('aria-pressed',String(active));
        button.classList.toggle('is-on',active);
      });
    });
    dialog.querySelectorAll('input[type="range"]').forEach(range=>{
      if(range.id.startsWith('wc-appbar-'))return;
      range.addEventListener('input',()=>{
        const label=dialog.querySelector('.wc-slider-value');
        if(label)label.textContent=range.value;
      });
    });
    dialog.querySelectorAll('[data-copy-example]').forEach(button=>{
      button.addEventListener('click',async()=>{
        const code=dialog.querySelector('#wc-example-code')?.textContent||'';
        try{await navigator.clipboard.writeText(code);button.textContent='Copiado ✓'}
        catch{button.textContent='Selecciona el código'}
        setTimeout(()=>button.textContent='Copiar ejemplo',1700);
      });
    });
    dialog.querySelector('#wc-property-search')?.addEventListener('input',e=>{
      const term=norm(e.target.value);
      let showing=0;
      dialog.querySelectorAll('.wc-properties-table tbody tr').forEach(row=>{
        const visible=norm(row.textContent).includes(term);
        row.hidden=!visible;
        if(visible)showing++;
      });
      dialog.querySelector('#wc-property-count').textContent=showing+' propiedades';
    });
    dialog.querySelectorAll('[data-close-widget]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
  }

  function renderDetail(item) {
    currentWidget=item;
    const isAppbar=item.name==='AppBar';
    const buttons=isAppbar?`<div class="wc-appbar-controls">
      <h3>Prueba las propiedades de AppBar</h3>
      <p>Cambia valores: verás cómo varía la simulación y el fragmento Dart.</p>
      <div class="wc-control-grid">
        <label>Título <input id="wc-appbar-title" type="text" value="Tienda" maxlength="40"></label>
        <label>Fondo <input id="wc-appbar-color" type="color" value="#4354b6"></label>
        <label class="wc-checkbox-control"><input id="wc-appbar-center" type="checkbox"> Centrar título</label>
        <label class="wc-checkbox-control"><input id="wc-appbar-leading" type="checkbox" checked> Icono inicial</label>
        <label class="wc-checkbox-control"><input id="wc-appbar-actions" type="checkbox" checked> Acciones</label>
        <label>Altura: <span id="wc-height-value">56 px</span><input id="wc-appbar-height" type="range" min="48" max="100" value="56" step="4"></label>
        <label>Elevación: <span id="wc-elevation-value">2</span><input id="wc-appbar-elevation" type="range" min="0" max="12" value="2"></label>
      </div>
    </div>`:'';
    dialog.innerHTML=`<div class="wc-detail-shell">
      <div class="wc-detail-heading"><div><span class="wc-eyebrow">CATÁLOGO · ${escape(item.group)}</span><h2 id="wc-detail-title">${escape(item.name)}</h2>
        <p>${escape(item.description)}</p></div><button class="wc-detail-close" type="button" data-close-widget aria-label="Cerrar detalle">×</button></div>
      <div class="wc-detail-grid">
        <section class="wc-detail-visual" aria-label="Vista previa ilustrativa">
          <h3>Vista previa</h3>
          ${demo(item,true)}
          <p class="wc-simulation-note">Simulación HTML para estudiar la apariencia. No es una ejecución del widget Flutter.</p>
          ${buttons}
        </section>
        <section class="wc-detail-info" aria-label="Propiedades y código">
          <div class="wc-detail-section-head"><h3>Propiedades del widget</h3><span id="wc-property-count">${item.properties.length} propiedades</span></div>
          <label class="wc-property-search-label" for="wc-property-search">Buscar una propiedad</label>
          <input id="wc-property-search" type="search" placeholder="Ej. backgroundColor, title, onPressed">
          <div class="wc-properties-scroll"><table class="wc-properties-table"><thead><tr><th>Propiedad</th><th>Tipo</th><th>¿Para qué sirve?</th></tr></thead>
          <tbody>${item.properties.map(([name,type,description])=>`<tr><td><code>${escape(name)}</code></td><td><code>${escape(type)}</code></td><td>${escape(description)}</td></tr>`).join('')}</tbody></table></div>
        </section>
      </div>
      <section class="wc-detail-example">
        <div class="wc-detail-section-head"><h3>Cómo utilizarlo en la Tienda</h3><span class="wc-detail-level">${escape(item.level||'Consulta')}</span></div>
        <div class="wc-learn-notes">
          <div><strong>¿Cuándo usarlo?</strong><p>${escape(item.usage||item.description)}</p></div>
          <div><strong>¿Dónde se escribe?</strong><p>${escape(item.placement||'Dentro del método build, en el lugar que corresponda del árbol de widgets.')}</p></div>
          ${item.pitfall?`<div class="wc-learn-warning"><strong>Evita este error</strong><p>${escape(item.pitfall)}</p></div>`:''}
        </div>
        <div class="wc-detail-section-head"><h3>Ejemplo en Dart</h3><button type="button" class="wc-copy-example" data-copy-example>Copiar ejemplo</button></div>
        <p>Fragmento para estudiar. Si utiliza una variable, controlador o estado, decláralos antes de usarlo. El programa completo de ListView está disponible en esta colección.</p>
        ${item.snippetVariants?.length?`<div class="wc-variant-tabs" role="group" aria-label="Variantes de ${escape(item.name)}">
          ${item.snippetVariants.map((v,i)=>`<button type="button" data-example-variant="${i}" aria-pressed="${i===0}">${escape(v.label)}</button>`).join('')}
        </div><p class="wc-variant-note" id="wc-variant-note">${escape(item.snippetVariants[0].explain)}</p>`:''}
        <div class="code-label">Dart · ${escape(item.name)}</div>
        <pre class="code-block"><code id="wc-example-code">${escape(item.snippetVariants?.[0]?.code||item.example)}</code></pre>
        ${['ListView','ListTile','GridView'].includes(item.name)?'<button type="button" class="wc-go-practice" data-open-list-lab>Ver práctica interactiva de listas →</button>':''}
      </section>
      <div class="wc-detail-footer"><a href="${official(item)}" target="_blank" rel="noopener noreferrer">Consultar documentación oficial de ${escape(item.name)} ↗</a>
        <button type="button" class="wc-detail-done" data-close-widget>Cerrar</button></div>
    </div>`;
    bindDetailControls(item);
    if(typeof dialog.showModal==='function')dialog.showModal();
    else dialog.setAttribute('open','');
    if(!isAppbar)dialog.dispatchEvent(new CustomEvent('flutterlab:catalog-code',{bubbles:true}));
    dialog.querySelector('.wc-detail-close')?.focus();
    const url=new URL(window.location.href);
    url.searchParams.set('widget',item.name);
    window.history.replaceState(null,'',url);
  }

  function renderAppBarGuide(){
    const holder=document.getElementById('appbar-properties-table');
    const appbar=widgets.find(w=>w.name==='AppBar');
    if(!holder||!appbar)return;
    holder.innerHTML=`<div class="wc-properties-scroll"><table class="wc-properties-table"><thead><tr><th>Propiedad</th><th>Tipo</th><th>Para qué se utiliza</th></tr></thead><tbody>
      ${appbar.properties.map(([name,type,desc])=>`<tr><td><code>${escape(name)}</code></td><td><code>${escape(type)}</code></td><td>${escape(desc)}</td></tr>`).join('')}
    </tbody></table></div>`;
    const open=document.getElementById('open-appbar-explorer');
    if(open)open.addEventListener('click',()=>{window.location.hash='#catalogo-widgets';renderDetail(appbar)});
  }

  filters.addEventListener('click',e=>{
    const button=e.target.closest('[data-group]');
    if(!button)return;
    currentGroup=button.dataset.group;
    renderFilters();renderCards();
  });
  grid.addEventListener('click',e=>{
    const save=e.target.closest('[data-save-widget]');
    if(save){
      const widget=widgets[Number(save.dataset.saveWidget)];
      if(!widget)return;
      if(favorites.has(widget.name))favorites.delete(widget.name);
      else favorites.add(widget.name);
      persist('favoritos',JSON.stringify([...favorites]));
      const next=widget.name;
      renderCards();
      grid.querySelector('[data-save-widget="'+widgets.findIndex(w=>w.name===next)+'"]')?.focus();
      return;
    }
    const card=e.target.closest('[data-widget-index]');
    if(!card)return;
    const w=widgets[Number(card.dataset.widgetIndex)];
    if(w){lastOpenButton=card;renderDetail(w);}
  });
  search.addEventListener('input',renderCards);
  clear?.addEventListener('click',()=>{currentGroup='Todas';onlyFavorites=false;search.value='';renderFilters();renderCards();search.focus()});
  viewButtons.forEach(button=>button.addEventListener('click',()=>{
    viewMode=button.dataset.catalogView==='grid'?'grid':'list';
    persist('vista',viewMode);
    renderCards();
  }));
  sortSelect?.addEventListener('change',()=>{orderMode=sortSelect.value;renderCards()});
  favoriteFilter?.addEventListener('click',()=>{onlyFavorites=!onlyFavorites;renderCards()});
  document.getElementById('catalog-list-jump')?.addEventListener('click',()=>{
    currentGroup='Listas y desplazamiento';
    onlyFavorites=false;
    viewMode='list';
    renderFilters();
    renderCards();
    grid.scrollIntoView({behavior:'smooth',block:'start'});
  });
  dialog.addEventListener('click',e=>{
    if(e.target===dialog)dialog.close();
  });
  dialog.addEventListener('close',()=>{
    currentWidget=null;
    const url=new URL(window.location.href);
    if(url.searchParams.has('widget')){
      url.searchParams.delete('widget');
      window.history.replaceState(null,'',url);
    }
    if(lastOpenButton?.isConnected)lastOpenButton.focus();
    lastOpenButton=null;
  });

  renderFilters();renderCards();renderAppBarGuide();
  const initial=new URLSearchParams(window.location.search).get('widget');
  if(initial&&window.location.hash==='#catalogo-widgets'){
    const found=widgets.find(w=>w.name===initial);
    if(found)renderDetail(found);
  }
})();