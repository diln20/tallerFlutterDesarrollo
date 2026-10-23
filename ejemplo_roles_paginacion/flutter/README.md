# Flutter P12-P13: roles, objetos JSON y paginación

Esta referencia continúa la **misma Tienda actividad2** al terminar P11.
Contiene todos los archivos juntos para comparar, no un proyecto adicional
que el estudiante deba crear desde cero.

## Nuevo flujo

1. Pantalla de acceso con usuario y contraseña de laboratorio.
2. GET /sesion devuelve nombre y rol verificados por el servidor.
3. Administrador ve formulario y botones Editar/Eliminar.
4. Lector consulta la lista sin controles de escritura.
5. GET /vehiculos?pagina=1&tamano=5&buscar=... obtiene la primera página.
6. El repositorio decodifica JSON a PaginaVehiculos, que contiene objetos Vehiculo.
7. BlocBuilder muestra tarjetas (ListView.builder) o DataTable según ancho.
8. ControlesPaginacion permiten anterior/siguiente y 5/10/20 registros.

## Integración sobre el código del estudiante

Respalda primero DesarrolloMovilFlutter/actividad2/lib. Conserva de P10:
- lib/validators/validadores.dart
- lib/pages/acerca_page.dart y lib/pages/ayuda_page.dart

Añade/reemplaza en actividad2/lib, comparando los cambios:
- models/vehiculo.dart: ahora tiene id y fromJson/toJson
- models/pagina_vehiculos.dart y models/sesion_usuario.dart (nuevos)
- repositories/vehiculos_api.dart: autenticación y operaciones HTTP
- bloc/vehiculos_evento.dart, vehiculos_estado.dart, vehiculos_bloc.dart
- widgets/controles_paginacion.dart y widgets/vista_vehiculos.dart (nuevos)
- main.dart: pantalla con acceso, rol, inventario y menú

No copies ni cambies el proyecto actividad2a del docente.

## Ejecutar

Usa el backend de ../backend (roles y paginación), cuyo Docker/Postgres
es el mismo de P11. Asegúrate de tener Python/Docker y correr el servidor.
Luego en actividad2 ejecuta:

    flutter pub add flutter_bloc http
    flutter analyze
    flutter test

Emulador Android estándar (API_URL predeterminada, 10.0.2.2):

    flutter run

Flutter web en Chrome, puerto 5174 permitido por CORS:

    flutter run -d chrome --web-port 5174 --dart-define=API_URL=http://127.0.0.1:8000

Teléfono físico: cambia la dirección de ejemplo por la IPv4 real del PC.
Si usas HTTP local en Android, declara permiso INTERNET y permite tráfico HTTP
**solo en el manifiesto debug**. Consulta la explicación de P11.

## API vs paginación dentro del widget

- Con paginación en FastAPI NO descargas todos los vehículos.
  ControlesPaginacion manda página y tamaño; GET devuelve solo esos datos.
  En móvil, VistaVehiculos usa ListView.builder; en escritorio, DataTable.
- El archivo widgets/tabla_paginada_local.dart es una **comparación opcional**:
  muestra PaginatedDataTable con DataTableSource solo cuando ya tienes la
  lista **completa en memoria**. No lo agregues al flujo API paginado.
  DataTableSource debe conservarse entre reconstrucciones del widget.

## Autenticación y autorización

Este ejemplo utiliza HTTP Basic solo en entorno local. La aplicación retiene
las credenciales **en memoria** mientras está abierta; cerrar sesión las
descarta. Las credenciales quedan codificadas en Base64, NO cifradas.
Nunca uses HTTP Basic sin HTTPS fuera del laboratorio ni guardes contraseñas
reales en código. El servidor es el que impide las operaciones no autorizadas.

## Pruebas

- Con lector, comprueba que el formulario no aparezca.
- Con admin, crea dos vehículos, edita uno y elimina el otro.
- Agrega 12 vehículos: página 1 con 5, página 2 con 5 y página 3 con 2.
- Prueba buscar Mazda, cambiar tamaño de página y volver a la primera.
- Comprueba qué ocurre con una página que queda vacía al eliminar el último.
- Desconecta FastAPI para ver el estado de error y luego usa Reintentar.
- Reinicia Flutter; los datos de PostgreSQL deben conservarse.

Ejecuta las pruebas Dart en test/; simulan HTTP con MockClient.
Los ejemplos NO son una app lista para producción: faltan sesiones seguras,
HTTPS, gestión de cuentas, migraciones, permisos más precisos y auditoría.
