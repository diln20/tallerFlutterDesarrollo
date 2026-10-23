# P12-P13: API con roles reales y paginación

Continúa la API creada en **P11**, sin modificar la referencia anterior.
Los archivos de esta carpeta son la **versión completa** para comparar
con los cambios que harás sobre DesarrolloMovilFlutter/tienda_api.

## Antes de iniciar

Usa los archivos requirements.txt y compose.yaml de la carpeta
../ejemplo_api_postgres/backend. Copia **main.py** de este ejemplo
sobre tienda_api/main.py solo después de respaldar el trabajo P11.

Dentro de tienda_api, con Docker Desktop abierto:

    py -m venv .venv
    .\.venv\Scripts\python.exe -m pip install -r requirements.txt
    docker compose up -d
    .\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000

Abre http://127.0.0.1:8000/docs. Swagger te pedirá autenticarte mediante
la opción «Authorize». Para una práctica local se permiten:

- Usuario admin / clave admin123 -> rol administrador: GET, POST, PUT y DELETE.
- Usuario lector / clave lector123 -> rol lector: GET exclusivamente.

Las claves del código son solo ejemplos de clase. Puedes reemplazarlas con
DEMO_ADMIN_PASSWORD y DEMO_LECTOR_PASSWORD como variables de entorno.
**HTTP Basic transmite credenciales codificadas en Base64, no cifradas**.
Úsalo solo para un laboratorio local; producción necesita HTTPS, usuarios
reales, sesiones/identidad administradas y auditoría.

## Pruebas de roles

1. GET /sesion con usuario lector responde su rol.
2. GET /vehiculos con lector permite consultar la lista.
3. POST /vehiculos con lector responde 403 (prohibido).
4. POST /vehiculos con admin crea el vehículo.
5. GET /vehiculos?pagina=1&tamano=5&buscar=mazda muestra un JSON:
   { "datos": [...], "pagina": 1, "tamano": 5, "total": 1, "total_paginas": 1 }
6. En una segunda página se muestran los siguientes registros.
7. GET sin credenciales responde 401 (no autenticado).

El navegador Flutter Web usa el puerto 5174 y la API permite el header
Authorization en CORS. **No debes enviar un parámetro rol=admin**
ni confiar en botones ocultos: FastAPI valida cada operación protegida.

### Conceptos
- Autenticación: comprobar quién eres; 401 si falla.
- Autorización: comprobar qué puedes hacer; 403 si no tienes permiso.
- Paginación: LIMIT/OFFSET sobre filas filtradas y ordenadas por ID.
- total: número de coincidencias antes de LIMIT.
- total_paginas: ceil(total/tamano); es 0 si no hay registros.
- Query: valida página >=1 y tamaño entre 1 y 50.

## Pruebas sin PostgreSQL real

Instala requirements.txt y, desde esta carpeta, ejecuta pytest en:
    py -m pytest -q tests

Los tests utilizan SQLite en memoria y reemplazan la dependencia Session.
Después comprueba manualmente PostgreSQL a través de Swagger porque
SQLite y PostgreSQL no son idénticos.
