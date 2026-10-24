/* Laboratorio interactivo Row/Column para la guia FlutterLab. */
(() => {
  'use strict';
  function iniciar() {
    const raiz = document.getElementById('fv-alineacion-lab');
    if (!raiz) return;

    const eje = raiz.querySelector('[data-fv-eje]');
    const principal = raiz.querySelector('[data-fv-principal]');
    const transversal = raiz.querySelector('[data-fv-transversal]');
    const tamano = raiz.querySelector('[data-fv-tamano]');
    const vista = raiz.querySelector('[data-fv-vista]');
    const ejemplo = raiz.querySelector('[data-fv-codigo]');
    const mensaje = raiz.querySelector('[data-fv-explicacion]');
    const ayuda = raiz.querySelector('[data-fv-aviso]');
    const copiar = raiz.querySelector('[data-fv-copiar]');
    const copia = raiz.querySelector('[data-fv-copiado]');

    const justificaciones = {
      start: 'Agrupa los hijos al comienzo del eje principal.',
      end: 'Agrupa los hijos al final del eje principal.',
      center: 'Agrupa los hijos en el centro del eje principal.',
      spaceBetween: 'Deja el mismo espacio libre ENTRE hijos, sin añadirlo en los extremos.',
      spaceAround: 'Deja espacio alrededor de cada hijo; el borde recibe aproximadamente la mitad del hueco interior.',
      spaceEvenly: 'Reparte un espacio libre similar al inicio, entre cada hijo y al final.',
    };
    const ejes = {
      start: 'los alinea junto al inicio del eje transversal',
      end: 'los alinea junto al final del eje transversal',
      center: 'los centra en el eje transversal',
      stretch: 'hace que se extiendan para ocupar el eje transversal disponible',
      baseline: 'alinea las bases tipográficas de textos en Row; en Column se comporta como start',
    };
    const mapPrincipal = {
      start: 'flex-start', end: 'flex-end', center: 'center',
      spaceBetween: 'space-between', spaceAround: 'space-around', spaceEvenly: 'space-evenly',
    };
    const mapTransversal = {
      start: 'flex-start', end: 'flex-end', center: 'center',
      stretch: 'stretch', baseline: 'baseline',
    };

    function actualizar() {
      const tipo = eje.value;
      const valorPrincipal = principal.value;
      const valorTransversal = transversal.value;
      const valorTamano = tamano.value;
      const esFila = tipo === 'Row';
      const chips = [...vista.querySelectorAll('.fv-demo-chip')];
      vista.style.flexDirection = esFila ? 'row' : 'column';
      vista.style.justifyContent = mapPrincipal[valorPrincipal];
      vista.style.alignItems = valorTransversal === 'baseline' && !esFila
        ? 'flex-start' : mapTransversal[valorTransversal];
      vista.style.width = esFila && valorTamano === 'min' ? 'max-content' : '100%';
      vista.style.height = !esFila && valorTamano === 'min' ? 'max-content' : '216px';
      vista.classList.toggle('fv-row-mode', esFila);
      vista.classList.toggle('fv-column-mode', !esFila);
      vista.classList.toggle('fv-stretch-mode', valorTransversal === 'stretch');
      vista.classList.toggle('fv-baseline-mode', esFila && valorTransversal === 'baseline');
      chips.forEach((chip, i) => {
        chip.style.fontSize = esFila && valorTransversal === 'baseline'
          ? ['13px','21px','15px'][i] : '13px';
      });

      const direccion = esFila ? 'horizontal (izquierda a derecha en esta demostración)' : 'vertical (arriba a abajo)';
      const cruzada = esFila ? 'vertical' : 'horizontal';
      const sinEspacio = valorTamano === 'min' && valorPrincipal.startsWith('space');
      mensaje.textContent = tipo + ' tiene eje principal ' + direccion +
        ' y eje transversal ' + cruzada + '. ' +
        justificaciones[valorPrincipal] + ' El valor transversal ' +
        ejes[valorTransversal] + '. ' +
        (valorTamano === 'max'
          ? 'mainAxisSize.max intenta ocupar el espacio máximo permitido por su padre.'
          : 'mainAxisSize.min intenta ocupar solo el espacio requerido por sus hijos.') +
        (sinEspacio ? ' Con tamaño min puede quedar poco espacio libre y casi no apreciarse la separación extra.' : '');
      ayuda.textContent = valorTransversal === 'baseline'
        ? 'baseline requiere también textBaseline: TextBaseline.alphabetic. Se usa sobre todo con Row y textos de distintos tamaños.'
        : 'Simulación CSS educativa: Flutter distribuye sus widgets según las restricciones reales de su padre.';
      ejemplo.textContent = tipo + '(\n' +
        '  mainAxisAlignment: MainAxisAlignment.' + valorPrincipal + ',\n' +
        '  crossAxisAlignment: CrossAxisAlignment.' + valorTransversal + ',\n' +
        '  mainAxisSize: MainAxisSize.' + valorTamano + ',\n' +
        (valorTransversal === 'baseline' ? '  textBaseline: TextBaseline.alphabetic,\n' : '') +
        '  children: const [\n' +
        '    Text("Auto A"),\n' +
        '    Text("Auto B"),\n' +
        '    Text("Auto C"),\n' +
        '  ],\n' +
        ')';
      copia.textContent = '';
    }

    [eje,principal,transversal,tamano].forEach(control => {
      control.addEventListener('change', actualizar);
    });
    copiar.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(ejemplo.textContent);
        copia.textContent = 'Código copiado.';
      } catch (_) {
        copia.textContent = 'Selecciona el bloque de código y cópialo manualmente.';
      }
    });
    actualizar();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar, {once: true});
  } else iniciar();
})();
