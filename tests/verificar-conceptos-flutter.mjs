import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';

const file=(name)=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const html=file('index.html');
const expected=[
 ['explicacion-widget-build','punto-entrada'],
 ['input-decoration-guia','campo-texto'],
 ['teclado-desbordamiento','proyecto'],
 ['carpetas-paso-7','carpetas'],
 ['p3-ambos-tipos','reutilizacion'],
 ['reutilizacion-paso-6','reutilizacion'],
 ['reutilizacion-paso-7','reutilizacion'],
 ['reutilizacion-paso-8','reutilizacion'],
 ['reutilizacion-paso-9','reutilizacion'],
];
for(const [id] of expected){
 assert.equal([...html.matchAll(new RegExp('id="'+id+'"','g'))].length,1,id+' no es único');
 console.log('OK: enlace de sección '+id);
}
for(const name of [
 'etapas/paso_09_formulario_scroll.dart',
 'etapas/paso_10_contador_toques.dart',
 'etapas/paso_10_colores_app.dart',
 'etapas/paso_10_titulo_seccion_colores.dart',
 'etapas/paso_10_reutilizacion_ampliada.dart',
]){
 assert.ok(existsSync(new URL('../'+name,import.meta.url)),name);
 assert.ok(html.includes('./'+name),'Falta enlace a '+name);
 console.log('OK: fuente enlazada '+name);
}
const p1=file('etapas/paso_09_formulario_scroll.dart');
const main=file('etapas/paso_10_reutilizacion_ampliada.dart');
const state=file('etapas/paso_10_contador_toques.dart');
const colors=file('etapas/paso_10_colores_app.dart');
assert.ok(p1.includes('body: SingleChildScrollView('));
assert.ok(main.includes('body: SingleChildScrollView('));
assert.ok(state.includes('extends StatefulWidget') && state.includes('setState(()'));
assert.ok(main.includes('const ContadorToques()') && main.includes('ColoresApp.primario'));
assert.ok(colors.includes('static const Color primario') && colors.includes('static const Color fondo'));
assert.ok(html.includes('El <code>Expanded</code> que ya existe dentro de una <code>Row</code>'));
assert.ok(html.includes('Diferencia entre mostrar una pista, recoger un dato y validar'));
assert.ok(html.includes('BuildContext') && html.includes('Theme.of(context)'));
assert.ok(html.includes('siete carpetas'));
assert.ok(!html.includes('<strong>Analogía:</strong>'));
assert.ok(!html.includes('Analogía: un empleado'));
const labels=file('assets/analogias-ui.js');
assert.ok(labels.includes('EJEMPLO DE ESTE WIDGET'));
assert.ok(!labels.includes('ANALOGÍA DE ESTE WIDGET'));
console.log('CONTINUIDAD DE CONCEPTOS Y EJEMPLOS: APROBADA');
