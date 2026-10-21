/* FlutterLab: navegación, ayudas de código y progreso en el propio navegador. */
(() => {
  'use strict';

  const ROUTES = [
    'inicio', 'preparacion', 'punto-entrada', 'estructura', 'diseno',
    'campo-texto', 'responsive', 'estado', 'formularios', 'proyecto', 'bloc'
  ];
  const LESSONS = ROUTES.filter((route) => route !== 'inicio');
  const STORAGE_PREFIX = 'tallerFlutterDesarrollo.v1.';
  const sidebar = document.getElementById('sidebar');
  const menuOpen = document.getElementById('sidebar-open');
  const menuClose = document.getElementById('sidebar-close');
  const overlay = document.getElementById('menu-overlay');
  const navLinks = Array.from(document.querySelectorAll('.nav-link[data-route]'));
  const pages = Array.from(document.querySelectorAll('main .page'));
  const searchInput = document.getElementById('lesson-search');
  const searchEmpty = document.getElementById('no-search-results');
  const crumb = document.getElementById('current-crumb');
  const progressText = document.getElementById('sidebar-progress-text');
  const progressBar = document.getElementById('sidebar-progress-bar');
  const toast = document.getElementById('toast');
  let toastTimeout;
  let currentRoute = null;

  function readValue(key) {
    try { return window.localStorage.getItem(STORAGE_PREFIX + key); }
    catch (_) { return null; }
  }
  function saveValue(key, value) {
    try { window.localStorage.setItem(STORAGE_PREFIX + key, value); }
    catch (_) { /* El navegador puede bloquear almacenamiento. */ }
  }
  function completedLessons() {
    try {
      const data = JSON.parse(readValue('completed') || '[]');
      return Array.isArray(data) ? data.filter((x) => LESSONS.includes(x)) : [];
    } catch (_) { return []; }
  }
  let completed = new Set(completedLessons());

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2400);
  }

  function currentHashRoute() {
    let id = window.location.hash.replace(/^#/, '');
    try { id = decodeURIComponent(id); } catch (_) { id = ''; }
    return ROUTES.includes(id) ? id : 'inicio';
  }

  function setMenuOpen(open) {
    document.body.classList.toggle('menu-opened', open);
    if (overlay) overlay.hidden = !open;
    if (menuOpen) menuOpen.setAttribute('aria-expanded', String(open));
    if (open && menuClose) menuClose.focus();
  }

  function renderProgress() {
    const count = completed.size;
    if (progressText) progressText.textContent = count + ' / ' + LESSONS.length;
    if (progressBar) progressBar.style.width = (count * 100 / LESSONS.length) + '%';

    navLinks.forEach((link) => {
      const route = link.dataset.route;
      link.classList.toggle('done', completed.has(route));
      if (completed.has(route) && route !== 'inicio') {
        link.setAttribute('aria-label', link.querySelectorAll('span')[1]?.textContent.trim() + ' — completado');
      } else {
        link.removeAttribute('aria-label');
      }
    });
    document.querySelectorAll('[data-complete]').forEach((button) => {
      const done = completed.has(button.dataset.complete);
      button.classList.toggle('is-complete', done);
      button.setAttribute('aria-pressed', String(done));
      button.textContent = done ? '✓ Módulo completado · Desmarcar' : 'Marcar módulo como completado';
    });
    document.querySelectorAll('.module-card[href^="#"]').forEach((card) => {
      card.classList.toggle('completed', completed.has(card.getAttribute('href').slice(1)));
    });
  }

  function switchPage(withFocus = true) {
    const route = currentHashRoute();
    const wasChanged = currentRoute !== route;
    currentRoute = route;

    pages.forEach((page) => {
      page.classList.toggle('is-active', page.id === route);
    });
    navLinks.forEach((link) => {
      const active = link.dataset.route === route;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    const page = document.getElementById(route);
    if (page) {
      const heading = page.querySelector('h1');
      const title = heading ? heading.textContent.trim() : 'Inicio';
      if (crumb) crumb.textContent = route === 'inicio' ? 'Inicio' : title;
      document.title = (route === 'inicio' ? 'Flutter en práctica' : title) + ' — Taller de Desarrollo Móvil';
      if (wasChanged) {
        window.scrollTo(0, 0);
        if (withFocus && heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus({preventScroll:true});
        }
      }
    }
    setMenuOpen(false);
  }

  function installCopyButtons() {
    document.querySelectorAll('pre.code-block').forEach((pre) => {
      if (pre.querySelector('button.copy-button')) return;
      const code = pre.querySelector('code');
      if (!code) return;

      pre.classList.add('has-button');
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.type = 'button';
      button.setAttribute('aria-label', 'Copiar este ejemplo de código');
      button.textContent = 'Copiar';
      button.addEventListener('click', async () => {
        const value = code.textContent.replace(/\n$/, '');
        try {
          if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Sin acceso directo');
          await navigator.clipboard.writeText(value);
          button.textContent = 'Copiado ✓';
          showToast('Código copiado al portapapeles');
        } catch (_) {
          // Alternativa para navegadores que no admiten Clipboard API.
          const temp = document.createElement('textarea');
          temp.value = value;
          temp.setAttribute('readonly', '');
          temp.style.position = 'fixed';
          temp.style.opacity = '0';
          document.body.appendChild(temp);
          temp.select();
          let copied = false;
          try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
          temp.remove();
          if (copied) {
            button.textContent = 'Copiado ✓';
            showToast('Código copiado al portapapeles');
          } else {
            showToast('Selecciona el código para copiarlo manualmente');
          }
        }
        window.setTimeout(() => { button.textContent = 'Copiar'; }, 1800);
      });
      pre.appendChild(button);
    });
  }

  function initChecklistStorage() {
    document.querySelectorAll('.checklist[data-checklist]').forEach((group) => {
      const lesson = group.dataset.checklist;
      const key = 'checklist.' + lesson;
      let stored = [];
      try {
        const parsed = JSON.parse(readValue(key) || '[]');
        if (Array.isArray(parsed)) stored = parsed;
      } catch (_) { stored = []; }
      const inputs = Array.from(group.querySelectorAll('input[type="checkbox"]'));
      inputs.forEach((input, index) => {
        input.checked = stored.includes(index);
        input.addEventListener('change', () => {
          const indices = inputs.flatMap((item, i) => item.checked ? [i] : []);
          saveValue(key, JSON.stringify(indices));
        });
      });
    });
  }

  function initNavigationSearch() {
    if (!searchInput) return;
    const headings = Array.from(document.querySelectorAll('.nav-group-label'));
    searchInput.addEventListener('input', () => {
      const needle = searchInput.value.trim().toLocaleLowerCase('es');
      let matches = 0;
      navLinks.forEach((link) => {
        const lesson = document.getElementById(link.dataset.route);
        const lessonText = lesson ? lesson.textContent : '';
        const haystack = ((link.dataset.search || '') + ' ' + link.textContent + ' ' + lessonText).toLocaleLowerCase('es');
        const visible = !needle || haystack.includes(needle);
        link.hidden = !visible;
        if (visible) matches++;
      });
      headings.forEach((heading) => {
        let next = heading.nextElementSibling;
        let hasVisible = false;
        while (next && !next.classList.contains('nav-group-label')) {
          if (next.classList.contains('nav-link') && !next.hidden) hasVisible = true;
          next = next.nextElementSibling;
        }
        heading.hidden = !hasVisible;
      });
      if (searchEmpty) searchEmpty.hidden = matches !== 0;
    });
  }

  function initTheme() {
    const button = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    const apply = (theme) => {
      document.body.dataset.theme = theme;
      if (icon) icon.textContent = theme === 'dark' ? '☀' : '☾';
      if (button) button.setAttribute('aria-label', theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro');
    };
    const saved = readValue('theme');
    apply(saved === 'dark' ? 'dark' : 'light');
    if (button) button.addEventListener('click', () => {
      const newTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(newTheme);
      saveValue('theme', newTheme);
    });
  }

  document.querySelectorAll('[data-complete]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.complete;
      if (!LESSONS.includes(id)) return;
      if (completed.has(id)) completed.delete(id);
      else completed.add(id);
      saveValue('completed', JSON.stringify(Array.from(completed)));
      renderProgress();
      showToast(completed.has(id) ? '¡Bien! Progreso guardado' : 'Módulo desmarcado');
    });
  });

  if (menuOpen) menuOpen.addEventListener('click', () => setMenuOpen(true));
  if (menuClose) menuClose.addEventListener('click', () => {
    setMenuOpen(false);
    menuOpen.focus();
  });
  if (overlay) overlay.addEventListener('click', () => setMenuOpen(false));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('menu-opened')) {
      setMenuOpen(false);
      menuOpen.focus();
      return;
    }
    const tag = event.target && event.target.tagName;
    if (event.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && !event.ctrlKey && !event.metaKey) {
      if (window.matchMedia('(min-width:961px)').matches && searchInput) {
        event.preventDefault();
        searchInput.focus();
      }
    }
  });

  installCopyButtons();
  initChecklistStorage();
  initNavigationSearch();
  initTheme();
  renderProgress();
  switchPage(false);
  window.addEventListener('hashchange', () => switchPage(true));
})();