# Analogías cotidianas para enseñar Flutter

Este material acompaña el taller interactivo. La aplicación sigue siendo la **Tienda**: las comparaciones no sustituyen la práctica, sino que muestran cómo funciona un concepto antes de utilizarlo.

## Método para cada clase

1. **Escena conocida:** plantea una situación de la vida diaria, como organizar fichas de vehículos en un estante.
2. **Equivalencia técnica:** explica a qué corresponde cada parte del ejemplo. Para una colección usa `List<String>`, para buscar dentro de ella usa `where` y para mostrar cada resultado usa un `for` con un widget.
3. **Límite de la comparación:** explica qué no ocurre por arte de magia. `TextField` recibe texto, pero no busca solo; `setState` actualiza la interfaz, pero no guarda permanentemente; `BlocProvider` hace disponible la lógica, pero no procesa eventos por sí mismo.
4. **Predicción breve:** pregunta qué ocurrirá antes de ejecutar el código y luego permite comprobarlo.
5. **Un cambio por vez:** utiliza la analogía como puente hacia las líneas exactas, sin pegar implementaciones avanzadas de golpe.

## Mapa de analogías

| Módulo | Analogía | Fundamento |
| --- | --- | --- |
| Inicio | Construir una tienda por etapas | Crear proyecto, luego widgets e interacción |
| 01 · Preparación | Mochila con cuadernos | Carpeta principal, proyecto y terminal |
| 02 · `main.dart` | Abrir un teatro | `main`, `runApp`, `MainApp` y `build` |
| 03 · Estructura | Plano del local | `MaterialApp`, `Scaffold`, `AppBar`, `body` |
| 04 · Diseño | Estantes verticales y horizontales | `Column`, `Row`, `children`, `SizedBox` |
| 05 · Buscador | Casilla de solicitud | `TextField`, `hintText`, `Expanded` |
| Ruta A · P1 | Timbre del mostrador | Botones, eventos y controlador |
| Ruta A · P2 | Archivador | `pages/`, `widgets/`, `models/`, `bloc/` |
| Ruta A · P3 | Sello reutilizable | Constructores, parámetros y widgets |
| Ruta A · P4 | Portero del formulario | `validator`, `validate`, `null` |
| Ruta A · P5 | Ficha diligenciada | Clase, propiedades y objeto |
| Ruta A · P6 | Piezas LEGO | Extracción de widgets y callbacks |
| Ruta A · P7 | Hojas apiladas | `Navigator.push` y `Navigator.pop` |
| Ruta B · 06 | Ordenar una maleta | Espacio interior y desplazamiento |
| Ruta B · 07 | Actualizar una pizarra | `StatefulWidget`, `onChanged`, `setState` |
| Ruta B · 08 | Catálogo de biblioteca | Lista, `where`, `contains` y `for` |
| BLoC | Restaurante y cocina | Evento, BLoC, estado y `BlocBuilder` |
| Catálogo | Caja de herramientas | Elegir widgets según su función |

## BLoC mediante la analogía del restaurante

El usuario hace un pedido, el mesero lo comunica, la cocina trabaja y el mesero presenta el resultado. La relación técnica se interpreta así:

- **Pedido:** `BusquedaTextoCambiado`.
- **Cocina:** `BusquedaBloc` procesa y aplica `where`.
- **Bandeja preparada:** `BusquedaEstado` contiene texto y resultados.
- **Mesero que presenta:** `BlocBuilder` reconstruye la sección visual.
- **Disponibilidad de la cocina:** `BlocProvider` aporta la instancia a los widgets descendientes.

En los diez pasos de práctica del taller se añaden analogías de herramientas, organización de archivos, envío de eventos, estado, lógica, proveedor, una sola fuente de resultados y pruebas.

**Límite:** este ejemplo filtra cuatro nombres guardados en memoria. No requiere una API, un servidor ni estados de carga.

## Biblioteca de 128 widgets

Las fichas muestran una comparación para cada widget del catálogo: **77 analogías específicas** y **51 por familia**. Cuando no existe una metáfora individual, se muestra claramente «Analogía de esta familia» y se conserva la descripción técnica del widget. La analogía de la familia no sustituye la documentación específica.

## Preguntas para llevar al aula

- ¿Qué sucede si escribo en un `TextField` al que todavía no agregué una función de búsqueda?
- ¿Cuándo se ejecuta el contenido de `onPressed`?
- ¿Qué devuelve `validator` cuando un nombre es correcto?
- ¿Crear un objeto `Vehiculo` significa que ya quedó en una base de datos?
- ¿Por qué `Navigator.pop` se parece a volver a la hoja anterior?
- ¿Quién filtra realmente el catálogo en BLoC: `TextField` o `BusquedaBloc`?

## Verificación estructural

Ejecutar desde la carpeta raíz del repositorio:

```bash
node tests/verificar-analogias.mjs
```

No necesita npm ni Flutter. Comprueba que estén presentes las analogías de todos los módulos, de los 87 pasos comparativos, de los diez pasos de BLoC y de las 128 fichas del catálogo. Si crece el taller, hay que agregar las nuevas analogías antes de que la verificación vuelva a pasar.

Esta prueba **no equivale** a compilar ni ejecutar una aplicación Flutter real.
