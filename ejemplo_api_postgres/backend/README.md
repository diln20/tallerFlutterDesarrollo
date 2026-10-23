# Tienda de vehículos: API con FastAPI y PostgreSQL

Esta carpeta es el **backend** de la etapa P11 del taller Flutter. Flutter no
se conecta directamente a PostgreSQL: envía solicitudes HTTP a FastAPI y
FastAPI utiliza SQLModel para leer/escribir en la base de datos.

## Preparación (Windows, VS Code y Docker Desktop)

1. En `DesarrolloMovilFlutter` crea una carpeta llamada `tienda_api`.
2. Copia a esa carpeta `main.py`, `requirements.txt`, `compose.yaml` y
   opcionalmente `tests/` de esta referencia.
3. Abre `tienda_api` en VS Code, abre Terminal -> Nuevo terminal.
4. Ejecuta una línea a la vez:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
docker compose up -d
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

El comando `docker compose up -d` necesita Docker Desktop abierto. Espera
a que PostgreSQL esté listo (puedes revisar `docker compose ps`).
En tu navegador abre:

- http://127.0.0.1:8000/salud: devuelve `{"estado":"ok"}`
- http://127.0.0.1:8000/docs: documentación interactiva Swagger.
- Prueba POST /vehiculos, GET /vehiculos, PUT /vehiculos/{id}, DELETE /vehiculos/{id}.

Para probar manualmente POST desde **Swagger**, usa:

```json
{
  "nombre": "Renault 9",
  "anio": 1994,
  "precio": 12000000.50,
  "correo": "cliente@ejemplo.com",
  "disponible": true
}
```

## ¿Qué hace cada archivo?

- `main.py`: modelos de datos, conexión SQLModel y rutas de FastAPI.
- `compose.yaml`: levanta PostgreSQL en el **puerto 5434** del PC;
  dentro del contenedor sigue usando 5432.
- `requirements.txt`: bibliotecas Python necesarias.
- `.env.example`: formato de variable DATABASE_URL si decides configurarla.
- `tests/test_api.py`: pruebas de validación y CRUD sobre una base de prueba
  SQLite; no reemplazan una prueba integral con PostgreSQL.

## Nota de seguridad

La contraseña del archivo Compose es **ficticia y solo educativa**.
No publiques bases de datos reales ni reutilices esa contraseña en producción.
El ejemplo carece de autenticación y debe ejecutarse únicamente en un entorno
local/controlado. Para producción usa HTTPS, secretos, autenticación,
migraciones y configuración de CORS más restrictiva.

Detener contenedor sin borrar los registros:

```powershell
docker compose down
```

**No uses** `docker compose down -v` si quieres conservar los datos de práctica,
porque borra el volumen de PostgreSQL.
