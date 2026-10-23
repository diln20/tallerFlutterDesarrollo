(() => {
  'use strict';

  function simularRoles() {
    const raiz = document.getElementById('pu-roles-demo');
    if (!raiz) return;
    const accion = raiz.querySelector('[data-pu-accion]');
    const rolActual = raiz.querySelector('[data-pu-rol]');
    const botones = [...raiz.querySelectorAll('[data-pu-rol-elegir]')];
    const visibles = raiz.querySelector('[data-pu-permisos]');
    let rol = 'lector';

    function pintar() {
      rolActual.textContent = rol;
      botones.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.puRolElegir === rol)));
      visibles.replaceChildren();
      const permisos = rol === 'administrador'
        ? ['Consultar', 'Crear', 'Editar', 'Eliminar']
        : ['Consultar'];
      permisos.forEach(p => {
        const span = document.createElement('span');
        span.textContent = p;
        visibles.append(span);
      });
      accion.textContent = 'El servidor reconoce el rol ' + rol +
        '. Los permisos dependen de FastAPI, no del botón seleccionado aquí.';
    }

    botones.forEach(b => b.addEventListener('click', () => {
      rol = b.dataset.puRolElegir;
      pintar();
    }));
    raiz.querySelectorAll('[data-pu-operacion]').forEach(b => b.addEventListener('click', () => {
      const operacion = b.dataset.puOperacion;
      if (rol === 'lector' && operacion !== 'GET') {
        accion.textContent = '403 Forbidden: Lector NO tiene permiso para ' + operacion +
          '. Aunque intente enviar HTTP manualmente, el servidor lo rechaza.';
      } else {
        accion.textContent = '200/201/204: El servidor permite ' + operacion +
          ' para el rol ' + rol + ' (simulación).';
      }
    }));
    pintar();
  }

  function simularPaginacion() {
    const raiz = document.getElementById('pu-paginas-demo');
    if (!raiz) return;
    const nombres = [
      'Renault 9','Renault 21','Mazda 3','Toyota Corolla','Chevrolet Spark',
      'Kia Rio','Nissan March','Volkswagen Gol','Suzuki Swift',
      'Hyundai i10','Ford Fiesta','Fiat Uno','Chevrolet Onix'
    ];
    const autos = nombres.map((nombre, indice) => ({
      id: indice + 1, nombre, anio: 1994 + indice
    }));
    const tamano = raiz.querySelector('[data-pu-tamano]');
    const busqueda = raiz.querySelector('[data-pu-buscar]');
    const tabla = raiz.querySelector('[data-pu-datos]');
    const info = raiz.querySelector('[data-pu-info]');
    const antes = raiz.querySelector('[data-pu-anterior]');
    const despues = raiz.querySelector('[data-pu-siguiente]');
    const json = raiz.querySelector('[data-pu-json]');
    const objeto = raiz.querySelector('[data-pu-objeto]');
    let pagina = 1;

    function pintar() {
      const filtro = busqueda.value.trim().toLocaleLowerCase('es');
      const filtrados = autos.filter(a => a.nombre.toLocaleLowerCase('es').includes(filtro));
      const n = Number(tamano.value);
      const cantidad = Math.ceil(filtrados.length / n);
      pagina = Math.max(1, Math.min(pagina, Math.max(1, cantidad)));
      const registros = filtrados.slice((pagina - 1) * n, pagina * n);
      tabla.replaceChildren();
      registros.forEach(auto => {
        const fila = document.createElement('tr');
        [auto.id, auto.nombre, auto.anio].forEach(valor => {
          const td = document.createElement('td');
          td.textContent = String(valor);
          fila.append(td);
        });
        tabla.append(fila);
      });
      if (!registros.length) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.colSpan = 3;
        celda.textContent = 'No hay vehículos coincidentes.';
        fila.append(celda);
        tabla.append(fila);
      }
      antes.disabled = pagina === 1;
      despues.disabled = pagina >= cantidad;
      const inicio = filtrados.length ? (pagina - 1) * n + 1 : 0;
      const fin = filtrados.length ? Math.min(pagina * n, filtrados.length) : 0;
      info.textContent = 'Página ' + pagina + ' de ' + cantidad +
        ' · Mostrando ' + inicio + '–' + fin + ' de ' + filtrados.length;
      json.textContent = JSON.stringify({
        datos: registros, pagina, tamano: n, total: filtrados.length,
        total_paginas: cantidad
      }, null, 2);
      const primero = registros[0];
      objeto.textContent = primero
        ? 'final auto = Vehiculo.fromJson(json);' +
          '\n\nVehiculo(id: ' + primero.id +
          ', nombre: "' + primero.nombre +
          '", anio: ' + primero.anio + ', ...)'
        : 'Lista<Vehiculo> vacía. Mostrar estado sin resultados.';
    }
    antes.addEventListener('click', () => {pagina--; pintar();});
    despues.addEventListener('click', () => {pagina++; pintar();});
    tamano.addEventListener('change', () => {pagina=1; pintar();});
    busqueda.addEventListener('input', () => {pagina=1; pintar();});
    pintar();
  }

  function evaluarHeuristicas() {
    const raiz = document.getElementById('pu-heuristicas-demo');
    if (!raiz) return;
    const inputs = [...raiz.querySelectorAll('input[data-pu-heuristica]')];
    const puntaje = raiz.querySelector('[data-pu-puntaje]');
    const pendientes = raiz.querySelector('[data-pu-pendientes]');
    function pintar() {
      const cumplidas = inputs.filter(i => i.checked);
      puntaje.textContent = cumplidas.length + ' / ' + inputs.length + ' comprobaciones';
      const fallas = inputs.filter(i => !i.checked).map(i => i.dataset.puHeuristica);
      pendientes.textContent = fallas.length
        ? 'Pendientes por corregir: ' + fallas.join('; ') + '.'
        : 'Todas las comprobaciones marcadas. Aún debes probar con usuarios reales.';
    }
    inputs.forEach(i => i.addEventListener('change', pintar));
    pintar();
  }

  function iniciar() {simularRoles();simularPaginacion();evaluarHeuristicas();}
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar, {once:true});
  } else iniciar();
})();
