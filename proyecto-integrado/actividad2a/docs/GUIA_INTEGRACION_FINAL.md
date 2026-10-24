# Mi concesionario: versión integrada — Flutter + API (2026-10-24)

## Aviso para el docente y los estudiantes
Esta es la **versión completa de referencia** de `actividad2a`. Las etapas históricas del taller (widgets básicos, formulario únicamente de nombre y datos en una lista local) siguen siendo válidas **solo como pasos de aprendizaje anteriores**. No reemplaces archivos modernos con los fragmentos antiguos: perderías campos, imágenes o la conexión con la API.

La versión integrada usa **un único modelo coherente**: `Vehiculo(id, nombre, marca, precio, disponible, imagenUrl, esFavorito)` y un objeto distinto `Usuario(id, nombre, correo, rol)`. `id` es generado por el servidor. No uses la posición de ListView como identificador real.

## 1. Estructura y responsabilidades

```text
DesarrolloMovilFlutter/
  actividad2a/                        <- interfaz Flutter multiplataforma
    lib/
      main.dart                       <- MaterialApp, login, navegación
      models/
        vehiculo.dart                 <- Vehiculo, DatosVehiculo, Pagina, Resumen
        usuario.dart                  <- Usuario y RolUsuario
        permiso.dart                  <- matriz educativa de permisos
      services/
        api_service.dart              <- HTTP, login, JSON, multipart
        imagen_service.dart           <- galería, cámara y bytes
      repositories/
        vehiculo_repository.dart      <- CRUD, filtros, favoritos e imágenes
        usuario_repository.dart       <- usuarios y roles
      pages/
        login_page.dart               <- acceso con usuario y clave
        catalogo_page.dart            <- filtros, ListView y paginación
        usuarios_page.dart            <- administración de roles
        perfil_page.dart              <- perfil y permisos
      widgets/
        vehiculo_card.dart            <- tarjeta reutilizable
        vehiculo_form_dialog.dart     <- formulario reutilizable
      docs/GUIA_INTEGRACION_FINAL.md
    test/
      concesionario_test.dart
      interfaz_test.dart
  actividad2a_api/                    <- servidor aislado, NO tienda_api anterior
    app.py
    requirements.txt
    tests/test_app.py
    data/                              <- SQLite local generada automáticamente
    media/                             <- imágenes persistentes
```

**¿Por qué separar carpetas?** El modelo describe los datos, el servicio se comunica con el exterior, el repositorio ofrece acciones al catálogo y la página solamente gestiona lo que ve el usuario. Esto permite sustituir el almacenamiento o rediseñar la interfaz sin reescribir todo.

## 2. Arrancar el proyecto desde cero

1. En VS Code abre la carpeta `C:\Users\user\Documents\DesarrolloMovilFlutter`.
2. Si no tienes el proyecto, ejecuta `flutter create --empty actividad2a`. Si ya existe, **no lo recrees**: conserva su carpeta y copia solamente los archivos nuevos siguiendo la lección.
3. En `actividad2a` instala `flutter pub add http http_parser image_picker`.
4. En `actividad2a_api` crea el entorno: `python -m venv .venv` y ejecuta `.venv\Scripts\python.exe -m pip install -r requirements.txt`.
5. Ejecuta `.venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 8091` desde `actividad2a_api`.
6. Abre `http://127.0.0.1:8091/docs` para ver el catálogo de endpoints y `http://127.0.0.1:8091/salud` para comprobar la API.

Los datos persisten en `actividad2a_api/data/concesionario.sqlite3` y las fotos en `actividad2a_api/media/`; el servidor crea esos directorios. No insertes cuentas reales ni secretos institucionales en esta API de práctica.

## 3. Crear el modelo Vehiculo

En `lib/models/vehiculo.dart` se declara la clase con los campos definitivos:
- `id: int`: identificador persistente asignado por la API.
- `nombre: String` y `marca: String`: etiquetas para encontrar y ordenar.
- `precio: double`: cantidad numérica; se visualiza en pesos colombianos.
- `disponible: bool`: determina el estado del inventario.
- `imagenUrl: String?`: ruta de la fotografía persistida en la API; puede no existir.
- `esFavorito: bool`: si el usuario actual lo marcó (no es global).

El constructor `Vehiculo.fromJson` transforma JSON del backend en un objeto. `DatosVehiculo.toJson` transforma los datos de formulario en JSON para POST y PUT. Separar entrada y salida evita que los estudiantes asignen manualmente el ID que debe crear el servidor.

