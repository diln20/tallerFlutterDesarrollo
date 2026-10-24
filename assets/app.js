/* FlutterLab: navegación, ayudas de código y progreso en el propio navegador. */
(() => {
  'use strict';

  const ROUTES = [
    'inicio', 'preparacion', 'punto-entrada', 'estructura', 'diseno',
    'campo-texto', 'proyecto', 'carpetas', 'reutilizacion', 'validacion',
    'objeto', 'crud', 'extraccion', 'navegacion', 'barra-navegacion', 'bloc-crud', 'menu-hamburguesa', 'validaciones-esenciales', 'paginacion-local', 'api-postgres', 'roles-usuarios', 'paginacion-widget', 'heuristicas-ux', 'responsive', 'estado', 'formularios', 'bloc', 'catalogo-widgets'
  ];
  const LESSONS = ROUTES.filter((route) => route !== 'inicio' && route !== 'catalogo-widgets');
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

  // Un hash puede apuntar al modulo completo (#diseno) o a un apartado
  // interior (#etiqueta-debug, #bloc-practica, #crud-paso-1, etc.).
  // En ambos casos mostramos su pagina padre antes de desplazar la vista.
  function hashId() {
    let id = window.location.hash.replace(/^#/, '');
    try { id = decodeURIComponent(id); } catch (_) { id = ''; }
    return id;
  }

  function currentHashRoute() {
    const id = hashId();
    if (ROUTES.includes(id)) return id;
    const target = document.getElementById(id);
    const parent = target?.closest('main .page');
    if (parent && ROUTES.includes(parent.id)) return parent.id;
    return 'inicio';
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
      const id = hashId();
      const anchor = document.getElementById(id);
      const anchorPage = anchor?.closest('main .page');
      const isInternalAnchor = anchor &&
        ((anchorPage?.id === route && id !== route) || id === 'contenido');

      if (isInternalAnchor) {
        // El enlace directo funciona incluso si el alumno ya esta en la
        // misma pagina; antes los hashes internos volvian a Inicio.
        window.requestAnimationFrame(() => {
          anchor.scrollIntoView({block: 'start'});
          if (withFocus && anchor.matches('h1,h2,h3,h4')) {
            anchor.setAttribute('tabindex', '-1');
            anchor.focus({preventScroll: true});
          }
        });
      } else if (wasChanged) {
        window.scrollTo(0, 0);
        if (withFocus && heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus({preventScroll: true});
        }
      }
    }
    setMenuOpen(false);
  }


  // Resaltado de sintaxis de Dart y PowerShell sin dependencias externas.
  // Conserva el texto original para que el botón Copiar siga funcionando.
  const DART_KEYWORDS = new Set([
    'abstract','as','assert','async','await','break','case','catch','class',
    'const','continue','covariant','default','deferred','do','dynamic','else',
    'enum','export','extends','extension','external','factory','false','final',
    'finally','for','get','hide','if','implements','import','in','is','late',
    'library','mixin','new','on','operator','part','required','rethrow','return',
    'set','show','static','super','switch','sync','this','throw','true','try',
    'typedef','var','void','while','with','yield'
  ]);
  const DART_LITERALS = new Set(['true','false','null']);
  const DART_TYPES = new Set(['int','double','num','bool','String','Object','dynamic','Never']);
  const DART_TOKEN = /\/\/[^\r\n]*|\/\*[\s\S]*?\*\/|r?'''[\s\S]*?'''|r?"""[\s\S]*?"""|r?'(?:\\.|[^'\\])*'|r?"(?:\\.|[^"\\])*"|@[A-Za-z_]\w*|\b\d+(?:\.\d+)?\b|[A-Za-z_$][A-Za-z_$0-9]*|=>|\?\.|\?\?|&&|\|\||==|!=|<=|>=|[{}()[\],.;:=<>]/g;
  const SHELL_TOKEN = /#[^\r\n]*|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|(?:Get|Test|Set|New|Remove|Write)-[A-Za-z]+|\B--?[A-Za-z][\w-]*|\b\d+(?:\.\d+)?\b|[A-Za-z_][\w-]*/g;
  const SHELL_COMMANDS = new Set(['flutter','dart','cd','Get-Location','Get-ChildItem','Test-Path','Set-Location','Write-Host']);

  function syntaxLanguage(pre, source) {
    const mode = pre.dataset.codeMode;
    if (['python', 'yaml', 'json', 'xml', 'plain'].includes(mode)) return 'plain';
    if (['terminal', 'shell', 'powershell'].includes(mode)) return 'shell';
    if (mode === 'dart') return 'dart';
    const label = pre.previousElementSibling?.classList.contains('code-label')
      ? pre.previousElementSibling.textContent.toLocaleLowerCase('es')
      : '';
    if (/esquema|diagrama|jerarquía|orden de cierres|correspondencia|visualización/i.test(label) ||
        /[├└│─→]/.test(source)) return 'plain';
    if (/powershell|terminal|comandos?|diagnóstico/i.test(label) ||
        /^\s*(?:flutter\s+(?:run|doctor|devices|pub|create|analyze)|dart\s+|cd\s+|Get-Location\b|Get-ChildItem\b|Test-Path\b)/m.test(source)) return 'shell';
    return 'dart';
  }

  function classifyDart(token, source, end) {
    if (token.startsWith('//') || token.startsWith('/*')) return 'comment';
    if (/^(?:r?['"])/.test(token)) return 'string';
    if (token.startsWith('@')) return 'annotation';
    if (/^\d/.test(token)) return 'number';
    if (DART_LITERALS.has(token)) return 'literal';
    if (DART_KEYWORDS.has(token)) return 'keyword';
    if (DART_TYPES.has(token) || /^[A-Z][A-Za-z_$0-9]*$/.test(token)) return 'type';
    if (/^[A-Za-z_$]/.test(token)) {
      const next = source.slice(end).match(/^\s*(.)/)?.[1];
      if (next === ':') return 'property';
      if (next === '(') return 'function';
      return '';
    }
    return 'punctuation';
  }

  function classifyShell(token) {
    if (token.startsWith('#')) return 'comment';
    if (token.startsWith("'") || token.startsWith('"')) return 'string';
    if (token.startsWith('-')) return 'property';
    if (/^\d/.test(token)) return 'number';
    if (SHELL_COMMANDS.has(token)) return 'function';
    return '';
  }

  function colorizeCode(element, language) {
    if (!element || element.dataset.highlighted === 'true' || language === 'plain') return;
    const original = element.textContent;
    const tokens = language === 'shell' ? SHELL_TOKEN : DART_TOKEN;
    tokens.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    let match;

    while ((match = tokens.exec(original)) !== null) {
      if (match.index > cursor) {
        fragment.appendChild(document.createTextNode(original.slice(cursor, match.index)));
      }
      const value = match[0];
      const category = language === 'shell'
        ? classifyShell(value)
        : classifyDart(value, original, tokens.lastIndex);
      if (category) {
        const colored = document.createElement('span');
        colored.className = 'syntax-' + category;
        colored.textContent = value;
        fragment.appendChild(colored);
      } else {
        fragment.appendChild(document.createTextNode(value));
      }
      cursor = tokens.lastIndex;
    }
    if (cursor < original.length) {
      fragment.appendChild(document.createTextNode(original.slice(cursor)));
    }

    element.replaceChildren(fragment);
    element.dataset.highlighted = 'true';
    element.dataset.language = language;
  }

  function installSyntaxHighlighting() {
    document.querySelectorAll('pre.code-block > code').forEach((code) => {
      colorizeCode(code, syntaxLanguage(code.parentElement, code.textContent));
    });
    document.querySelectorAll('.source-walkthrough code.line-code').forEach((code) => {
      colorizeCode(code, 'dart');
    });
  }

  function installCopyButtons() {
    document.querySelectorAll('pre.code-block').forEach((pre) => {
      if (pre.dataset.codeReadonly === 'true') {
        pre.querySelector('button.copy-button')?.remove();
        return;
      }
      if (pre.querySelector('button.copy-button')) return;
      const code = pre.querySelector('code');
      if (!code) return;

      pre.classList.add('has-button');
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.type = 'button';
      const isFirstForm = Boolean(pre.closest('#proyecto, [data-pv-module="proyecto"]'));
      const copyLabel = isFirstForm ? 'Copiar código' : 'Copiar';
      button.setAttribute('aria-label', isFirstForm
        ? 'Copiar el bloque completo de código de esta etapa'
        : 'Copiar este ejemplo de código');
      button.textContent = copyLabel;
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
        window.setTimeout(() => { button.textContent = copyLabel; }, 1800);
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

  document.addEventListener('flutterlab:catalog-code', () => {
    installSyntaxHighlighting();
    installCopyButtons();
  });
  installSyntaxHighlighting();
  installCopyButtons();
  initChecklistStorage();
  initNavigationSearch();
  initTheme();
  renderProgress();
  switchPage(false);
  window.addEventListener('hashchange', () => switchPage(true));
})();