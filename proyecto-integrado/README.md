# Proyecto integrado: Mi Concesionario Flutter + FastAPI

Esta carpeta contiene la **implementación final coherente** del taller, publicada el 24 de octubre de 2026. No reemplaza las lecciones iniciales: aquellas enseñan conceptos paso a paso, mientras que aquí se presenta su integración real.

## Carpetas
- `actividad2a/`: código Flutter (modelos, servicios, repositorios, páginas, widgets, pruebas) y los manifiestos modificados para Android/iOS.
- `actividad2a_api/`: FastAPI, SQLite, permisos, archivos de imagen, pruebas.
- [Guía paso a paso y auditoría](./actividad2a/docs/GUIA_INTEGRACION_FINAL.md).

## Condicionales y funciones Widget integrados en el concesionario

Los ejemplos de `if (...) { ... }`, `return`, `Widget` y `List<Widget>` ya se aplicaron **dentro del código Flutter de esta carpeta**, no solo en archivos de ejemplo de la página:

- [`lib/main.dart`](./actividad2a/lib/main.dart): la función `_construirPantallaInicial()` retorna `LoginPage` o `InicioPage` según un `if` con llaves y reutiliza la sesión actual.
- [`lib/widgets/vehiculo_card.dart`](./actividad2a/lib/widgets/vehiculo_card.dart): `_construirEstado()` utiliza `if/return` para mostrar «Disponible» o «No disponible»; `_construirFoto()` devuelve un `Widget`; `_construirDetalles()` devuelve una `List<Widget>`. El menú de acciones sigue siendo condicional con `if` dentro de `children`.
- [`lib/pages/catalogo_page.dart`](./actividad2a/lib/pages/catalogo_page.dart): conserva las comprobaciones de permisos por rol y los filtros, favoritos, paginación y operaciones CRUD existentes. La tarjeta sigue recibiendo `onEditar`/`onEliminar` únicamente cuando el usuario tiene permiso.
- [`test/condicionales_widgets_test.dart`](./actividad2a/test/condicionales_widgets_test.dart): pruebas de disponibilidad, acciones condicionales y presentación en móvil y escritorio.

El modelo integrado usa `Vehiculo.disponible` de tipo `bool` procedente de la API, **no** un `stock` inventado: los ejemplos con existencias numéricas de la guía son prácticas independientes. Los permisos de edición/eliminación siempre se comprueban en el backend, aunque un botón esté oculto.

Para ver la explicación detallada y relacionarla con los archivos reales, consulta la [sección de condicionales y funciones de la guía](../index.html#estructura) y [la ampliación de la guía de integración](./actividad2a/docs/GUIA_INTEGRACION_FINAL.md#14-condicionales-y-funciones-que-retornan-widgets-en-la-aplicación-real).

## Ejecutar directamente desde GitHub

**Método recomendado y verificado en una copia recién clonada.** No necesitas copiar clases manualmente ni borrar el código existente.

```powershell
git clone https://github.com/diln20/tallerFlutterDesarrollo.git
cd tallerFlutterDesarrollo\proyecto-integrado\actividad2a

# Genera los archivos de plataforma que no se almacenan en esta guía.
# Flutter conserva lib/main.dart, pubspec.yaml y los manifiestos ya existentes.
flutter create --empty --platforms android,ios,web --project-name actividad2a .

flutter pub get
flutter analyze
flutter test
```

Se comprobó que este procedimiento conserva sin cambios los archivos propios de la app y que las 12 pruebas Flutter pasan después de regenerar Android, iOS y web. Si usas una versión de Flutter distinta, revisa primero su compatibilidad.

En una segunda terminal, inicia la **API independiente** que está junto a la app:

```powershell
cd tallerFlutterDesarrollo\proyecto-integrado\actividad2a_api
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 8091
```

Si ya te encuentras en la carpeta `actividad2a`, usa `cd ..\actividad2a_api`. Abre `http://127.0.0.1:8091/docs` para conocer la API.

**Web:** ejecuta desde `actividad2a`:

```powershell
flutter run -d chrome --dart-define=API_URL=http://127.0.0.1:8091
```

**Emulador Android:** desde la misma carpeta:

```powershell
flutter run -d emulator-5554 --dart-define=API_URL=http://10.0.2.2:8091
```

En un teléfono físico la URL cambia a una dirección alcanzable del servidor; fuera del laboratorio debes configurar HTTPS, no exponer las credenciales de ejemplo.

## Cuentas exclusivamente de práctica local
- Administrador: `admin@demo.local`, clave `admin12345`.
- Vendedor: `vendedor@demo.local`, clave `vendedor12345`.
- Cliente: `cliente@demo.local`, clave `cliente12345`.

Usa esas cuentas solo para aprender. **No expongas este servidor a Internet**: la autenticación HTTP Basic de esta práctica exige un rediseño con HTTPS, gestión de sesiones y secretos antes de producción.

## Prueba de navegador completa

Además de las pruebas de Flutter y pytest, se añadió una prueba E2E real con Chrome que verifica registro de vehículo, selección/subida de imagen PNG, persistencia, favoritos individuales, navegación móvil y roles de administrador, vendedor y cliente. Se ejecuta **solo en localhost** para evitar modificar sistemas ajenos y elimina su vehículo temporal.

Lee [las instrucciones para ejecutar la prueba E2E](./actividad2a/scripts/README.md) y su [código fuente](./actividad2a/scripts/e2e-web.js).

## Qué funciona
CRUD por roles, filtros y búsqueda, favoritos por usuario, paginación de servidor, carga y visualización de fotos JPEG/PNG/WebP mediante selector web y móvil, y almacenamiento persistente en SQLite y archivos del backend. Se incluyen pruebas de Flutter y de API.

Los archivos `actividad2a_api/data`, `media` y `.venv` no se incluyen ni deben publicarse.

## Evitar incoherencias con etapas antiguas
No copiar la versión de `Vehiculo` que tenía únicamente `nombre/disponible`, ni la versión temporal con `imagenBytes` persistido en el objeto; aquí se usa `imagenUrl` de la API y bytes solo al seleccionar/subir archivos. Tampoco se utiliza el repositorio local que guardaba una lista en memoria.

El método del catálogo se llama `_guardarVehiculo` y recibe un vehículo anterior opcional. El diálogo reutilizable `VehiculoFormDialog` tiene su propio `_guardar`. Ambos son parte de una misma operación de registro/edición.

La API antigua `tienda_api` y el proyecto `actividad2` son independientes y no se sobrescriben.

[Leer la guía interactiva completa](../concesionario-integrado.html).
