import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';

const read=(path)=>readFileSync(new URL('../'+path,import.meta.url),'utf8').replace(/\r\n/g,'\n');
const html=read('index.html');
const app=read('assets/app.js');
const js=read('assets/widget-catalog.js');
const lesson=read('etapas/paso_17b_paginacion_local.dart');
const demo=read('assets/paginacion-local-demo.js');
assert.ok(app.includes("'paginacion-local'"),'P10.1 debe ser navegable');
const ids=['validaciones-esenciales','paginacion-local','api-postgres'];
const locate=(id)=>html.indexOf('<section class="page lesson next-module advanced-module" id="'+id+'"');
const positions=ids.map(locate);
assert.ok(positions.every(x=>x>=0),'Falta una de las lecciones');
assert.ok(positions[0]<positions[1]&&positions[1]<positions[2],'P10.1 debe quedar entre validaciones y API');
const sidebar=[...html.matchAll(/<a\s+class="nav-link"[^>]*data-route="([^"]+)"/g)].map(x=>x[1]);
assert.ok(sidebar.indexOf('paginacion-local')===sidebar.indexOf('validaciones-esenciales')+1,
  'P10.1 debe aparecer inmediatamente despues de validaciones');
const region=html.slice(positions[1],positions[2]);
assert.equal([...region.matchAll(/id="pl-local-paso-\d+"/g)].length,7,'P10.1 tiene siete pasos');
for (const value of ["paginaActual = 1","registrosPorPagina = 5","skip(inicio)","take(registrosPorPagina)","ListView.builder(","NeverScrollableScrollPhysics","cambiarPagina","BusquedaCambiada"]) {
 assert.ok(lesson.includes(value),'Falta en Dart: '+value);
}
const enc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
assert.ok(region.includes('<code>'+enc(lesson)+'</code>'),'Código completo P10.1 desactualizado en HTML');
for(const prop of ['selectedIndex: indicePestana','drawer: Drawer(','TextFormField(','BlocBuilder<VehiculosBloc, VehiculosEstado>','indexOf(vehiculo)']) {
 assert.ok(lesson.includes(prop),'P10.1 pierde '+prop);
}
for(const id of ['catalog-page-size','catalog-range','catalog-pagination-top','catalog-pagination-bottom','paginacion-local-demo']) {
 assert.ok(html.includes('id="'+id+'"'),'Falta control '+id);
}
assert.ok(html.includes('href="#paginacion-local">Siguiente: paginación local de ListView'));
assert.ok(region.includes('href="#api-postgres"'));
assert.ok(html.includes('./assets/catalog-pagination.css'));
assert.ok(html.includes('./assets/paginacion-local-demo.js'));
assert.doesNotThrow(()=>new Script(js), 'JS de catálogo sintácticamente válido');
assert.doesNotThrow(()=>new Script(demo), 'Simulador sintácticamente válido');
for(const token of ['visible.map(w=>','matches.slice(start,end)','currentPage=1','paginationControls','pageSizeSelect','pageCount','renderPagination']) {
 assert.ok(js.includes(token),'Lógica de paginación ausente: '+token);
}
console.log('PAGINACIÓN APROBADA: P10.1 en ruta, código Dart, botones, filtros, catálogo y simulador.');
