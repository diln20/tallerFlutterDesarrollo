# Flutter conectado a FastAPI (P11)

Esta carpeta es el **cliente Flutter** de la API FastAPI/PostgreSQL.
No se conecta directamente a PostgreSQL. Conserva el CRUD con BLoC,
el menú hamburguesa y las validaciones de la ruta principal.

## Aplicar sobre el proyecto del estudiante

1. Termina P10, guarda copia de `actividad2/lib/` fuera de `lib/`.
2. Abre `DesarrolloMovilFlutter/actividad2` en Visual Studio Code.
3. Desde su terminal integrada ejecuta:

```powershell
flutter pub add http
```

4. Copia los archivos de `ejemplo_api_postgres/flutter/lib/` hacia
   `actividad2/lib/`, **respetando todas las subcarpetas**.
   Compara los archivos ya existentes antes de reemplazarlos.
5. Inicia PostgreSQL instalado en Windows (5435) y luego FastAPI (8001),
   y comprueba http://127.0.0.1:8001/docs.
6. Ejecuta Flutter con la dirección que el propio repositorio selecciona.

**Emulador Android estándar** (FastAPI en el mismo computador):

~~~powershell
flutter run
~~~

El emulador Android utiliza http://10.0.2.2:8001.

**Flutter Web en Chrome**:

~~~powershell
flutter run -d chrome --web-port 5174
~~~

Flutter Web y Windows utilizan http://127.0.0.1:8001. No necesitas poner
--dart-define para la conexión nativa. Solo si decides usar Docker u otro
servidor indica explícitamente --dart-define=API_URL=... .

**Celular físico**: necesita un servidor accesible y HTTPS para proteger
las credenciales; no basta con reemplazar localhost por la IP del PC.
El servidor de demostración atiende en 127.0.0.1 y no debe exponerse
a Internet sin controles adecuados.

## Android: permiso de Internet y HTTP local

En `android/app/src/main/AndroidManifest.xml`, añade antes de
`<application>` y dentro de `<manifest>`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

Solo durante el desarrollo **local** con una API HTTP no cifrada,
en `android/app/src/debug/AndroidManifest.xml` combina:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application android:usesCleartextTraffic="true" />
</manifest>
```

No habilites tráfico HTTP sin cifrar en el manifiesto de producción.
Una aplicación publicada debe utilizar HTTPS y una API autenticada.

## ¿Cómo se reparten los archivos?

- `models/vehiculo.dart`: convierte el JSON devuelto por FastAPI.
- `repositories/vehiculos_api.dart`: hace GET/POST/PUT/DELETE con http.
- `bloc/vehiculos_evento.dart`: representa las solicitudes del usuario.
- `bloc/vehiculos_bloc.dart`: espera respuestas de la API y publica estados.
- `bloc/vehiculos_estado.dart`: inventario visible, carga y errores.
- `validators/validadores.dart`: comprueba entradas antes de enviar.
- `main.dart`: muestra la pantalla, el menú Drawer, el formulario y los estados.
- `pages/` y `widgets/`: archivos que ya utilizaste en P7-P10.

## Probar y verificar persistencia

Crea «Renault 9», cierra la aplicación y vuelve a abrirla: al arrancar
`VehiculosCargados` consulta la API y el carro debe seguir registrado.
Prueba editar, eliminar y consultar la base desde Swagger.

Ejecuta `flutter analyze` y `flutter test` desde la carpeta actividad2.
El archivo de pruebas de esta referencia muestra validación y HTTP simulado,
por lo que **no** necesita PostgreSQL para ejecutarse.

Si hay problemas:

- `Connection refused`: confirma que FastAPI está corriendo en el puerto 8001.
- `SocketException`: revisa host y conexión entre emulador/celular y PC.
- Error de CORS: para Web usa el puerto 5174 y una URL permitida en backend.
- `422`: FastAPI rechazó datos que no cumplen las reglas de validación.
- `404`: el ID del vehículo ya no existe en la base.
- `500`: revisa el servidor y PostgreSQL, nunca muestres secretos en pantalla.

**Importante:** usa la contraseña PostgreSQL solo en tienda_api/.env.native.
Docker es una alternativa opcional, con una base de datos independiente.
