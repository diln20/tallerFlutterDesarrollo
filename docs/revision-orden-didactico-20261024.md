# Revisión de orden y continuidad didáctica — FlutterLab

Revisión de la guía HTML publicada en GitHub Pages, su navegación y los ejemplos Flutter / FastAPI / PostgreSQL.

## Secuencia de aprendizaje

| Bloque | Orden en el menú | Punto de partida |
|---|---|---|
| Fundamentos comunes | 01 → 02 → 03 → 04 → 05 | Proyecto vacío creado en VS Code |
| Ruta A principal, parte 1 | P1 → P2 → P3 → P4 → P5 → P5.1 | Código al terminar 05 |
| Ruta A principal, parte 2 | P6 → P7 → P8 → P9 → P10 | CRUD construido en P5.1 |
| Ruta A principal, parte 3 | P11 → P12 → P13 → P14 | BLoC, páginas, menú y validación funcionando |
| Ruta B opcional | B1 → B2 → B3 → B4 | **Otra copia independiente del resultado de 05** |
| Catálogo de widgets | Consulta libre | No es requisito para pasar de un módulo a otro |

La ruta B ya no aparenta saltar un número: usa B1–B4. Los ejemplos de archivo conservan nombres históricos como paso_06 y paso_08 para no romper enlaces, pero en el menú la secuencia es continua. No se debe pegar la práctica B4 sobre la ruta A.

## Revisión de los conceptos

La lección 04 introduce ejes Row/Column, presenta un ejemplo básico y después enumera todas las opciones de mainAxisAlignment, crossAxisAlignment y mainAxisSize con un simulador. Las propiedades adicionales aparecen en su contexto: Align en el menú; AutovalidateMode, TextCapitalization y TextInputType en validación; TextAlign y TextStyle en el login; Wrap/Axis en paginación, y TextOverflow, maxLines y EdgeInsets en responsividad.

La práctica 03 ahora numera sus pasos principales 1, 2, 3 y 4. Las ampliaciones AppBar y DEBUG son temas transversales sin numeración repetida.

## P11 → P12 → P13: secuencia de datos

1. Preparar PostgreSQL nativo en Windows (5435), su usuario, base y archivo privado .env.native.
2. Crear entorno virtual Python, modelos, validaciones y rutas FastAPI.
3. Probar FastAPI en Swagger en el puerto 8001.
4. Agregar cliente HTTP Dart, modelos JSON y conectar el BLoC.
5. P12: incorporar permisos en FastAPI y pantalla de acceso, conservando la misma base y URL.
6. P13: agregar paginación en la API, eventos BLoC y widgets que muestran los objetos.
7. P14: evaluar usabilidad y accesibilidad después de tener funcionalidad completa.

Docker Compose sigue disponible, pero **solo como alternativa** dentro del paso P11-2. No es obligatorio para estudiantes con PostgreSQL instalado normalmente.

## Navegación y referencias

El navegador reconoce enlaces a capítulos enteros y a secciones internas, incluso en diferentes páginas: etiqueta DEBUG, código CRUD, ejercicios BLoC, tablas de propiedades y pasos del backend. Los cambios de ruta muestran el módulo padre antes de desplazarse a la sección interna.

Los archivos Python y Dart que acompañan la guía mantienen los puertos nativos 5435 (base de datos) y 8001 (API). La conexión privada del servidor se lee desde .env.native y no debe incluirse en Git.

## Qué se verificó

- Rutas y etapas únicas; 24 pasos con seguimiento de progreso, portada y catálogo.
- Enlaces internos con destino existente y sin IDs duplicados.
- Transiciones correctas de los pasos 01–05, P1–P14 y B1–B4.
- Los 14 subpasos de P11 y el orden nativo → FastAPI → Flutter.
- Grupos de opciones de propiedades en los módulos correspondientes.
- Navegación por anclas internas y diseño móvil.
- Compilación estática de JavaScript, análisis Dart y pruebas de backend Flutter de referencia.

Las comprobaciones web se hacen en Chrome real con Playwright. La simulación de widgets en HTML es pedagógica y no sustituye una compilación Flutter.


## Ampliación verificada del aprendizaje en P1 a P3

La explicación de `build(BuildContext context)` se ubica en el módulo 02
antes de que se construyan componentes propios. El módulo 05 explica
`InputDecoration` antes del formulario y distingue presentación,
lectura de datos y validación. P1 agrega el caso del teclado y la opción
de desplazar su `Column`.

En P2 se añade la séptima carpeta `lib/utils/` sin código; en P3 el
alumno primero utiliza `TituloSeccion` (StatelessWidget), ve su archivo
completo, luego crea `ContadorToques` (StatefulWidget), centraliza
los colores en `ColoresApp` y verifica el resultado. La práctica de
validación P4 continúa sobre el mismo formulario sin borrar estas
ampliaciones opcionales. Se conservan los archivos base para comparar.
