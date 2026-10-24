/* Analogías didácticas: conectar cada comparación cotidiana con el código. */
(function(){
  'use strict';
  const data=window.FlutterLabAnalogias;
  if(!data)return;
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mark=value=>esc(value).replace(new RegExp(String.fromCharCode(96)+'([^'+String.fromCharCode(96)+']+)'+String.fromCharCode(96),'g'),'<code>$1</code>');
  function moduleCard(id,info){
    const pairs=info.equivalencias.map(([everyday,flutter])=>(
      '<div class="analogy-pair"><span>'+mark(everyday)+'</span><span>'+mark(flutter)+'</span></div>'
    )).join('');
    return '<aside class="student-analogy" data-analogy-module="'+esc(id)+'" aria-label="Ejemplo aplicado para comprender este tema">'+
      '<div class="student-analogy-head"><span class="student-analogy-index" aria-hidden="true">≍</span>'+
        '<div><span class="student-analogy-kicker">EJEMPLO CERCANO</span>'+
        '<h2>'+mark(info.titulo)+'</h2></div></div>'+
      '<p class="student-analogy-story">'+mark(info.cotidiano)+'</p>'+
      '<div class="student-analogy-pairs"><div class="student-analogy-pair-head"><strong>En la vida diaria</strong><strong>En Dart o Flutter</strong></div>'+pairs+'</div>'+
      '<p class="student-analogy-boundary"><strong>Qué conviene recordar:</strong> '+mark(info.cuidado)+'</p>'+
      '<details class="student-analogy-quiz"><summary>¿Lo entendiste? Comprueba tu respuesta</summary>'+
        '<p><strong>Pregunta:</strong> '+mark(info.pregunta)+'</p><p><strong>Respuesta esperada:</strong> '+mark(info.respuesta)+'</p></details>'+
      '</aside>';
  }
  function addModuleCards(){
    for(const [id,info] of Object.entries(data.modulos)){
      const page=document.getElementById(id);
      if(!page || page.querySelector('[data-analogy-module="'+id+'"]'))continue;
      const target=page.querySelector('.curriculum-bridge')||
        page.querySelector('.goal-box')||
        page.querySelector('.hero')||
        page.querySelector('.wc-page-hero')||
        page.querySelector('.lesson-heading');
      if(!target)continue;
      target.insertAdjacentHTML('afterend',moduleCard(id,info));
    }
  }
  function addBlocAnalogies(){
    const items=[...document.querySelectorAll('#bloc-practica .bloc-practice-step')];
    items.forEach((article,i)=>{
      const analogy=data.blocPractica[i];
      if(!analogy || article.querySelector('.bloc-practice-analogy'))return;
      const lead=article.querySelector('.bloc-practice-step-lead');
      if(!lead)return;
      const html='<aside class="bloc-practice-analogy" aria-label="Comparación cotidiana del paso '+(i+1)+'">'+
        '<span>IMAGÍNALO ASÍ</span><p>'+mark(analogy[0])+'</p>'+
        '<p><strong>En Flutter:</strong> '+mark(analogy[1])+'</p></aside>';
      lead.insertAdjacentHTML('afterend',html);
    });
  }
  /* La ficha del catálogo cambia al elegir otro widget, por eso se observa
     únicamente la sustitución de sus hijos directos. */
  function attachCatalogAnalogy(dialog){
    const title=dialog.querySelector('#wc-detail-title');
    if(!title || dialog.querySelector('.wc-widget-analogy'))return;
    const widgetName=title.textContent.trim();
    const item=(window.FlutterLabWidgetData||[]).find(w=>w.name===widgetName);
    const cfg=data.catalogo;
    if(!item || !cfg)return;
    const exact=cfg.exactas[widgetName];
    const sample=exact||cfg.familias[item.group];
    if(!sample)return;
    const target=dialog.querySelector('.wc-detail-grid');
    if(!target)return;
    const html='<aside class="wc-widget-analogy" aria-label="Ejemplo para comprender el widget">'+
      '<span>'+(exact?'EJEMPLO DE ESTE WIDGET':'EJEMPLO DE ESTA FAMILIA')+'</span>'+
      '<p><strong>Imagínalo así:</strong> '+mark(sample[0])+'</p>'+
      '<p><strong>En Flutter:</strong> '+mark(sample[1])+'</p>'+
      (!exact?'<p class="wc-widget-analogy-note">Este es un ejemplo de su familia. El widget <code>'+esc(widgetName)+'</code> cumple la función específica descrita arriba.</p>':'')+
    '</aside>';
    target.insertAdjacentHTML('beforebegin',html);
  }
  function addCatalogAnalogies(){
    const dialog=document.getElementById('widget-detail');
    if(!dialog)return;
    const observer=new MutationObserver(()=>attachCatalogAnalogy(dialog));
    observer.observe(dialog,{childList:true,subtree:false});
    attachCatalogAnalogy(dialog);
  }
  function init(){addModuleCards();addBlocAnalogies();addCatalogAnalogies();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();