import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');

const html=read('index.html');
const body=html.slice(html.indexOf('id="crud-paso-4"'),html.indexOf('id="crud-paso-5"'));
const index=html.slice(html.indexOf('id="crud"'),html.indexOf('id="extraccion"'));
const seen=[...body.matchAll(/id="crud-list-concept-(\d+)"/g)].map(m=>Number(m[1]));
assert.deepEqual(seen,[1,2,3,4,5,6,7,8,9],'Orden de nueve conceptos del listado');
for(const part of ['ListView.builder','itemBuilder','itemCount','context','indice','ListTile','title','subtitle','shrinkWrap','NeverScrollableScrollPhysics','Expanded','vehiculos.length']){
  assert.ok(body.includes(part),'Falta explicación de '+part);
}
for(const id of ['crud-listado-detallado','crud-list-lab','crud-listtile-edicion']){
  assert.ok(index.includes('id="'+id+'"'),'Falta '+id);
}
assert.ok(body.indexOf('crud-list-concept-9')<body.indexOf('CÓDIGO COMPLETO DEL PASO 4'),
  'Hay que explicar antes de pedir copiar el código completo.');
assert.ok(body.includes('ListView(children:') && body.includes('No lo añadas al proyecto'), 'La variante ListView está marcada como comparación, no como código para agregar.');
assert.ok(body.includes('itemCount: vehiculos.length'));
assert.ok(body.includes('SingleChildScrollView'));
assert.ok(body.includes('CÓDIGO COMPLETO DEL PASO 4'));
assert.ok(index.includes('etapas/paso_12b_crud.dart'));
for(const file of ['etapas/paso_12b_crud.dart','etapas/paso_13_extraccion.dart','etapas/paso_14_navegacion.dart']){
  const txt=read(file);
  assert.ok(txt.includes('body: SingleChildScrollView('),file+' debe funcionar con teclado.');
  assert.ok(txt.includes('shrinkWrap: true'),file+' debe contraer la lista al contenido.');
  assert.ok(txt.includes('physics: const NeverScrollableScrollPhysics()'),file+' evita scroll duplicado.');
  assert.ok(!/Expanded\(\s*child:\s*ListView\.builder\(/.test(txt),file+' usa Expanded vertical dentro de scroll.');
}
for(const file of ['assets/crud-listado-detallado.js','assets/crud-listado-detallado.css']){
  assert.ok(existsSync(new URL('../'+file,import.meta.url)),file);
  assert.ok(html.includes('./'+file),'Archivo no cargado en index.html: '+file);
}
assert.ok(html.includes('https://api.flutter.dev/flutter/widgets/ListView/ListView.builder.html'));
assert.ok(html.includes('https://api.flutter.dev/flutter/material/ListTile-class.html'));
console.log('P5.1: nueve explicaciones, código completo, opciones, simulador y continuidad P6/P7: OK.');
