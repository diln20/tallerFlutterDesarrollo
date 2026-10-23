(() => {
  'use strict';
  function iniciar() {
    const caja = document.getElementById('bc-demo');
    if (!caja) return;
    const formulario = caja.querySelector('#bc-demo-form');
    const nombre = caja.querySelector('#bc-demo-nombre');
    const buscar = caja.querySelector('#bc-demo-buscar');
    const guardar = caja.querySelector('#bc-demo-guardar');
    const cancelar = caja.querySelector('#bc-demo-cancelar');
    const lista = caja.querySelector('#bc-demo-lista');
    const evento = caja.querySelector('#bc-demo-evento');
    const estado = caja.querySelector('#bc-demo-estado');
    const mensaje = caja.querySelector('#bc-demo-mensaje');
    const vehiculos = [];
    let indiceEnEdicion = null;
    let ultimoEvento = 'Sin eventos: esperando interacción';
    function informar(texto) { mensaje.textContent = texto; }
    function actualizar(nombreEvento) {
      if (nombreEvento) ultimoEvento = nombreEvento;
      const filtro = buscar.value.trim().toLocaleLowerCase('es');
      const visibles = vehiculos.map((auto, indice) => ({auto, indice})).filter(({auto}) =>
        auto.toLocaleLowerCase('es').includes(filtro));
      evento.textContent = ultimoEvento;
      estado.textContent = 'VehiculosEstado\n  registrados: ' + vehiculos.length +
        '\n  visibles: ' + visibles.length +
        '\n  busqueda: ' + JSON.stringify(buscar.value) +
        '\n  indiceEnEdicion: ' + (indiceEnEdicion === null ? 'null' : indiceEnEdicion);
      guardar.textContent = indiceEnEdicion === null ? 'Agregar vehículo' : 'Guardar cambios';
      cancelar.hidden = indiceEnEdicion === null;
      lista.replaceChildren();
      if (!visibles.length) {
        const li = document.createElement('li');
        li.textContent = vehiculos.length ? 'No hay coincidencias.' : 'Todavía no hay vehículos.';
        lista.append(li);
      } else {
        visibles.forEach(({auto,indice}) => {
          const li = document.createElement('li');
          const texto = document.createElement('strong'); texto.textContent = auto;
          const acciones = document.createElement('span');
          [{nombre:'Editar', accion:'editar'}, {nombre:'Eliminar', accion:'eliminar'}].forEach(({nombre,accion}) => {
            const boton = document.createElement('button');
            boton.type = 'button';
            boton.textContent = nombre;
            boton.className = 'bc-secondary';
            boton.dataset.accion = accion;
            boton.dataset.indice = String(indice);
            boton.setAttribute('aria-label', nombre + ' ' + auto);
            acciones.append(boton);
          });
          li.append(texto,acciones);lista.append(li);
        });
      }
    }
    formulario.addEventListener('submit', e => {
      e.preventDefault();
      const texto = nombre.value.trim();
      if (texto.length < 3) { informar('Escribe un nombre de al menos 3 caracteres.'); return; }
      if (indiceEnEdicion === null) {
        vehiculos.push(texto);
        actualizar('VehiculoGuardado(' + JSON.stringify(texto) + ') · crear');
        informar('Vehículo agregado a la lista en memoria.');
      } else {
        vehiculos[indiceEnEdicion] = texto;
        indiceEnEdicion = null;
        actualizar('VehiculoGuardado(' + JSON.stringify(texto) + ') · editar');
        informar('Nombre actualizado.');
      }
      nombre.value = '';
      nombre.focus();
    });
    cancelar.addEventListener('click', () => {
      indiceEnEdicion = null; nombre.value = '';
      informar('Se canceló la edición.');
      actualizar('EdicionCancelada()');
    });
    buscar.addEventListener('input', () => {
      actualizar('BusquedaCambiada(' + JSON.stringify(buscar.value) + ')');
    });
    lista.addEventListener('click', e => {
      const boton = e.target.closest('button[data-accion]');
      if (!boton) return;
      const indice = Number(boton.dataset.indice);
      if (boton.dataset.accion === 'editar') {
        indiceEnEdicion = indice;
        nombre.value = vehiculos[indice];
        nombre.focus();
        informar('Modifica el nombre y pulsa Guardar cambios.');
        actualizar('EdicionIniciada(' + indice + ')');
      } else {
        vehiculos.splice(indice,1);
        indiceEnEdicion = null; nombre.value = '';
        informar('Vehículo eliminado.');
        actualizar('VehiculoEliminado(' + indice + ')');
      }
    });
    actualizar();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',iniciar,{once:true});
  else iniciar();
})();
