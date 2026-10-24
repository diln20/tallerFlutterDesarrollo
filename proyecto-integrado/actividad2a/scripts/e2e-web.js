/**
 * Prueba E2E real del laboratorio Flutter web y FastAPI.
 * Requisitos: backend :8091, web compilada servida en :5174, Google Chrome y playwright-core.
 * Ejecuta: npm install --no-save playwright-core && node e2e-web.js
 * Crea un vehículo temporal en la API de LABORATORIO y siempre intenta eliminarlo.
 */
const assert = require('node:assert/strict');
const {chromium} = require('playwright-core');
const path = require('node:path');

const API = process.env.E2E_API_URL || 'http://127.0.0.1:8091';
const WEB = process.env.E2E_WEB_URL || 'http://127.0.0.1:5174';
if (!['localhost','127.0.0.1'].includes(new URL(API).hostname) || !['localhost','127.0.0.1'].includes(new URL(WEB).hostname)) { throw Error('E2E solo admite servidores locales de laboratorio'); }
const CHROME = process.env.CHROME_PATH || (
  process.platform === 'win32'
    ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
    : process.platform === 'darwin'
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : '/usr/bin/google-chrome'
);
const cuentas = {
  administrador: ['admin@demo.local', 'admin12345'],
  vendedor: ['vendedor@demo.local', 'vendedor12345'],
  cliente: ['cliente@demo.local', 'cliente12345'],
};

