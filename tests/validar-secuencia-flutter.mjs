import fs from 'node:fs';
import path from 'node:path';

const raiz = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(raiz, 'assets/app.js'), 'utf8');

function comprobar(condicion, mensaje) {
  if (!condicion) {
    console.error('ERROR: ' + mensaje);
    process.exitCode = 1;
  } else console.log('OK: ' + mensaje);
}

const esperadas = [
  'inicio', 'preparacion', 'punto-entrada', 'estructura', 'diseno',
  'campo-texto', 'proyecto', 'carpetas', 'reutilizacion', 'validacion',
  'objeto', 'crud', 'extraccion', 'navegacion', 'bloc-crud',
  'menu-hamburguesa', 'validaciones-esenciales', 'api-postgres',
  'roles-usuarios', 'paginacion-widget', 'heuristicas-ux',
  'responsive', 'estado', 'formularios', 'bloc', 'catalogo-widgets',
];
const reRutas = app.match(/const ROUTES = \[([\s\S]+?)\];/);
const rutas = reRutas ? [...reRutas[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
comprobar(JSON.stringify(rutas) === JSON.stringify(esperadas), 'lista de rutas en orden y sin faltantes');

const secciones = [...html.matchAll(/<section\b[^>]*\bclass="page[^"]*"[^>]*\bid="([^"]+)"/g)].map(m => m[1]);
comprobar(JSON.stringify(secciones) === JSON.stringify(esperadas.filter(id => id !== 'catalogo-widgets').concat('catalogo-widgets')), 'secciones visibles en orden');
const sidebar = [...html.matchAll(/<a\s+class="nav-link[^"]*"[^>]*\bdata-route="([^"]+)"/g)].map(m => m[1]);
const sinCatalogo = x => x.filter(id => id !== 'catalogo-widgets');
comprobar(JSON.stringify(sinCatalogo(sidebar)) === JSON.stringify(sinCatalogo(esperadas)), 'menu principal respeta la misma secuencia');

const todosIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
comprobar(new Set(todosIds).size === todosIds.length, 'IDs HTML no se repiten');
const conjunto = new Set(todosIds);
const enlaces = [...html.matchAll(/<a\b[^>]*\bhref="#([^"]+)"/g)].map(m => m[1]);
comprobar(enlaces.every(id => !id || conjunto.has(id)), 'enlaces internos apuntan a IDs existentes');

const primarios = esperadas.slice(1,21);
const alternativas = esperadas.slice(21,25);
function tramo(id) {
  const start = html.indexOf('id="' + id + '"');
  if (start < 0) return '';
  const siguientes = [...html.matchAll(/<section\b[^>]*\bclass="page[^"]*"[^>]*\bid="/g)]
    .map(m => m.index).filter(i => i > start);
  return html.slice(start, siguientes.length ? siguientes[0] : html.length);
}
for (const ruta of [primarios,alternativas]) {
  for (let i = 0; i < ruta.length - 1; i++) {
    const siguiente = ruta[i+1];
    const re = new RegExp('class="next-link"[^>]*href="#' + siguiente + '"');
    comprobar(re.test(tramo(ruta[i])), ruta[i] + ' lleva a ' + siguiente);
  }
}
for (let n=1;n<=4;n++) {
  comprobar(html.includes('<span class="lesson-index">B'+n+'</span>'), 'ruta B contiene B'+n);
}
for(let n=1;n<=14;n++) {
  comprobar(conjunto.has('al-paso-11-'+n), 'P11 tiene paso ' + n);
}
comprobar(html.includes('PostgreSQL nativo y su conexión privada'), 'P11 inicia con PostgreSQL nativo');
comprobar(html.includes('obtener_url_postgresql()'), 'P11 explica configuración segura de la API');
comprobar(html.includes('urlApiPredeterminada()'), 'P11 Flutter utiliza dirección consistente con API');
comprobar(html.includes('fv-alineacion-lab'), 'propiedades de ejes con simulador');
comprobar(html.includes('fv-propiedades-formulario'), 'opciones del formulario en su módulo');
comprobar(html.includes('fv-propiedades-paginador'), 'opciones del paginador en su módulo');
comprobar(app.includes("target?.closest('main .page')"), 'enlaces de subsecciones resuelven su módulo padre');

if (process.exitCode) {
  console.error('La secuencia necesita correcciones antes de publicar.');
} else {
  console.log('SECUENCIA DIDACTICA: APROBADA');
}