**No uses `Uint8List?` como atributo persistente de Vehiculo en esta etapa:** los bytes se usan en el servicio de selección y carga, pero el modelo guarda la URL después de subir al backend. La versión previa con `imagenBytes` fue útil antes de aprender HTTP; ahora queda reemplazada.

## 4. Agregar el objeto Usuario y los roles

`lib/models/usuario.dart` declara:
```dart
enum RolUsuario { administrador, vendedor, cliente }
```
Cada `Usuario` tiene ID, nombre, correo y rol. `lib/models/permiso.dart` centraliza las reglas de la interfaz.

| Acción | Administrador | Vendedor | Cliente |
|---|---|---|---|
| Ver catálogo y favoritos | Sí | Sí | Sí |
| Crear vehículos | Sí | Sí | No |
| Editar vehículos y fotografías | Sí | Sí | No |
| Eliminar vehículos | Sí | No | No |
| Crear usuarios y cambiar roles | Sí | No | No |

La API replica y **hace cumplir** los permisos. Ocultar un botón nunca sustituye una autorización de servidor. `Usuario` y `Vehiculo` son clases independientes.

## 5. Separar el servicio de imagen

`lib/services/imagen_service.dart` usa `ImagePicker` y `XFile.readAsBytes()`.
- **Web**: abre archivos desde el navegador y muestra los bytes seleccionados.
- **Android/iOS**: permite elegir desde galería; cámara opcional solo en móvil.
- `Future<ImagenSeleccionada?>` significa que la elección tarda y puede cancelarse.
- `async`/`await` gestionan esa espera; `Uint8List` contiene los bytes.
- Limita la selección a 5 MB y muestra errores comprensibles.
- Nunca utilices `dart:io File` para tratar las imágenes del navegador.

La vista previa `Image.memory(...)` se muestra antes de guardar. Para volver a mostrar una imagen persistente del vehículo se usa `Image.network(api.urlImagen(vehiculo.imagenUrl!))`.

## 6. Subir imágenes realmente a la API

`ApiService.subirImagen(id, imagen)` envía un formulario `multipart/form-data` HTTP POST a `/vehiculos/{id}/imagen`, usando `http.MultipartRequest`, los bytes de la imagen y su tipo MIME.

Secuencia acumulativa:
1. Valida nombre, marca, precio y disponibilidad en el formulario.
2. `VehiculoRepository.crear(datos)` obtiene el nuevo ID del backend.
3. `VehiculoRepository.subirImagen(id, archivo)` envía los bytes.
4. La API valida límite y contenido real JPEG/PNG/WebP; almacena un nombre aleatorio en disco y devuelve `imagen_url`.
5. `CatalogoPage._cargar()` refresca el catálogo; `Image.network` muestra la foto.
6. Al editar se conserva el ID y la URL; al quitar foto se llama DELETE `/vehiculos/{id}/imagen`.

**Error posible:** si el vehículo se guardó correctamente pero falló la subida de la foto, el modal conserva el ID en ese intento para no crear un duplicado al reintentar. La API evita archivos huérfanos ante una transacción fallida. En una aplicación real conviene añadir manejo transaccional/observabilidad más avanzado.

## 7. ListView.builder, filtros y paginación

`lib/pages/catalogo_page.dart` combina:
- `TextField` para texto y marca, con espera de 330 ms (`Timer`) antes de enviar la consulta.
- `DropdownButtonFormField` para máximo de precio y ordenamiento. Usa `isExpanded: true` para que su contenido no se desborde en pantallas pequeñas.
- `FilterChip` para mostrar solo disponibles o solo favoritos.
- `ListView.builder` genera las tarjetas de la página recibida de la API.
- `itemCount` es la cantidad de vehículos de esa página; `itemBuilder(context, index)` construye cada tarjeta por posición. La tarjeta usa `ValueKey(vehiculo.id)` para conservar identidad estable.
- `RefreshIndicator` permite actualizar deslizando.
- Botones anterior/siguiente llaman al servidor con `pagina`, sin traer todo el catálogo.
- Al cambiar un filtro se vuelve a página 1. Si se elimina el último elemento de la última página, se ajusta al nuevo total.

El backend filtra y pagina usando consultas parametrizadas SQLite; el cliente no recrea páginas a partir de un listado parcial.

## 8. Widgets reutilizables y formularios

`VehiculoCard` presenta foto, nombre, marca, precio, estado, favoritos y acciones autorizadas. Su diseño pasa de fila a columna según el espacio disponible con `LayoutBuilder`.

`VehiculoFormDialog` contiene `Form`, `GlobalKey<FormState>`, tres `TextFormField`, `SwitchListTile`, selector de imagen y `AlertDialog`. Los `TextEditingController` se liberan en `dispose`. Si el teclado ocupa espacio, `SingleChildScrollView` permite desplazarse dentro del formulario.

