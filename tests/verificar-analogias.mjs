/* Validación estructural sin paquetes externos: node tests/verificar-analogias.mjs */
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const load=(path,context)=>runInNewContext(read(path),context,{filename:path});
const context={window:{}};
load('assets/analogias-didacticas.js',context);
load('assets/analogias-catalogo.js',context);
const analogies=context.window.FlutterLabAnalogias;
assert.ok(analogies,'Deben existir las analogías');

const stages={window:{}};
load('assets/stage-preview-data.js',stages);
const modules=stages.window.FlutterLabStageData;
const html=read('index.html');

const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
const required=['inicio','preparacion','catalogo-widgets',...Object.keys(modules)];
for(const id of required){
  assert.ok(ids.has(id),'Falta la sección '+id);
  const example=analogies.modulos[id];
  assert.ok(example,'Falta analogía para '+id);
  assert.ok(example.titulo?.length>10 && example.cotidiano?.length>35,'Falta historia de '+id);
  assert.equal(example.equivalencias?.length,3,'Se esperan tres equivalencias: '+id);
  assert.ok(example.cuidado?.length>35,'Falta el límite de la analogía '+id);
  assert.ok(example.pregunta?.length>12 && example.respuesta?.length>12,'Falta la comprobación '+id);
}
let total=0;
for(const [id,module] of Object.entries(modules)){
  const entries=analogies.pasos[id];
  assert.ok(entries,'No hay analogías para '+id);
  assert.equal(entries.length,module.steps.length,'Difieren los pasos de '+id);
  entries.forEach((pair,i)=>{
    assert.ok(pair[0]?.length>18,'Falta escena '+id+' #'+(i+1));
    assert.ok(pair[1]?.length>22,'Falta equivalencia '+id+' #'+(i+1));
  });
  total+=module.steps.length;
}
assert.equal(total,87,'Ha cambiado el total de pasos: actualizar analogías');

const blocSteps=[...html.matchAll(/<article class="bloc-practice-step"/g)].length;
assert.equal(blocSteps,analogies.blocPractica.length,'No coinciden los pasos BLoC');
const widgetData={window:{}};
for(const path of ['assets/widgets-core.js','assets/widgets-controls.js','assets/widgets-advanced.js']){
  load(path,widgetData);
}
const widgets=widgetData.window.FlutterLabWidgetData;
assert.equal(widgets.length,128,'Revisar el recuento del catálogo');
let exact=0,family=0;
for(const w of widgets){
  const individual=analogies.catalogo.exactas[w.name];
  const group=analogies.catalogo.familias[w.group];
  assert.ok(individual||group,'Falta analogía para '+w.name);
  if(individual)exact++;
  else family++;
}
for(const file of ['assets/analogias-didacticas.js','assets/analogias-catalogo.js','assets/analogias-ui.js','assets/analogias.css']){
  assert.ok(existsSync(new URL('../'+file,import.meta.url)),'Falta archivo '+file);
  assert.ok(html.includes('./'+file),'No se carga '+file+' desde index.html');
}
console.log('Cobertura: '+required.length+' secciones, '+total+' pasos, '+blocSteps+' pasos BLoC y '+widgets.length+' widgets ('+exact+' exactas, '+family+' por familia).');
