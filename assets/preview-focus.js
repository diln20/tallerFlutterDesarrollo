/* Modo de lectura de comparaciones: amplía cada pantalla sin confundirla con capturas reales de Flutter. */
(function flutterPreviewFocus(){
  'use strict';
  let dialog = null;
  let opener = null;

  function enhanceAll(){
    const sides = document.querySelectorAll('.pv-shell .pv-compare > .pv-side');
    sides.forEach((side) => {
      const heading = side.querySelector('.pv-side-heading');
      if (!heading || heading.querySelector('[data-pv-focus-open]')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'pv-focus-open';
      button.dataset.pvFocusOpen = side.dataset.pvSide || 'before';
      button.textContent = '⛶ Ver en pantalla completa';
      button.setAttribute('aria-label', 'Ampliar vista ' + (side.dataset.pvSide === 'after' ? 'después' : 'antes') + ' para leerla mejor');
      heading.appendChild(button);
    });
  }

  function ensureDialog(){
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'pv-focus-dialog';
    dialog.setAttribute('aria-labelledby', 'pv-focus-title');
    dialog.innerHTML =
      '<div class="pv-focus-inner">' +
        '<header class="pv-focus-toolbar"><div><strong id="pv-focus-title"></strong>' +
        '<small>Vista didáctica ampliada · no es una captura real de Flutter</small></div>' +
        '<button type="button" class="pv-focus-close" data-pv-focus-close>Cerrar ×</button></header>' +
        '<div class="pv-focus-content" data-pv-focus-content></div>' +
        '<p class="pv-footer-hint">Solo lectura. Cierra esta vista para interactuar con el ejemplo original y continuar los pasos.</p>' +
      '</div>';
    document.body.appendChild(dialog);
    dialog.querySelector('[data-pv-focus-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
      dialog.querySelector('[data-pv-focus-content]').replaceChildren();
      if (opener && opener.isConnected) opener.focus();
      opener = null;
    });
    return dialog;
  }

  function openFocus(button){
    const side = button.closest('.pv-side');
    const shell = button.closest('.pv-shell');
    const area = side && side.querySelector('.pv-preview-area');
    if (!area || !shell) return;
    const view = ensureDialog();
    const clone = area.cloneNode(true);
    clone.removeAttribute('id');
    clone.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
    clone.querySelectorAll('input,textarea,select,button').forEach((node) => {
      node.tabIndex = -1;
      node.setAttribute('aria-disabled','true');
      if ('readOnly' in node) node.readOnly = true;
    });
    const phase = side.dataset.pvSide === 'after' ? 'DESPUÉS' : 'ANTES';
    const step = shell.querySelector('.pv-effect-top strong')?.textContent || 'Paso del taller';
    view.querySelector('#pv-focus-title').textContent = phase + ' · ' + step;
    view.querySelector('[data-pv-focus-content]').replaceChildren(clone);
    opener = button;
    view.showModal();
    view.querySelector('[data-pv-focus-close]').focus();
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest?.('[data-pv-focus-open]');
    if (button) openFocus(button);
  });
  document.addEventListener('flutterlab:catalog-code', enhanceAll);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceAll, {once:true});
  } else {
    enhanceAll();
  }
})();
