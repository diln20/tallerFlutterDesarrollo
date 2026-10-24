# P11 · API FastAPI + PostgreSQL normal

Este es el backend de la Tienda. Se usa una sola API y la misma base
durante todas las etapas siguientes P12 y P13.

## Secuencia de instalación para estudiantes

1. PostgreSQL 16 instalado directamente en Windows, puerto local 5435.
2. En pgAdmin, crear usuario tienda_alumno y base tienda_flutter, con ese dueño.
3. Guardar la conexión en tienda_api/.env.native (archivo privado).
4. Instalar Python y dependencias en el entorno virtual .venv.
5. Crear main.py con modelos, validadores y rutas HTTP.
6. Iniciar FastAPI y probar su documentación Swagger.
7. Conectar Flutter usando el repositorio HTTP, no una conexión directa SQL.

Dentro de tienda_api/.env.native escribe una URL del siguiente formato,
cambiando la clave por una contraseña local propia:

    DATABASE_URL=postgresql+psycopg://tienda_alumno:CAMBIA_TU_CLAVE@127.0.0.1:5435/tienda_flutter

Si la clave contiene caracteres especiales, utiliza su representación
codificada para URL. El archivo está ignorado por Git. Nunca pongas
contraseñas PostgreSQL en Dart.

## Ejecutar

Terminal de VS Code dentro de tienda_api:

~~~powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8001
~~~

Visita http://127.0.0.1:8001/docs y prueba salud, crear, listar,
actualizar y borrar. P11 aún no pide credenciales HTTP porque los permisos
de operaciones se incorporan después en P12.

Prueba un vehículo:

~~~json
{"nombre":"Renault 9","anio":1994,"precio":12000000.5,
 "correo":"cliente@ejemplo.com","disponible":true}
~~~

## Pruebas

~~~powershell
.\.venv\Scripts\python.exe -m pytest -q tests
~~~

Estas pruebas usan SQLite aislado, por lo que no modifican PostgreSQL.
FastAPI lee primero DATABASE_URL del entorno y, si no está indicada,
busca tienda_api/.env.native. Si faltan ambas, muestra un error comprensible.

## Docker: alternativa opcional, no paso obligatorio

Solo si el estudiante no puede instalar PostgreSQL normal, puede iniciar
compose.yaml. Ese contenedor usa el puerto 5434 y requiere una DATABASE_URL
explícita que lo señale. No mezclar su base con PostgreSQL nativo ni
eliminar el volumen. HTTP sin HTTPS y la clave de Compose son solo para clase.

Documentación de referencia: https://www.postgresql.org/download/windows/
