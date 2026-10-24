import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8').replace(/\r\n/g,'\n');
const html=read('index.html');
const app=read('assets/app.js');
const before=read('etapas/paso_17b_paginacion_local.dart');
const p102=read('etapas/mejoras_p102/lib/main.dart');
const p103=read('etapas/mejoras_p103/lib/main.dart');
const api=read('ejemplo_api_postgres/flutter/lib/main.dart');
const roles=read('ejemplo_roles_paginacion/flutter/lib/main.dart');
const vista=read('ejemplo_roles_paginacion/flutter/lib/widgets/vista_vehiculos.dart');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const order=['paginacion-local','mejoras-favoritos','mejoras-panel','api-postgres','roles-usuarios','paginacion-widget'];
for(let i=0;i<order.length;i++){
  const cur=html.indexOf('id="'+order[i]+'"',html.indexOf('<main'));
  const next=i<order.length-1?html.indexOf('id="'+order[i+1]+'"',html.indexOf('<main')):cur+1;
  assert.ok(cur>0&&cur<next,'Secuencia P10.1 -> P13: '+order[i]);
  assert.ok(app.includes("'"+order[i]+"'"),'Falta ruta '+order[i]);
}
const menu=[...html.matchAll(/<a\s+class="nav-link"[^>]*data-route="([^"]+)"/g)].map(m=>m[1]);
for(let i=1;i<=2;i++){
  assert.equal(menu.indexOf(order[i]),menu.indexOf(order[i-1])+1,'P10.2 P10.3 consecutivos');
}
for(const file of [p102,p103,api,roles]){
  assert.ok(file.includes('NavigationBar('),'La barra inferior no debe desaparecer');
  assert.ok(file.includes('Drawer('),'El menú lateral no debe desaparecer');
  assert.ok(file.includes('ListView')||file.includes('VistaVehiculos'),'El inventario debe mantener la vista de datos');
  assert.ok(file.includes('Bloc'),'Se conserva BLoC en todas las etapas');
}
for(const term of ['paginaActual','registrosPorPagina','ListView.builder(']){
  assert.ok(before.includes(term)&&p102.includes(term)&&p103.includes(term)&&api.includes(term),'Paginación local perdida: '+term);
}
for(const term of ['ChoiceChip(','OrdenVehiculos','FavoritoAlternado','DisponibilidadAlternada','PopupMenuButton<String>','guardarVehiculo()']){
  assert.ok(p102.includes(term)&&p103.includes(term)&&api.includes(term),'Mejora perdida antes de P11: '+term);
}
for(const term of ['TarjetaIndicador(','LinearProgressIndicator(','SnackBarAction(','AlertDialog(','VehiculoRestaurado(']){
  assert.ok(p103.includes(term)&&api.includes(term),'Dashboard o Undo perdido en P11: '+term);
}
const bloc18=read('etapas/mejoras_p102/lib/bloc/vehiculos_bloc.dart');
const bloc19=read('etapas/mejoras_p103/lib/bloc/vehiculos_bloc.dart');
const blocApi=read('ejemplo_api_postgres/flutter/lib/bloc/vehiculos_bloc.dart');
assert.ok(bloc18.includes('copiarCon('));
assert.ok(bloc18.includes('mantenerEdicion ? state.indiceEnEdicion : indiceEnEdicion'));
assert.ok(bloc19.includes('on<VehiculoRestaurado>'));
assert.ok(blocApi.includes('await api.crear('));
assert.ok(blocApi.includes('_favoritos.add(nuevoId)'));
assert.ok(read('ejemplo_api_postgres/flutter/lib/repositories/vehiculos_api.dart').includes('Future<int> crear('));
for(const term of ['_pantallaLogin','_pantallaTienda','_resumenPagina','NavigationBar(','IndexedStack(','filtroVista','favoritos','ControlesPaginacion(','puedeEditar']){
  assert.ok(roles.includes(term),'P12/P13 debe conservar '+term);
}
assert.ok(vista.includes('alFavorito'));
assert.ok(vista.includes('alCambiarDisponibilidad'));
assert.ok(vista.includes('ListView.builder('));
assert.ok(vista.includes('DataTable('));
assert.ok(read('ejemplo_roles_paginacion/flutter/lib/bloc/vehiculos_bloc.dart').includes('!state.puedeEditar || state.enviando'));
for(const id of ['ux-lab-p102','ux-lab-p103','p102-paso-7','p103-paso-6']){
  assert.ok(html.includes('id="'+id+'"'),'Falta práctica o paso '+id);
}
for(const asset of ['mejoras-acumulativas.css','mejoras-acumulativas-demo.js']){
  assert.ok(html.includes('./assets/'+asset),'Asset no enlazado '+asset);
}
assert.doesNotThrow(()=>new Script(read('assets/mejoras-acumulativas-demo.js')));
assert.ok(html.includes('<code>'+esc(api)+'</code>'),'P11 no sincroniza main.dart con el código real');
assert.ok(html.includes('<code>'+esc(vista)+'</code>'),'P13 no sincroniza VistaVehiculos con referencia completa');
console.log('CONTINUIDAD APROBADA: P10.1 -> P10.2 -> P10.3 -> P11 -> P12/P13; CRUD, navegación, favoritos, roles y paginación.');
