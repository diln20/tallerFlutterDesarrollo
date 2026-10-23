/* Simulación local del flujo BLoC, sin Flutter ni servicios externos. */
(() => {
  'use strict';
  const catalogue = ['Renault 9', 'Renault 21', 'Mazda 3', 'Chevrolet Spark'];
  function init() {
    const root = document.getElementById('bloc-demo');
    if (!root) return;
    const input = root.querySelector('#bloc-demo-query');
    const eventOutput = root.querySelector('#bloc-demo-event');
    const stateOutput = root.querySelector('#bloc-demo-state');
    const list = root.querySelector('#bloc-demo-results');
    if (!input || !eventOutput || !stateOutput || !list) return;
    let changed = false;
    function render() {
      const typed = input.value;
      const query = typed.trim().toLowerCase();
      const matches = catalogue.filter(name => name.toLowerCase().includes(query));
      eventOutput.textContent = changed
        ? 'BusquedaTextoCambiado(' + JSON.stringify(typed) + ')'
        : 'Ninguno · estado inicial';
      stateOutput.textContent = 'BusquedaEstado: texto=' + JSON.stringify(typed) +
        ' · ' + matches.length + (matches.length === 1 ? ' resultado' : ' resultados');
      list.replaceChildren();
      if (!matches.length) {
        const li = document.createElement('li');
        li.textContent = 'No se encontraron vehículos.';
        list.append(li);
      } else {
        for (const name of matches) {
          const li = document.createElement('li');
          li.textContent = name;
          list.append(li);
        }
      }
    }
    input.addEventListener('input', () => {
      changed = true;
      render();
    });
    root.querySelectorAll('button[data-bloc-try]').forEach(button => {
      button.addEventListener('click', () => {
        input.value = button.dataset.blocTry ?? '';
        changed = true;
        render();
        input.focus();
      });
    });
    render();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once: true});
  } else {
    init();
  }
})();
