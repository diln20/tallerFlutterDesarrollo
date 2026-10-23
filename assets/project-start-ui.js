/* Copia el comando inicial. El ejemplo no ejecuta órdenes ni edita archivos del estudiante. */
(function(){
  'use strict';
  document.querySelectorAll('[data-start-copy]').forEach(button=>button.addEventListener('click',async()=>{
    const value=button.dataset.startCopy;if(!value)return;
    let success=false;
    if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(value);success=true;}catch(_){}}
    if(!success){
      const field=document.createElement('textarea');field.value=value;field.readOnly=true;
      field.style.cssText='position:fixed;left:-9999px;top:-9999px';
      document.body.appendChild(field);field.select();
      try{success=document.execCommand('copy')}catch(_){}field.remove();
    }
    button.textContent=success?'Copiado ✓':'No se pudo copiar';
    window.setTimeout(()=>{
      button.textContent='Copiar comando';
    },1700);
  }));
})();
