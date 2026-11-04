
/* Vista previa educativa: simula las condiciones sin ejecutar Flutter. */
(() => {
  'use strict';
  function iniciarCondicionales() {
    const root = document.getElementById('condicionales-lab');
    if (!root) return;
    const stock = root.querySelector('#condicional-stock');
    const rol = root.querySelector('#condicional-rol');
    const valor = root.querySelector('[data-condicional-valor]');
    const estado = root.querySelector('[data-condicional-estado]');
    const acciones = root.querySelector('[data-condicional-acciones]');
    const trazas = root.querySelector('[data-condicional-trazas]');
    if (!stock || !rol || !valor || !estado || !acciones || !trazas) return;
    function agregarBoton(titulo) {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.disabled = true;
      boton.textContent = titulo;
      acciones.appendChild(boton);
    }
    function actualizar() {
      const unidades = Number(stock.value);
      const perfil = rol.value;
      valor.textContent = String(unidades);
      acciones.replaceChildren();
      if (unidades > 0) {
        estado.textContent = 'Vehículo disponible (' + unidades + ')';
        estado.dataset.available = 'true';
      } else {
        estado.textContent = 'Vehículo agotado';
        estado.dataset.available = 'false';
      }
      if (perfil === 'admin') {
        agregarBoton('Agregar vehículo');
      } else if (perfil === 'vendedor' && unidades > 0) {
        agregarBoton('Registrar venta');
      } else if (perfil === 'cliente' && unidades > 0) {
        agregarBoton('Comprar');
      }
      if (!acciones.childNodes.length) {
        const aviso = document.createElement('span');
        aviso.className = 'conditions-empty';
        aviso.textContent = 'No hay acciones disponibles con estas condiciones.';
        acciones.appendChild(aviso);
      }
      const stockCondicion = unidades > 0 ? 'true' : 'false';
      trazas.textContent = 'stock > 0: ' + stockCondicion + ' · rol: ' + perfil;
    }
    stock.addEventListener('input', actualizar);
    rol.addEventListener('change', actualizar);
    actualizar();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarCondicionales);
  } else {
    iniciarCondicionales();
  }
})();
