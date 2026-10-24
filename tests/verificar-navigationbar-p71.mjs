import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = name => readFileSync(new URL('../' + name, import.meta.url), 'utf8').replace(/\r\n/g,'\n');
const html = read('index.html');
const app = read('assets/app.js');
const ids = ['navegacion','barra-navegacion','bloc-crud','menu-hamburguesa','validaciones-esenciales'];
const pos = ids.map(id => html.indexOf('id="' + id + '"',html.indexOf('<main')));
assert.ok(pos.every(p=>p>0)&&pos.every((p,i)=>i===0||p>pos[i-1]),'Orden didactico P7, P7.1, P8, P9, P10');
for (const id of ids) {
 assert.ok(app.includes("'"+id+"'"), 'Ruta ausente en app.js: '+id);
 assert.equal([...html.matchAll(new RegExp('data-route="'+id+'"','g'))].length,1,'Sidebar tiene una entrada por ruta '+id);
}
const sidebar = [...html.matchAll(/<a\\s+class="nav-link"[^>]*data-route="([^"]+)"/g)].map(m=>m[1]);
const at = sidebar.indexOf('barra-navegacion');
assert.deepEqual(sidebar.slice(at,at + 4),
  ['barra-navegacion','menu-hamburguesa','validaciones-esenciales','bloc-crud'],
  'P9 y P10 deben aparecer inmediatamente despues de la barra inferior en el menu');
const headerLinks = html.slice(html.indexOf('data-route="navegacion"'), html.indexOf('data-route="api-postgres"'));
assert.ok(!headerLinks.includes('nav-group-label'),
  'P7 a P10 deben permanecer en el mismo nivel visual del sidebar');
const segment = (from,to) => html.slice(html.indexOf('<section class="page lesson next-module" id="'+from+'"'),
  html.indexOf('<section class="page lesson next-module" id="'+to+'"'));
const nav = segment('barra-navegacion','bloc-crud');
assert.ok(html.includes('data-complete="barra-navegacion"'));
assert.equal([...nav.matchAll(/id="barra-navegacion-paso-\d+"/g)].length,6);
assert.ok(nav.includes('id="nb-demostracion"'));
for (const x of ['selectedIndex: indicePestana','onDestinationSelected: (indice)','IndexedStack','bottomNavigationBar: NavigationBar','alPresionar: guardarVehiculo']) {
 assert.ok(nav.includes(x),'P7.1 debe enseñar '+x);
}
assert.ok(html.includes('href="#barra-navegacion">Siguiente: crear una barra inferior'));
assert.ok(nav.includes('href="#bloc-crud">Siguiente: BLoC'));
const files = [
  'etapas/paso_14b_navigation_bar.dart',
  'ejemplo_bloc_crud/lib/main.dart',
  'etapas/paso_16_menu_hamburguesa.dart',
  'etapas/paso_17_formulario_validado.dart'
];
const enc = t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
for (const path of files) {
  const src=read(path);
  for(const value of ['NavigationBar(', 'IndexedStack(', 'indicePestana','bottomNavigationBar:','label: \'Resumen\'','label: \'Consejos\'']){
    assert.ok(src.includes(value),path+' no conserva '+value);
  }
  assert.equal([...src.matchAll(/void guardarVehiculo\s*\(/g)].length,1,path+' debe tener una sola funcion de guardado');
  assert.ok(src.includes('ListView.builder('),path+' debe conservar el listado');
  assert.ok(src.includes('onDestinationSelected:'),path+' debe escuchar cambios');
  // Los ejemplos de P7.1, P9 y P10 se publican completos en el HTML.
  if(path!=='ejemplo_bloc_crud/lib/main.dart') {
    assert.ok(html.includes('<code>'+enc(src)+'</code>'),path+' se desincronizo con la guia');
  }
}
for(const path of files.slice(2)){
 assert.ok(read(path).includes('drawer: Drawer('),path+' pierde el Drawer');
}
assert.ok(html.includes('./assets/navigation-bar-demo.js'));
assert.ok(html.includes('./assets/navigation-bar-demo.css'));
assert.ok(read('assets/navigation-bar-demo.js').includes('aria-selected'));
console.log('NAVIGATIONBAR P7.1 / P9 / P10: estructura, rutas, CRUD y ejemplos sincronizados.');