function autorizacion(rol) {
  return 'Basic ' + Buffer.from(cuentas[rol].join(':')).toString('base64');
}
async function peticion(ruta, rol = 'administrador', metodo = 'GET', cuerpo) {
  return fetch(API + ruta, {
    method: metodo,
    headers: {
      Authorization: autorizacion(rol),
      ...(cuerpo ? {'Content-Type':'application/json'} : {}),
    },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
}
async function entrar(page, rol) {
  await page.getByRole('textbox', {name: 'Correo electrónico'}).fill(cuentas[rol][0]);
  await page.locator('input[aria-label="Contraseña"]').fill(cuentas[rol][1]);
  const response = page.waitForResponse(r => r.url().endsWith('/sesion') && r.status() === 200, {timeout:15000});
  await page.getByRole('button', {name:'Ingresar'}).click();
  await response;
  await page.getByRole('button', {name:'Cerrar sesión'}).waitFor();
}
async function salir(page) {
  await page.getByRole('button', {name:'Cerrar sesión'}).click();
  await page.getByRole('button', {name:'Ingresar'}).waitFor();
}

(async()=>{
  const ok = await fetch(API + '/salud');
  assert.equal(ok.status, 200, 'La API debe estar activa');
  const browser = await chromium.launch({
    executablePath:CHROME,
    headless:true,
    args:['--no-sandbox'],
  });
  let id = null;
  const nombre = 'QA integral ' + Date.now();
  const errores = [];
  try {
    const page = await browser.newPage({viewport: {width:1280, height:800}});
    page.on('pageerror',e=>errores.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errores.push(m.text());});
    await page.goto(WEB, {waitUntil:'networkidle', timeout:30000});
    await page.locator('flt-semantics-placeholder').evaluate(e=>e.click());
    await entrar(page,'administrador');
    assert.equal(await page.getByRole('button',{name:'Nuevo vehículo'}).count(),1);
    assert.equal(await page.getByRole('button',{name:/Usuarios/}).count(),1);
    console.log('OK: acceso administrador');

    await page.getByRole('button',{name:'Nuevo vehículo'}).click();
    await page.getByRole('textbox',{name:'Nombre o modelo'}).fill(nombre);
    await page.getByRole('textbox',{name:'Marca'}).fill('Renault');
    await page.getByRole('textbox',{name:'Precio en pesos colombianos'}).fill('35000000');
    const creacion = page.waitForResponse(r=>r.url().endsWith('/vehiculos') && r.request().method()==='POST', {timeout:15000});
    await page.getByRole('button',{name:'Registrar'}).click();
    const creada=await creacion;
    assert.equal(creada.status(),201,'Creación de vehículo');
    const creado=await creada.json();id=creado.id;
    await page.getByRole('button',{name:'Opciones del vehículo'}).waitFor();
    console.log('OK: guardar vehículo y listar');

    await page.getByRole('button',{name:'Opciones del vehículo'}).click();
    await page.getByRole('menuitem',{name:'Editar vehículo'}).click();
    await page.getByRole('button',{name:'Galería / archivos'}).waitFor();
    const imagenTemporal=await browser.newPage({viewport:{width:100,height:100}});
    await imagenTemporal.setContent('<div style="width:80px;height:60px;background:#1f88cc"></div>');
    const png=await imagenTemporal.locator('div').screenshot();
    await imagenTemporal.close();
    const chooserPromise = page.waitForEvent('filechooser', {timeout:15000});
    await page.getByRole('button',{name:'Galería / archivos'}).click();
    const chooser = await chooserPromise;
    await chooser.setFiles({name:'vehiculo-qa.png',mimeType:'image/png',buffer:png});
    const subida=page.waitForResponse(r=>r.url().endsWith('/vehiculos/'+id+'/imagen') && r.request().method()==='POST', {timeout:15000});
    await page.getByRole('button',{name:'Guardar cambios'}).click();
    const subidaResp=await subida;
    assert.equal(subidaResp.status(),200,'Subida multipart');
    const fotoServidor=await subidaResp.json();
    assert.ok(fotoServidor.imagen_url,'La URL de imagen no puede faltar');
    assert.equal((await fetch(API + fotoServidor.imagen_url)).status,200);
    await page.getByRole('button',{name:'Marcar favorito'}).waitFor();
    const pagina=await (await peticion('/vehiculos?buscar='+encodeURIComponent(nombre))).json();
    assert.equal(pagina.datos[0].imagen_url,fotoServidor.imagen_url);
    console.log('OK: seleccionar PNG en navegador, subir y recuperar imagen persistente');

    const marcar=page.waitForResponse(r=>r.url().endsWith('/vehiculos/'+id+'/favorito') && r.request().method()==='PUT', {timeout:15000});
    await page.getByRole('button',{name:'Marcar favorito'}).click();
    assert.equal((await marcar).status(),200);
    const favoritosAdmin=await (await peticion('/vehiculos?solo_favoritos=true')).json();
    assert.ok(favoritosAdmin.datos.some(v=>v.id===id),'Favorito propio de administrador');
    console.log('OK: favorito persistente por usuario');

    await salir(page);
    await entrar(page,'cliente');
    assert.equal(await page.getByRole('button',{name:'Nuevo vehículo'}).count(),0);
    assert.equal(await page.getByRole('button',{name:/Usuarios/}).count(),0);
    const clienteAuto=await (await peticion('/vehiculos?buscar='+encodeURIComponent(nombre),'cliente')).json();
    assert.equal(clienteAuto.datos[0].es_favorito,false,'Favoritos independientes');
    assert.equal((await peticion('/usuarios','cliente')).status,403,'Permiso en servidor');
    assert.equal((await peticion('/vehiculos/'+id,'cliente','DELETE')).status,403,'No borrar como cliente');
    console.log('OK: cliente sin edición ni administración; favoritos privados y HTTP 403');

    await page.setViewportSize({width:390,height:844});
    await page.getByRole('tab',{name:'Mi perfil'}).waitFor();
    assert.equal(await page.getByRole('tab').count(),2);
    await page.screenshot({path:path.join(__dirname,'e2e-mobile.png')});
    console.log('OK: navegación móvil a 390x844');

    await salir(page);
    await entrar(page,'vendedor');
    assert.equal(await page.getByRole('button',{name:'Nuevo vehículo'}).count(),1);
    assert.equal(await page.getByRole('button',{name:/Usuarios/}).count(),0);
    await page.getByRole('button',{name:'Opciones del vehículo'}).click();
    await page.getByRole('menuitem',{name:'Editar vehículo'}).waitFor();
    assert.equal(await page.getByRole('menuitem',{name:'Eliminar vehículo'}).count(),0);
    assert.equal((await peticion('/vehiculos/'+id,'vendedor','DELETE')).status,403);
    await page.keyboard.press('Escape');
    console.log('OK: vendedor puede editar, no eliminar ni administrar usuarios');

    await salir(page);
    await entrar(page,'administrador');
    const botonUsuarios=page.getByRole('tab',{name:/Usuarios/});
    await botonUsuarios.click();
    await page.getByRole('button',{name:'Crear usuario'}).waitFor();
    console.log('OK: menú y pantalla de administración de usuarios');
    assert.deepEqual(errores,[],'Errores JS: '+errores.join('; '));
    console.log('OK: 0 errores JavaScript durante E2E');
  } finally {
    if(id!==null) {
      const limpieza=await peticion('/vehiculos/'+id,'administrador','DELETE');
      console.log('Limpieza de vehículo temporal HTTP '+limpieza.status);
    }
    await browser.close();
  }
})().catch(e=>{console.error('FALLO E2E: '+(e.stack||e));process.exitCode=1;});
