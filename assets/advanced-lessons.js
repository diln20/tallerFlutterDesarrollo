(() => {
  'use strict';
  function initMenu() {
    const root = document.getElementById('al-menu-demo');
    if (!root) return;
    const panel = root.querySelector('[data-al-drawer]');
    const toggle = root.querySelector('[data-al-open]');
    const close = root.querySelector('[data-al-close]');
    const pagina = root.querySelector('[data-al-current]');
    function abrir(visible) {
      panel.hidden = !visible;
      toggle.setAttribute('aria-expanded', String(visible));
      if (visible) close.focus();
      else toggle.focus();
    }
    toggle.addEventListener('click', () => abrir(true));
    close.addEventListener('click', () => abrir(false));
    panel.querySelectorAll('[data-al-page]').forEach(button => button.addEventListener('click', () => {
      pagina.textContent = button.dataset.alPage;
      abrir(false);
    }));
    root.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !panel.hidden) abrir(false);
    });
  }
  function initForm() {
    const form = document.getElementById('al-validacion-demo');
    if (!form) return;
    const output = form.querySelector('[data-al-form-status]');
    const tests = {
      nombre: s => !s.trim() ? 'El nombre es obligatorio' : s.trim().length < 3 ? 'Mínimo 3 caracteres' : s.trim().length > 60 ? 'Máximo 60 caracteres' : '',
      anio: s => !/^\d+$/.test(s.trim()) ? 'Usa un año entero' : Number(s) < 1900 || Number(s) > new Date().getFullYear()+1 ? 'Año fuera de rango' : '',
      precio: s => !s.trim() || !Number.isFinite(Number(s)) || Number(s) <= 0 ? 'Ingresa un precio mayor que cero' : '',
      correo: s => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim()) ? 'Correo inválido' : ''
    };
    function validar(control) {
      const error = tests[control.name](control.value);
      const label = form.querySelector('[data-al-error="'+control.name+'"]');
      label.textContent = error;
      control.setAttribute('aria-invalid', String(Boolean(error)));
      return !error;
    }
    form.querySelectorAll('input').forEach(input => input.addEventListener('input', () => {
      if (input.dataset.alTouched === 'true') validar(input);
    }));
    form.querySelectorAll('input').forEach(input => input.addEventListener('blur', () => {
      input.dataset.alTouched = 'true';
      validar(input);
    }));
    form.addEventListener('submit', event => {
      event.preventDefault();
      const inputs = Array.from(form.querySelectorAll('input'));
      const allOk = inputs.map(input => {input.dataset.alTouched='true';return validar(input);}).every(Boolean);
      output.textContent = allOk
        ? 'Validación correcta. Flutter ya podría emitir VehiculoGuardado.'
        : 'Hay campos pendientes. No se enviaría el evento hasta corregirlos.';
      if (!allOk) inputs.find(input=>input.getAttribute('aria-invalid')==='true')?.focus();
    });
  }
  function initHttp() {
    const root = document.getElementById('al-api-demo');
    if (!root) return;
    const request = root.querySelector('[data-al-request]');
    const response = root.querySelector('[data-al-response]');
    const examples = {
      get: ['GET /vehiculos\nSin cuerpo JSON', '200 OK\n[\n  { "id": 1, "nombre": "Renault 9",\n    "anio": 1994, "precio": 12000000.5,\n    "correo": "cliente@ejemplo.com",\n    "disponible": true }\n]'],
      post: ['POST /vehiculos\n{\n  "nombre": "Renault 9",\n  "anio": 1994,\n  "precio": 12000000.5,\n  "correo": "cliente@ejemplo.com",\n  "disponible": true\n}', '201 Created\n{ "id": 1, "nombre": "Renault 9", ... }'],
      put: ['PUT /vehiculos/1\n{\n  "nombre": "Renault 21",\n  "anio": 1994,\n  "precio": 12000000.5,\n  "correo": "cliente@ejemplo.com",\n  "disponible": true\n}', '200 OK\n{ "id": 1, "nombre": "Renault 21", ... }'],
      delete: ['DELETE /vehiculos/1\nSin cuerpo JSON', '204 No Content\n(Cuerpo vacío)']
    };
    root.querySelectorAll('[data-al-method]').forEach(button => button.addEventListener('click', () => {
      root.querySelectorAll('[data-al-method]').forEach(x=>x.setAttribute('aria-pressed',String(x===button)));
      const [a,b] = examples[button.dataset.alMethod];
      request.textContent = a;
      response.textContent = b;
    }));
    root.querySelector('[data-al-method="get"]')?.click();
  }
  function init() {initMenu();initForm();initHttp();}
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});else init();
})();
