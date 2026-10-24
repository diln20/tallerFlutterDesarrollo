# API de laboratorio — Mi Concesionario

API independiente para `actividad2a`; no altera `tienda_api` ni PostgreSQL del proyecto `actividad2`.

## Ejecución
```powershell
cd C:\Users\user\Documents\DesarrolloMovilFlutter\actividad2a_api
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 8091
```

Abre `http://127.0.0.1:8091/docs`. Las claves y roles demo se encuentran en `app.py` y en `actividad2a/docs/GUIA_INTEGRACION_FINAL.md`.

## Endpoints
- `GET /salud`: diagnóstico.
- `GET /sesion`: usuario autenticado.
- `GET /vehiculos`: paginación, texto, marca, precio máximo, disponibles, favoritos, orden.
- `GET /resumen`: indicadores globales y favoritos del usuario.
- `POST /vehiculos`: administrador o vendedor.
- `PUT /vehiculos/{id}`: administrador o vendedor.
- `DELETE /vehiculos/{id}`: administrador únicamente.
- `POST /vehiculos/{id}/imagen`: archivo multipart de imagen, administrador o vendedor.
- `DELETE /vehiculos/{id}/imagen`: administrador o vendedor.
- `PUT|DELETE /vehiculos/{id}/favorito`: cualquier cuenta autenticada.
- `GET|POST /usuarios`, `PATCH /usuarios/{id}/rol`, `DELETE /usuarios/{id}`: solo administrador.

## Pruebas
```powershell
.venv\Scripts\python.exe -m pytest -q tests
```
Los datos SQLite se crean en `data/concesionario.sqlite3`; las fotos en `media/`. Ambos directorios están ignorados por Git. Es un servicio educativo y local con HTTP Basic. No lo publiques en Internet con las contraseñas demo: para producción se requieren HTTPS, credenciales individuales, sesiones/tokens, control de acceso reforzado, límites, respaldo y monitoreo.

La API valida el archivo por su contenido (Pillow), no solo por su extensión o MIME, y permite hasta 5 MB. Se admiten JPEG, PNG y WebP.
