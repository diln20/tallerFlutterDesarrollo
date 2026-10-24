# Proyecto integrado: Mi Concesionario Flutter + FastAPI

Esta carpeta contiene la **implementación final coherente** del taller, publicada el 24 de octubre de 2026. No reemplaza las lecciones iniciales: aquellas enseñan conceptos paso a paso, mientras que aquí se presenta su integración real.

## Carpetas
- `actividad2a/`: código Flutter (modelos, servicios, repositorios, páginas, widgets, pruebas) y los manifiestos modificados para Android/iOS.
- `actividad2a_api/`: FastAPI, SQLite, permisos, archivos de imagen, pruebas.
- [Guía paso a paso y auditoría](./actividad2a/docs/GUIA_INTEGRACION_FINAL.md).

## Ejecutar en un equipo nuevo
En una carpeta de trabajo:

```powershell
flutter create --empty actividad2a
```

Copia **el contenido completo** de `proyecto-integrado/actividad2a/lib/`, `test/`, `docs/`, `pubspec.yaml`, `pubspec.lock` y `analysis_options.yaml` encima del proyecto generado. Integra las modificaciones de los manifiestos Android/iOS desde esta carpeta (sin sustituir el proyecto entero si tus versiones de Flutter difieren). Luego:

```powershell
cd actividad2a
flutter pub get
flutter analyze
flutter test
```

En otra terminal coloca la carpeta `proyecto-integrado/actividad2a_api` como `actividad2a_api` al lado de la app:

```powershell
cd actividad2a_api
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 8091
```

Abre `http://127.0.0.1:8091/docs`.

**Web**:
```powershell
cd actividad2a
flutter run -d chrome --dart-define=API_URL=http://127.0.0.1:8091
```

**Emulador Android**:
```powershell
flutter run -d emulator-5554 --dart-define=API_URL=http://10.0.2.2:8091
```

## Cuentas exclusivamente de práctica local
- Administrador: `admin@demo.local`, clave `admin12345`.
- Vendedor: `vendedor@demo.local`, clave `vendedor12345`.
- Cliente: `cliente@demo.local`, clave `cliente12345`.

Usa esas cuentas solo para aprender. **No expongas este servidor a Internet**: la autenticación HTTP Basic de esta práctica exige un rediseño con HTTPS, gestión de sesiones y secretos antes de producción.

## Qué funciona
CRUD por roles, filtros y búsqueda, favoritos por usuario, paginación de servidor, carga y visualización de fotos JPEG/PNG/WebP mediante selector web y móvil, y almacenamiento persistente en SQLite y archivos del backend. Se incluyen pruebas de Flutter y de API.

Los archivos `actividad2a_api/data`, `media` y `.venv` no se incluyen ni deben publicarse.

## Evitar incoherencias con etapas antiguas
No copiar la versión de `Vehiculo` que tenía únicamente `nombre/disponible`, ni la versión temporal con `imagenBytes` persistido en el objeto; aquí se usa `imagenUrl` de la API y bytes solo al seleccionar/subir archivos. Tampoco se utiliza el repositorio local que guardaba una lista en memoria.

El método del catálogo se llama `_guardarVehiculo` y recibe un vehículo anterior opcional. El diálogo reutilizable `VehiculoFormDialog` tiene su propio `_guardar`. Ambos son parte de una misma operación de registro/edición.

La API antigua `tienda_api` y el proyecto `actividad2` son independientes y no se sobrescriben.

[Leer la guía interactiva completa](../concesionario-integrado.html).
