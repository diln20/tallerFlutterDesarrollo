(() => {
  'use strict';
  function iniciar() {
    const caja = document.getElementById('nb-demostracion');
    if (!caja) return;
    const botones = Array.from(caja.querySelectorAll('[data-nb-tab]'));
    const paneles = Array.from(caja.querySelectorAll('[data-nb-panel]'));
    const texto = caja.querySelector('[data-nb-state]');
    function seleccionar(indice, moverFoco = false) {
      if (indice < 0 || indice >= botones.length) return;
      botones.forEach((boton, i) => {
        const activo = i === indice;
        boton.setAttribute('aria-selected', String(activo));
        boton.tabIndex = activo ? 0 : -1;
        if (activo && moverFoco) boton.focus();
      });
      paneles.forEach(panel => {
        panel.hidden = Number(panel.dataset.nbPanel) !== indice;
      });
      if (texto) texto.textContent = 'selectedIndex = ' + indice + ' · pestaña ' + botones[indice].dataset.nbLabel;
    }
    botones.forEach((boton,i) => {
      boton.addEventListener('click', () => seleccionar(i));
      boton.addEventListener('keydown', event => {
        if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
        event.preventDefault();
        const otro = event.key === 'Home' ? 0 : event.key === 'End' ? botones.length - 1 :
          (i + (event.key === 'ArrowRight' ? 1 : -1) + botones.length) % botones.length;
        seleccionar(otro,true);
      });
    });
    seleccionar(0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',iniciar,{once:true});
  else iniciar();
})();
