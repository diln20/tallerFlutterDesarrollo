import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const read = path => readFileSync(new URL('../'+path, import.meta.url), 'utf8');
const html = read('index.html');
const colors = read('etapas/paso_10_colores_app.dart');
assert.ok(colors.includes('static const Color primario') && colors.includes('static const Color accion'));

const stages = [
  'etapas/paso_11_validacion.dart',
  'etapas/paso_12_objeto.dart',
  'etapas/paso_12b_crud.dart',
  'etapas/paso_13_extraccion.dart',
  'etapas/paso_14_navegacion.dart',
];
const data = stages.map(read);
for (let i=0; i<data.length; i++) {
  const source = data[i], path = stages[i];
  for (const expression of [
    'SingleChildScrollView(', 'ColoresApp.primario', 'ColoresApp.fondo',
    'ColoresApp.accion', 'const ContadorToques()', 'Form(',
  ]) {
    if (expression === 'ColoresApp.accion' && i > 2) continue;
    assert.ok(source.includes(expression), path+' pierde '+expression);
  }
  assert.ok(!source.includes('body: Center('), path+' vuelve al desbordamiento vertical');
}
for (const path of stages.slice(2)) {
  const source = read(path);
  for (const symbol of ['void guardarVehiculo()', 'void comenzarEdicion(int indice)', 'void borrarVehiculo(int indice)', 'ListView.builder(', 'NeverScrollableScrollPhysics()']) {
    assert.ok(source.includes(symbol),path+' pierde '+symbol);
  }
  assert.equal([...source.matchAll(/void guardarVehiculo\s*\(/g)].length,1,path+' duplica guardarVehiculo');
}
for(const path of stages.slice(3)) {
  assert.ok(read(path).includes('alPresionar: guardarVehiculo,'),path+' no conecta el boton');
}
const widget=read('etapas/paso_13_boton_tienda.dart');
assert.ok(widget.includes("import '../utils/colores_app.dart';"));
assert.ok(widget.includes('onPressed: alPresionar'));
assert.ok(widget.includes('ColoresApp.accion'));

const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
for (const path of [...stages,'etapas/paso_13_boton_tienda.dart']) {
  assert.ok(html.includes('<code>'+esc(read(path))+'</code>'),
    'La guia muestra un archivo final desactualizado: '+path);
}
const cpl={window:{}};
runInNewContext(read('assets/code-placement-data.js'),cpl);
const expected={
  p11:'etapas/paso_11_validacion.dart',
  p12:'etapas/paso_12_objeto.dart',
  p13button:'etapas/paso_13_boton_tienda.dart',
  p13main:'etapas/paso_13_extraccion.dart',
  p14main:'etapas/paso_14_navegacion.dart'
};
for (const [key,path] of Object.entries(expected)) {
  const source=cpl.window.FlutterCodePlacementData.references[key];
  assert.equal(source.path,path);
  assert.equal(source.text,read(path),'Referencia de colocacion desactualizada: '+key);
}
const preview={window:{}};
runInNewContext(read('assets/stage-preview-data.js'),preview);
const extraction=preview.window.FlutterLabStageData.extraccion.steps.at(-1);
assert.ok(extraction.code.includes('alPresionar: guardarVehiculo'));
assert.ok(!extraction.code.includes('debugPrint'));
const nav=preview.window.FlutterLabStageData.navegacion.steps.at(-1);
assert.ok(nav.code.includes('Builder('));
const simulation=read('assets/stage-previews.js');
for (const name of ['crudUI(', 'data-pv-edit', 'data-pv-delete', 'r.addedCars.push(name)', 'r.addedCars.splice(i,1)']) {
  assert.ok(simulation.includes(name), 'Simulador omite '+name);
}
for(const phrase of ["Después de ListView.builder", "const ContadorToques()"]) {
  assert.ok(html.includes(phrase), 'La guia no aclara '+phrase);
}
console.log('CONTINUIDAD P3-P7: archivos, guardado, navegacion, colores, scroll, vista y referencias sincronizados.');
