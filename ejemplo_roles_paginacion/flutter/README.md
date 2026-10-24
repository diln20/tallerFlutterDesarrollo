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

## Ejecutar sin Docker (modo de clase principal)

Es la misma Tienda de P11. Primero inicia PostgreSQL nativo en 5435 y
FastAPI en 8001. Luego desde actividad2 ejecuta:

~~~powershell
flutter pub add flutter_bloc http
flutter analyze
flutter test
flutter run -d chrome --web-port 5174
~~~

El repositorio selecciona automáticamente http://127.0.0.1:8001 para
Flutter Web/Windows y http://10.0.2.2:8001 para el emulador Android.
Solo usa API_URL para apuntar a una dirección alternativa explícita.

La base de Docker es una variante opcional y no comparte los registros.
No necesitas Docker Desktop en el flujo principal. Las contraseñas
demostrativas de HTTP Basic requieren una red de laboratorio controlada.

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
