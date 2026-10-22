/* FlutterLab: catalogo didactico ampliado. Complementa widget-catalog.js sin reemplazarlo. */
(() => {
  'use strict';
  const dialog = document.getElementById('widget-detail');
  const data = window.FlutterLabWidgetData || [];
  if (!dialog || !data.length) return;
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  const examples = {
    key:"const ValueKey('item-1')", title:"const Text('Mi Tienda')",
    subtitle:"const Text('Descripción')", leading:"const Icon(Icons.menu)",
    trailing:"const Icon(Icons.chevron_right)",
    actions:"[IconButton(onPressed: () {}, icon: const Icon(Icons.search))]",
    child:"const Text('Hola')", children:"[const Text('Uno'), const Text('Dos')]",
    backgroundColor:"Colors.indigo", foregroundColor:"Colors.white",
    color:"Colors.blue", fillColor:"Colors.blue.shade50",
    shadowColor:"Colors.black26", surfaceTintColor:"Colors.transparent",
    shape:"const RoundedRectangleBorder()", borderRadius:"BorderRadius.circular(12)",
    padding:"const EdgeInsets.all(16)", margin:"const EdgeInsets.all(12)",
    minimum:"const EdgeInsets.all(8)", alignment:"Alignment.center",
    mainAxisAlignment:"MainAxisAlignment.center", crossAxisAlignment:"CrossAxisAlignment.start",
    mainAxisSize:"MainAxisSize.min", textAlign:"TextAlign.center",
    width:"200.0", height:"60.0", toolbarHeight:"56.0", elevation:"2.0",
    leadingWidth:"56.0", titleSpacing:"16.0", actionsPadding:"const EdgeInsets.all(8)",
    centerTitle:"true", automaticallyImplyLeading:"true", automaticallyImplyActions:"true",
    opacity:"0.7", spacing:"12.0", runSpacing:"8.0", flex:"2",
    icon:"const Icon(Icons.star)", iconSize:"24.0", radius:"20.0", size:"28.0",
    maxLines:"2", minLines:"1", fit:"BoxFit.cover", style:"const TextStyle(fontSize: 18)",
    titleTextStyle:"const TextStyle(fontSize: 20)",
    duration:"const Duration(milliseconds: 300)", curve:"Curves.easeInOut",
    constraints:"const BoxConstraints(maxWidth: 400)",
    onPressed:"() {}", onTap:"() {}", onLongPress:"() {}",
    onDoubleTap:"() {}", onChanged:"(valor) {}", onSelected:"(valor) {}",
    onSaved:"(valor) {}", onSubmitted:"(texto) {}", onFocusChange:"(activo) {}",
    validator:"(v) => v == null || v.isEmpty ? 'Requerido' : null",
    tooltip:"'Buscar'", label:"const Text('Guardar')",
    decoration:"const InputDecoration(labelText: 'Nombre')",
    keyboardType:"TextInputType.text", obscureText:"false",
    controller:"TextEditingController()", enabled:"true", autofocus:"false",
    value:"true", selected:"true", selectedIndex:"0", currentIndex:"0", currentStep:"0",
    divisions:"10", max:"100.0", min:"0.0", itemCount:"10",
    itemBuilder:"(context, index) => Text('Fila $index')",
    scrollDirection:"Axis.vertical", physics:"const BouncingScrollPhysics()",
    content:"const Text('Contenido de ejemplo')",
    text:"'Hola Flutter'", data:"'Renault'",
    appBar:"AppBar(title: const Text('Inicio'))",
    body:"const Center(child: Text('Hola'))",
    bottomNavigationBar:"const NavigationBar(destinations: [NavigationDestination(icon: Icon(Icons.home), label: 'Inicio')])",
    onStepContinue:"() {}", onStepCancel:"() {}",
    onDismissed:"(direccion) {}", onReorder:"(anterior, nuevo) {}",
    autovalidateMode:"AutovalidateMode.onUserInteraction"
  };
  const overrides = {
    AboutDialog:{
      applicationName:"'Mi Tienda Flutter'", applicationVersion:"'1.0.0'",
      applicationIcon:"const Icon(Icons.store, size: 32)",
      children:"[const Text('Aplicación de ejemplo para Flutter')]"
    },
    AppBar:{title:"const Text('Mi Tienda')",backgroundColor:"Colors.indigo"},
    Slider:{value:"60.0"},
    CupertinoSlider:{value:"60.0"},
    TextField:{decoration:"const InputDecoration(labelText: 'Buscar vehículo')"},
    TextFormField:{decoration:"const InputDecoration(labelText: 'Modelo')"}
  };
  function sample(widget, name, type) {
    if (overrides[widget.name] && overrides[widget.name][name]) return overrides[widget.name][name];
    if (Object.prototype.hasOwnProperty.call(examples, name)) return examples[name];
    const t = String(type || '').replace(/\?/g, '');
    if (/^List<Widget/.test(t)) return "[const Text('Elemento')]";
    if (/^List<Tab/.test(t)) return "[const Tab(text: 'Inicio')]";
    if (/^List<Step/.test(t)) return "[const Step(title: Text('Paso'), content: Text('Detalle'))]";
    if (/^List</.test(t)) return "[]";
    if (/^(Widget|PreferredSizeWidget)/.test(t)) return "const Text('Ejemplo')";
    if (/Color/.test(t)) return "Colors.indigo";
    if (/EdgeInsets/.test(t)) return "const EdgeInsets.all(12)";
    if (/Alignment/.test(t)) return "Alignment.center";
    if (/TextStyle/.test(t)) return "const TextStyle(fontSize: 16)";
    if (/BorderRadius/.test(t)) return "BorderRadius.circular(12)";
    if (/Duration/.test(t)) return "const Duration(milliseconds: 300)";
    if (/^bool/.test(t)) return "true";
    if (/^int/.test(t)) return "0";
    if (/^(double|num)/.test(t)) return "16.0";
    if (/^String/.test(t)) return "'Ejemplo'";
    if (/^VoidCallback/.test(t)) return "() {}";
    if (/^ValueChanged</.test(t)) return "(valor) {}";
    if (/^Axis$/.test(t)) return "Axis.vertical";
    if (/^Curve$/.test(t)) return "Curves.easeInOut";
    return "Ver documentación";
  }
  function addValues(table, widget) {
    if (!table || table.querySelector('.wc-value-head')) return;
    const head = table.querySelector('thead tr');
    if (!head || head.children.length !== 3) return;
    const th = document.createElement('th');
    th.textContent = 'Valor de ejemplo';
    th.className = 'wc-value-head';
    th.scope = 'col';
    head.children[1].after(th);
    Array.from(table.querySelectorAll('tbody tr')).forEach((row, i) => {
      if (row.children.length !== 3 || !widget.properties[i]) return;
      const td = document.createElement('td');
      td.className = 'wc-value-cell';
      const code = document.createElement('code');
      code.textContent = sample(widget, widget.properties[i][0], widget.properties[i][1]);
      td.append(code);
      row.children[1].after(td);
    });
  }
  function fullProgram(widget) {
    const name = widget.name;
    if (name === 'AboutDialog') return [
      "import 'package:flutter/material.dart';", '',
      'void main() => runApp(const MiApp());', '',
      'class MiApp extends StatelessWidget {',
      '  const MiApp({super.key});', '',
      '  @override',
      '  Widget build(BuildContext context) {',
      '    return const MaterialApp(home: Inicio());',
      '  }',
      '}', '',
      'class Inicio extends StatelessWidget {',
      '  const Inicio({super.key});', '',
      '  @override',
      '  Widget build(BuildContext context) {',
      '    return Scaffold(',
      "      appBar: AppBar(title: const Text('AboutDialog')),",
      '      body: Center(',
      '        child: ElevatedButton(',
      "          child: const Text('Mostrar información'),",
      '          onPressed: () => showDialog<void>(',
      '            context: context,',
      '            builder: (context) => const AboutDialog(',
      "              applicationName: 'Mi Tienda Flutter',",
      "              applicationVersion: '1.0.0',",
      '              applicationIcon: Icon(Icons.store, size: 32),',
      "              children: [Text('Aplicación para aprender Flutter.')],",
      '            ),',
      '          ),',
      '        ),',
      '      ),',
      '    );',
      '  }',
      '}'
    ].join('\n');
    if (name === 'AppBar') return [
      "import 'package:flutter/material.dart';", '',
      'void main() => runApp(const MiApp());', '',
      'class MiApp extends StatelessWidget {',
      '  const MiApp({super.key});',
      '  @override',
      '  Widget build(BuildContext context) => MaterialApp(',
      '    home: Scaffold(',
      "      appBar: AppBar(title: const Text('Mi Tienda'), backgroundColor: Colors.indigo),",
      "      body: const Center(child: Text('Bienvenido a la tienda')),",
      '    ),',
      '  );',
      '}'
    ].join('\n');
    if (name === 'TextField') return [
      "import 'package:flutter/material.dart';", '',
      'void main() => runApp(const MaterialApp(home: Inicio()));', '',
      'class Inicio extends StatefulWidget {',
      '  const Inicio({super.key});',
      '  @override',
      '  State<Inicio> createState() => _InicioState();',
      '}', '',
      'class _InicioState extends State<Inicio> {',
      '  final controlador = TextEditingController();',
      '  @override',
      '  void dispose() {',
      '    controlador.dispose();',
      '    super.dispose();',
      '  }',
      '  @override',
      '  Widget build(BuildContext context) => Scaffold(',
      "    appBar: AppBar(title: const Text('TextField')),",
      '    body: Padding(',
      '      padding: const EdgeInsets.all(20),',
      '      child: TextField(',
      '        controller: controlador,',
      "        decoration: const InputDecoration(labelText: 'Nombre del vehículo'),",
      '      ),',
      '    ),',
      '  );',
      '}'
    ].join('\n');
    return '';
  }
  const dialogs = new Set(['AboutDialog','AlertDialog','SimpleDialog','CupertinoAlertDialog']);
  const feedback = new Set(['SnackBar','BottomSheet','MaterialBanner']);
  function mobileMarkup(widget, preview) {
    const name = widget.name;
    const isPopup = dialogs.has(name) || feedback.has(name);
    const openLabel = name === 'AboutDialog' ? 'Mostrar AboutDialog'
      : name === 'SnackBar' ? 'Mostrar mensaje'
      : name === 'BottomSheet' ? 'Abrir opciones' : 'Mostrar ' + name;
    const content = isPopup
      ? '<button class="wc-mobile-action" type="button" data-phone-open>' + esc(openLabel) + '</button>'
      : preview;
    const popupTitle = name === 'AboutDialog' ? 'Mi Tienda Flutter' :
      name === 'BottomSheet' ? 'Opciones disponibles' : name === 'SnackBar' ? 'Vehículo agregado' : name;
    const popupMessage = name === 'AboutDialog'
      ? 'Versión 1.0.0 · Aplicación para aprender Flutter.'
      : name === 'BottomSheet' ? 'Editar · Compartir · Eliminar'
      : 'Ejemplo ilustrativo del componente en la pantalla.';
    const popup = isPopup
      ? '<div class="wc-phone-overlay" hidden><div class="wc-phone-popup" role="group" aria-label="' + esc(name) + '">' +
        '<div class="wc-phone-popup-icon" aria-hidden="true">◈</div><strong>' + esc(popupTitle) +
        '</strong><p>' + esc(popupMessage) + '</p><button type="button" data-phone-close>Cerrar</button></div></div>'
      : '';
    return '<div class="wc-mobile-heading"><div><small>SIMULACIÓN EN DISPOSITIVO</small><h3>Así se vería en el celular</h3></div>' +
      '<button class="wc-phone-theme" type="button" data-phone-theme aria-pressed="false">Modo oscuro</button></div>' +
      '<div class="wc-phone-stage"><div class="wc-phone-shell"><div class="wc-phone-screen">' +
      '<div class="wc-phone-system"><span>9:41</span><span aria-hidden="true">● ▰</span></div>' +
      '<div class="wc-phone-header"><span aria-hidden="true">‹</span><strong>' + esc(name) +
      '</strong><span aria-hidden="true">⋮</span></div>' +
      '<div class="wc-phone-body">' + content + '</div>' + popup +
      '<div class="wc-phone-home" aria-hidden="true"></div></div></div></div>' +
      '<p class="wc-phone-disclaimer">' +
      (isPopup ? 'Pulsa el botón del teléfono para interactuar. ' : '') +
      'Simulación HTML orientativa, no ejecución real de Flutter.</p>';
  }
  function enhance() {
    const title = dialog.querySelector('#wc-detail-title');
    if (!title || dialog.querySelector('.wc-detail-v2-left')) return;
    const widget = data.find(w => w.name === title.textContent.trim());
    const grid = dialog.querySelector('.wc-detail-grid');
    const visual = dialog.querySelector('.wc-detail-visual');
    const info = dialog.querySelector('.wc-detail-info');
    const example = dialog.querySelector('.wc-detail-example');
    if (!widget || !grid || !visual || !info || !example) return;
    addValues(info.querySelector('.wc-properties-table'), widget);
    const preview = visual.querySelector('.wc-demo');
    const previewHtml = preview ? preview.outerHTML : '<p>Vista de ejemplo</p>';
    const left = document.createElement('div');
    left.className = 'wc-detail-v2-left';
    const right = document.createElement('div');
    right.className = 'wc-detail-v2-right';
    const phone = document.createElement('section');
    phone.className = 'wc-mobile-panel';
    phone.setAttribute('aria-label', 'Ejemplo del widget dentro de un celular');
    phone.innerHTML = mobileMarkup(widget, previewHtml);
    const vt = visual.querySelector('h3');
    if (vt) vt.textContent = 'Vista previa del widget';
    left.append(visual, phone);
    right.append(info, example);
    grid.replaceChildren(left, right);
    grid.classList.add('wc-detail-grid-v2');
    const et = example.querySelector('h3');
    if (et) et.textContent = 'Código básico en Flutter';
    const help = example.querySelector('p');
    if (help) help.textContent = 'Fragmento didáctico que muestra el uso del widget. Algunos ejemplos requieren un controlador, estado o clases auxiliares.';
    const complete = fullProgram(widget);
    if (complete) {
      const details = document.createElement('details');
      details.className = 'wc-full-example';
      const summary = document.createElement('summary');
      summary.textContent = 'Ver aplicación completa para ejecutar';
      const copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'wc-full-copy';
      copy.textContent = 'Copiar aplicación completa';
      const pre = document.createElement('pre');
      pre.className = 'code-block';
      const code = document.createElement('code');
      code.textContent = complete;
      pre.append(code);
      details.append(summary, copy, pre);
      example.append(details);
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.textContent);
          copy.textContent = 'Copiado ✓';
        } catch (_) { copy.textContent = 'Selecciona el código'; }
        setTimeout(() => { copy.textContent = 'Copiar aplicación completa'; }, 1600);
      });
    }
    phone.addEventListener('click', e => {
      const popup = phone.querySelector('.wc-phone-overlay');
      if (e.target.closest('[data-phone-open]') && popup) {
        popup.hidden = false;
        popup.querySelector('[data-phone-close]')?.focus();
      }
      if (e.target.closest('[data-phone-close]') && popup) {
        popup.hidden = true;
        phone.querySelector('[data-phone-open]')?.focus();
      }
      const theme = e.target.closest('[data-phone-theme]');
      if (theme) {
        const active = phone.classList.toggle('wc-phone-dark');
        theme.textContent = active ? 'Modo claro' : 'Modo oscuro';
        theme.setAttribute('aria-pressed', String(active));
      }
      const toggle = e.target.closest('.wc-switch');
      if (toggle) {
        const active = toggle.getAttribute('aria-pressed') !== 'true';
        toggle.setAttribute('aria-pressed', String(active));
        toggle.classList.toggle('is-on', active);
      }
    });
    phone.addEventListener('input', e => {
      if (e.target.matches('input[type="range"]')) {
        const value = phone.querySelector('.wc-slider-value');
        if (value) value.textContent = e.target.value;
      }
    });
    phone.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const popup = phone.querySelector('.wc-phone-overlay');
        if (popup && !popup.hidden) { popup.hidden = true; e.stopPropagation(); }
      }
    });
    if (widget.name === 'AppBar') {
      const sync = () => {
        const src = visual.querySelector('.wc-appbar-sim');
        const dest = phone.querySelector('.wc-appbar-sim');
        if (!src || !dest) return;
        dest.innerHTML = src.innerHTML;
        dest.style.cssText = src.style.cssText;
        dest.classList.toggle('centered', src.classList.contains('centered'));
        dest.style.height = '';
      };
      sync();
      visual.querySelector('.wc-appbar-controls')?.addEventListener('input', () => requestAnimationFrame(sync));
    }
  }
  const observer = new MutationObserver(enhance);
  observer.observe(dialog, { childList:true, subtree:true });
  enhance();
  const intro = document.querySelector('#appbar-properties-table .wc-properties-table');
  const appbar = data.find(w => w.name === 'AppBar');
  if (intro && appbar) addValues(intro, appbar);
})();