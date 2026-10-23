# Validación de FlutterLab — P9 a P14
**Fecha:** 23 de octubre de 2026

## Alcance
Revisión del material agregado a la ruta principal de `actividad2` y a los
ejemplos de FastAPI/Flutter en
[`ejemplo_roles_paginacion`](../ejemplo_roles_paginacion/).

## Pruebas ejecutadas

| Verificación | Resultado | Comentario |
|---|---|---|
| Backend original P11 (`pytest`) | **2/2 aprobadas** | Base SQLite de prueba |
| Backend autenticado P12–P13 (`pytest`) | **3/3 aprobadas** | Roles 401/403, CRUD, búsqueda y páginas 5+5+3 |
| Sintaxis Python | **Aprobada** | `python -m compileall` |
| Sintaxis JavaScript | **Aprobada** | `node --check` |
| Flujo web P9 menú hamburguesa | **Aprobado** | Abrir Drawer y cambiar opción |
| Flujo web P10 validaciones | **Aprobado** | Dato inválido y dato correcto |
| Flujo web P11 demostración HTTP | **Aprobado** | Simulación POST y DELETE |
| Flujo web P12 roles | **Aprobado** | Lector recibe simulación 403 |
| Flujo web P13 paginación | **Aprobado** | Página 1/2, cambiar 5→10, buscar Mazda |
| Flujo web P14 heurísticas | **Aprobado** | 10 criterios y contador interactivo |
| Navegación del taller | **Aprobada** | Cambio de ruta y sidebar |
| Vista móvil Chrome 390×844 | **Sin desbordamiento global** | `scrollWidth=390`, `clientWidth=390` |
| Importaciones Dart entre ejemplos P11 y P12–P13 | **28 archivos, 0 rutas relativas faltantes** | Comprobación estática |

Las pruebas de navegador se ejecutaron en Chrome real con Playwright Core
mediante los archivos locales del repositorio. Las simulaciones de roles y
HTTP **no** reemplazan probar la aplicación Flutter ni los permisos del
servidor; el backend sí cuenta con pruebas HTTP automatizadas.

## Pendiente por condiciones del equipo
1. **Compilar Flutter y ejecutar `flutter analyze` / `flutter test`**:
   el ejecutable `flutter` / `dart` no estuvo disponible en la terminal conectada.
2. **Validación real PostgreSQL**: Docker Desktop estaba instalado, pero no
   se encontraba ejecutándose el motor Linux al efectuar la comprobación.
3. **Integración extremo a extremo**: una vez habilitados Flutter y PostgreSQL,
   iniciar la API y comprobar en móvil/Chrome que el inventario permanece
   después de cerrar y reabrir la app.

## Prueba integral que deberá realizarse
1. En `tienda_api`: `docker compose up -d`, luego
   `python -m uvicorn main:app --reload --port 8000`.
2. Abrir `http://127.0.0.1:8000/docs`.
3. Con lector, consultar y probar que POST devuelva 403.
4. Con administrador, crear 13 vehículos, navegar por páginas 5/5/3,
   actualizar y eliminar por ID.
5. Con Flutter abierto, comprobar carga, búsqueda, página siguiente,
   validación de campos, confirmación antes de eliminar y recuperación de errores.
6. Cerrar y reabrir Flutter: los datos deben continuar en PostgreSQL.

**Nota pedagógica:** los roles de demostración utilizan HTTP Basic solo para
entorno local. Producción requiere HTTPS, gestión real de usuarios y
autorización, manejo de secretos y controles adicionales.
