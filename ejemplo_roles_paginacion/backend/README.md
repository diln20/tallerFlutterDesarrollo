# P12 y P13 · Seguridad y paginación de la misma API

Este ejemplo continúa sobre el backend construido en P11, no crea una
segunda API ni exige otra base de datos.

## Ruta de trabajo

1. Terminar P11 y comprobar PostgreSQL nativo (5435) y FastAPI (8001).
2. Respaldar tienda_api/main.py.
3. P12: agregar autenticación, roles Administrador y Lector y proteger CRUD.
4. P13: devolver una página de vehículos y sus metadatos JSON.
5. Probar HTTP, modelos Flutter y estados BLoC, en ese orden.

## Iniciar en Windows sin Docker

Conserva el mismo archivo privado tienda_api/.env.native de P11.
Dentro de tienda_api, utiliza:

~~~powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8001
~~~

Abre http://127.0.0.1:8001/docs. Cuentas SOLO de demostración:
admin/admin123 puede GET, POST, PUT y DELETE;
lector/lector123 puede GET; POST como Lector devuelve 403;
sin credenciales devuelve 401.

GET /vehiculos?pagina=1&tamano=5&buscar=mazda devuelve
un JSON con datos, pagina, tamano, total y total_paginas.
Para 13 vehículos, tres páginas de cinco mostrarán 5, 5 y 3.

## Verificar

~~~powershell
.\.venv\Scripts\python.exe -m pytest -q tests
~~~

Las pruebas automatizadas usan SQLite aislado; revisa aparte la
persistencia real desde Swagger sobre PostgreSQL nativo.

## Docker es opcional

Si eliges Docker, configura DATABASE_URL explícitamente con la dirección
del contenedor. No cambies ni borres la base nativa de P11 por ello.
HTTP Basic no protege contraseñas sin HTTPS y no es para producción.
