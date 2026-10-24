# Prueba de extremo a extremo en navegador

Esta prueba usa **Google Chrome real**, la aplicación Flutter web compilada y la API FastAPI del laboratorio. Comprueba el flujo entre UI, servidor, base de datos e imágenes. No sustituye `flutter test` ni `pytest`.

## Preparación en Windows

Primera terminal (API):

```powershell
cd C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2a_api
.venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 8091
```

Segunda terminal (compilar y servir Flutter):

```powershell
cd C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2a
flutter build web --release --dart-define=API_URL=http://127.0.0.1:8091
python -m http.server 5174 --bind 127.0.0.1 --directory build\web
```

Tercera terminal (pruebas):

```powershell
cd C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2a\scripts
npm install
npm run test:e2e
```

Requiere Chrome instalado. Si no está en su ruta habitual, configura `CHROME_PATH`. Por seguridad, **solo se permiten URLs localhost o 127.0.0.1**. No ejecutes la prueba contra servicios de producción.

## Qué verifica
1. Iniciar sesión como administrador.
2. Registrar un vehículo de prueba y comprobar su persistencia.
3. Seleccionar una imagen PNG en el navegador, subirla por multipart y recuperar la URL persistida.
4. Marcar un favorito real.
5. Iniciar sesión como cliente, comprobar que no administra ni elimina y que los favoritos de otro usuario no se heredan.
6. Cambiar a una pantalla móvil de 390 x 844 y revisar la navegación.
7. Entrar como vendedor, comprobar que edita pero no elimina.
8. Entrar de nuevo como administrador y abrir la administración de usuarios.
9. Verificar que no haya errores JavaScript durante el recorrido.

El script elimina el vehículo temporal mediante una cuenta de administrador en un bloque `finally`, incluso si falla algún paso. Genera una captura móvil `e2e-mobile.png` en esta carpeta (ignorada por Git).

## Alcances de esta prueba
Comprueba el selector de archivo **web** y el comportamiento responsivo en Chrome. El APK Android se compila y prueba por separado; el script no verifica permisos de cámara en dispositivos Android/iOS físicos ni equivale a una auditoría de seguridad para producción.
