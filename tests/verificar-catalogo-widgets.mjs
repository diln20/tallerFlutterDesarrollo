import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext, Script} from 'node:vm';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=read('index.html');
const context={window:{}};
for(const path of ['widgets-core.js','widgets-controls.js','widgets-advanced.js','widgets-collection-extra.js','widgets-catalog-programs.js']){
  const source=read('assets/'+path);
  assert.doesNotThrow(()=>new Script(source,{filename:path}),path+' contiene errores JS');
  runInNewContext(source,context);
}
const widgets=context.window.FlutterLabWidgetData;
assert.equal(widgets.length,167,'La biblioteca debe contener 167 componentes reales');
assert.equal(new Set(widgets.map(w=>w.name)).size,widgets.length,'No debe haber nombres duplicados');
assert.equal(new Set(widgets.map(w=>w.group)).size,11,'La categoría Accesibilidad debe estar integrada');
for(const w of widgets){
  assert.ok(w.name&&w.group&&w.description&&w.example);
  assert.ok(Array.isArray(w.properties)&&w.properties.length>0,w.name+' sin propiedades');
}
for(const name of ['ListView','ListTile','GridView','GridTile','AnimatedList','ExpansionPanelList','CheckboxListTile','SwitchListTile','MenuAnchor','SearchAnchor','Semantics','IndexedStack','Visibility','ListenableBuilder']){
  assert.ok(widgets.find(w=>w.name===name),'Falta el widget '+name);
}
const list=widgets.find(w=>w.name==='ListView');
assert.equal(list.snippetVariants.length,4,'ListView debe incluir los cuatro ejemplos');
for(const term of ['ListView.builder','ListView.separated','Expanded(','itemBuilder:','itemCount:']){
  assert.ok(list.snippetVariants.some(v=>v.code.includes(term)),term+' no explicado en ListView');
}
assert.ok(list.completeExample.includes('dispose()'));
assert.ok(list.completeExample.includes('Expanded('));
assert.ok(list.completeExample.includes('removeAt(indiceReal)'));
assert.ok(list.completeExample.includes('asMap().entries'));
assert.equal(list.completeExample.replace(/\r\n/g,'\n'),read('etapas/catalogo_listview_tienda.dart').replace(/\r\n/g,'\n'));
for(const path of ['assets/widget-catalog.js','assets/widget-catalog-extended.js','assets/widget-catalog-explanations.js','assets/catalog-listview-lab.js']){
  assert.doesNotThrow(()=>new Script(read(path),{filename:path}),path+' inválido');
}
for(const id of ['catalog-listview-lab','wc-lab-source','wc-lab-list','wc-lab-search','wc-lab-new','wc-lab-form','catalog-grid','catalog-sort','catalog-only-favorites','catalog-favorite-count','widget-detail']){
  assert.ok(html.includes('id="'+id+'"'),'Falta el elemento '+id);
}
for(const file of ['widgets-collection-extra.js','widgets-catalog-programs.js','widget-catalog.js','widget-catalog-extended.js','widget-catalog-explanations.js','catalog-listview-lab.js','widget-collection-refresh.css']){
  assert.ok(html.includes('./assets/'+file),'No se incluyó '+file);
}
assert.ok(read('assets/widget-catalog.js').includes("viewMode==='list'"));
assert.ok(read('assets/widget-catalog.js').includes("persist('favoritos'"));
assert.ok(read('assets/widget-catalog-explanations.js').includes('itemBuilder'));
assert.ok(read('assets/catalog-listview-lab.js').includes('records.findIndex(item=>item.id===id)'));
assert.ok(read('assets/widget-catalog-extended.js').includes('widget.completeExample || fullProgram(widget)'));
console.log('CATÁLOGO APROBADO: 167 widgets, 11 categorías, ListView, variantes, accesibilidad y archivos completos.');