No se crean versiones duplicadas de la tienda: el catálogo llama a estos componentes desde su página.

## 9. Login y navegación

`lib/main.dart` crea una sola `MaterialApp`. Antes de iniciar sesión se muestra `LoginPage`; después `InicioPage`. Se conserva el perfil actual solo en memoria del proceso (una característica deliberada de este laboratorio).

Pantalla ancha: `NavigationRail` a la izquierda. Móvil: `NavigationBar` en la parte inferior. `IndexedStack` conserva el estado de las páginas visitadas. El administrador ve «Usuarios», vendedor y cliente solo catálogo y perfil. El usuario puede cerrar sesión.

Cuentas de ejemplo:
- Administrador: `admin@demo.local` / `admin12345`
- Vendedor: `vendedor@demo.local` / `vendedor12345`
- Cliente: `cliente@demo.local` / `cliente12345`

Estas claves **son exclusivamente de desarrollo local**. El servidor comprueba el rol incluso si alguien manipula la interfaz. Se usa HTTP Basic para explicar el proceso; en producción se requieren HTTPS, tokens/sesiones seguras, protección contra intentos y gestión de secretos.

## 10. Ejecutar en navegador y en móvil

**Navegador** (Windows):
```powershell
cd C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2a
flutter run -d chrome --dart-define=API_URL=http://127.0.0.1:8091
```
El servidor añade CORS para localhost con puertos dinámicos de desarrollo.

**Emulador Android** (API en computador anfitrión):
```powershell
flutter run -d emulator-5554 --dart-define=API_URL=http://10.0.2.2:8091
```
La IP especial `10.0.2.2` da acceso desde el emulador Android al localhost del computador.

**Dispositivo Android físico:** usa la IP LAN del computador con `--dart-define=API_URL=http://IP_DEL_PC:8091`, requiere que la API escuche en la red adecuada y firewall autorizado. Solo para redes confiables de laboratorio; para acceso público debe usarse HTTPS. No uses `10.0.2.2` en un teléfono físico.

**iOS:** en macOS se requiere Xcode, iOS Simulator o iPhone y revisar permisos de galería/cámara de `Info.plist`. iOS no se puede compilar desde Windows. Para red local se necesita la configuración de transporte adecuada; preferible HTTPS fuera del laboratorio.

**Android manifest:** permiso Internet y `usesCleartextTraffic=true` en `src/debug/AndroidManifest.xml` para API HTTP de práctica. En modo release, usa API HTTPS.

## 11. Pruebas: qué debe comprobar el estudiante

```powershell
cd C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2a
flutter analyze
flutter test
flutter build web --release
flutter build apk --debug --target-platform android-x64
```
Servidor:
```powershell
cd C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2a_api
.venv\Scripts\python.exe -m pytest -q tests
```

Actividades de sustentación:
1. Registrar un auto con marca, precio e imagen. Cerrar y abrir la aplicación: debe persistir en el servidor.
2. Entrar como cliente: no puede crear ni borrar; sí consultar y guardar favoritos.
3. Entrar como vendedor: puede crear y editar; no borrar ni administrar usuarios.
4. Entrar como administrador: registrar usuarios, cambiar roles y eliminar vehículos.
5. Buscar por marca y precio, orden ascendente, aplicar favoritos y cambiar de página; explicar cómo se calcula el total en el servidor.
6. Seleccionar y luego cancelar imagen; explicar la diferencia entre `Image.memory` y `Image.network`.
7. Explicar la relación entre `models`, `services`, `repositories`, `pages`, `widgets` y `test`.
8. Mostrar un caso en el que la API devuelva 403 y explicar por qué no basta ocultar botones.

## 12. Límites reales del proyecto de laboratorio

- El servidor usa SQLite y almacena imágenes en carpetas locales, no un proveedor cloud.
- Los passwords de ejemplo y autenticación HTTP Basic son **solo demostrativos**.
- No hay auto-registro de usuarios; el administrador crea las cuentas.
- No hay procesamiento de miniaturas en segundo plano, CDN ni copias de seguridad automáticas.
- El código Flutter implementa petición multipart compatible con web y móvil, pero deben probarse la cámara y los permisos reales en los dispositivos de destino.
- `actividad2` y `tienda_api` del taller histórico no fueron alterados; no copies sus implementaciones anteriores sobre `actividad2a`.

**Fuente de referencia:** los archivos reales de `actividad2a/lib`, `actividad2a/test`, `actividad2a_api/app.py` y `actividad2a_api/tests` que acompañan a esta guía. Todos los ejemplos deben consultar esa misma versión.
