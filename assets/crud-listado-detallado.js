/* Ejercicio local de P5.1: enseña itemCount, índice y ListTile sin sustituir Flutter. */
(() => {
  'use strict';
  const datos = [
    {nombre: 'Renault 9', disponible: true},
    {nombre: 'Mazda 3', disponible: false},
    {nombre: 'Chevrolet Spark', disponible: true},
  ];
  function iniciar() {
    const lab = document.getElementById('crud-list-lab');
    if (!lab) return;
    const controles = [...lab.querySelectorAll('[data-crud-quantity]')];
    const source = lab.querySelector('[data-crud-source]');
    const output = lab.querySelector('[data-crud-output]');
    const count = lab.querySelector('[data-crud-count]');
    const hint = lab.querySelector('[data-crud-hint]');
    const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    })[character]);

    const mostrar = cantidad => {
      const elementos = datos.slice(0,cantidad);
      controles.forEach(control => control.setAttribute('aria-pressed',
        String(Number(control.dataset.crudQuantity)===cantidad)));
      source.innerHTML = elementos.length
        ? elementos.map((v,i) => '<code>vehiculos['+i+'] → '+escapeHtml(v.nombre)+'</code>').join('')
        : '<code>vehiculos = []</code>';
      count.textContent = 'vehiculos.length = '+cantidad+' → itemCount: '+cantidad;
      output.innerHTML = elementos.length
        ? elementos.map((v,i) =>
          '<div class="crud-list-lab-row"><span class="crud-list-lab-index">índice '+i+'</span>' +
          '<div><strong>'+escapeHtml(v.nombre)+'</strong><small>'+(v.disponible?'Disponible':'No disponible')+'</small></div></div>'
        ).join('')
        : '<p class="crud-list-lab-empty">No hay filas. itemBuilder no recibe índices porque itemCount vale 0.</p>';
      hint.textContent = cantidad === 0
        ? 'La lista está vacía. Después de pulsar Agregar vehículo, setState puede volver a dibujarla.'
        : 'Flutter solicita índices de 0 a '+(cantidad-1)+'. Para cada índice se busca vehiculos[indice] y se devuelve un ListTile.';
    };
    controles.forEach(control => control.addEventListener('click',() => {
      mostrar(Number(control.dataset.crudQuantity));
    }));
    mostrar(0);
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',iniciar,{once:true});
  else iniciar();
})();
