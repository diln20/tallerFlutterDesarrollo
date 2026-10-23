# Auditoría de continuidad didáctica — Taller Flutter

Fecha: 23 de octubre de 2026  
Proyecto de práctica: `DesarrolloMovilFlutter/actividad2`  
Referencia original conservada: `codigo-base/main.dart`

## Objetivo

Comprobar que los estudiantes puedan construir la aplicación Tienda **desde cero**, sin utilizar un concepto avanzado antes de presentar sus bases. Asegurar también que cada ejercicio conserve el trabajo de las etapas anteriores y que los módulos alternativos no se confundan con una misma cadena de código.

## Recorridos de aprendizaje

| Etapa | Conocimientos anteriores | Conceptos nuevos | Comprobación antes de avanzar |
| --- | --- | --- | --- |
| 01 Preparación | Explorador de Windows y carpetas | VS Code, terminal integrada, `flutter create --empty` | Existe `actividad2/lib/main.dart` y la app inicial abre |
| 02 `main.dart` | Proyecto generado | `import`, función `main`, `runApp`, clase, `StatelessWidget`, constructor | Identifica las partes sin duplicarlas; solo modifica `Text` |
| 03 Estructura | `MainApp`, `build`, `Text` | `MaterialApp`, `Scaffold`, `AppBar`, `body`, `Center` | Puede dibujar la jerarquía de la pantalla |
| 04 Distribución | Jerarquía de widgets | `children: []`, `Column`, `Row`, `SizedBox` | Distingue los ejes y la lista de widgets |
| 05 Campo de texto | `Row` y `children` | `TextField`, `InputDecoration`, `hintText`, `Expanded` | Sabe que escribir no significa filtrar ni guardar |
| Ruta A · P1 | 01–05 | variable, `onPressed`, `StatefulWidget`, `TextEditingController`, `dispose` | Botón lee el texto; todavía no necesita `setState` |
| Ruta A · P2 | Primer formulario | Carpetas `pages`, `widgets`, `models`, etc. | Crea carpetas vacías y explica su propósito sin implementarlas |
| Ruta A · P3 | Constructor y widgets | Parámetros, `final`, `required`, importaciones | `TituloSeccion` funciona con dos textos distintos |
| Ruta A · P4 | Controller y botón | `Form`, `TextFormField`, `GlobalKey<FormState>`, `if`, `null`, `?.` | Prueba casos vacío, corto y válido |
| Ruta A · P5 | Validación | Clase `Vehiculo`, `String`, `bool`, constructor, instancia | Crea el objeto, sin afirmar que quedó almacenado |
| Ruta A · P6 | Widget propio y validación | `VoidCallback`, función entregada por parámetro | Formulario funciona después de extraer el campo y botón |
| Ruta A · P7 | Widgets separados | `BuildContext`, `MaterialPageRoute`, `Navigator.push/pop` | Abre una página sencilla y puede volver |
| Ruta B · 06 | **Volver al código del módulo 05** | `Padding`, `EdgeInsets`, scroll | Ajusta el espacio sin mezclar el formulario P1 |
| Ruta B · 07 | Diseño del módulo 06 | `StatefulWidget`, `onChanged`, `setState` | Distingue actualizar la pantalla de leer controller al pulsar |
| Ruta B · 08 | Estado del módulo 07 | `List<String>`, `where`, función anónima, `contains`, `toList`, `if`, `for` | Construye y prueba un filtro gradualmente |
| BLoC conceptual | Haber finalizado ruta A o B | Evento, lógica y estado | Explica el flujo sin instalar paquetes ni cambiar `main.dart` |

**Secuencia común:** 01 → 02 → 03 → 04 → 05.

**Ruta A recomendada:** 05 → P1 → P2 → P3 → P4 → P5 → P6 → P7 → BLoC conceptual.

**Ruta B alternativa:** 05 → 06 → 07 → 08 → BLoC conceptual.

## Hallazgos corregidos

1. **Rutas mezcladas:** anteriormente se mostraban las ampliaciones 06–08 a continuación de P7, aunque parten del módulo 05. Se añadió un selector de ruta y avisos de punto de partida.
2. **Salto conceptual al formulario:** se presenta el significado de variable, evento, callback, controlador y ciclo de vida antes de usarlo en el código de P1.
3. **Prerrequisitos ausentes:** se añadieron 12 puentes didácticos que introducen listas de widgets, parámetros, validación, instancias, `VoidCallback`, navegación, `setState`, colecciones y BLoC en el momento necesario.
4. **Texto visible que cambiaba sin enseñanza:** se mantiene `Primer widget` en todos los archivos de práctica del paso 03 al 14. El proyecto del docente conserva sus textos originales.
5. **Enlaces circulares entre rutas:** P7 y 08 conducen a la explicación conceptual de BLoC; cada ruta se completa sin saltar a código de la otra.
6. **Confusión entre copia y continuación:** la ruta B requiere regresar al archivo de la etapa 05. Se explica guardar una copia del `main.dart` avanzado fuera de `lib/` antes de cambiar de rama didáctica.

## Criterios de comprobación

- El contenido menciona y explica cada concepto nuevo **antes** de mostrarlo en su primera práctica de esa ruta.
- Cada lección indica el archivo de partida y el resultado esperado.
- No se debe añadir una clase, importar un archivo o usar un widget que todavía no se ha creado o explicado.
- El código Dart para copiar conserva texto y estructura; las diferencias entre etapas son intencionales.
- Los pasos «Antes/Después» solo resaltan cambios reales, no inventan efectos visuales.
- El estudiante debe poder realizar una prueba breve antes de avanzar.
- Las prácticas B son una alternativa desde 05, no un reemplazo de las prácticas A.

## Alcance de la verificación

Se analizaron títulos, secuencia de navegación, dependencias entre módulos, instrucciones de código y archivos de referencia. Se realizaron comprobaciones estructurales de enlaces y visualización del sitio. Esto **no sustituye** una ejecución completa de todos los ejemplos con `flutter analyze` y `flutter test` en el equipo de clase; esas comprobaciones requerirían un entorno Flutter disponible y se informan por separado.

## Guía de mantenimiento

Cuando se agregue una lección, documentar **prerrequisitos → nuevo concepto → modificación única → resultado → prueba**. Si la lección parte de una versión anterior del proyecto, marcarla como **ruta alternativa**, indicando cómo respaldar el trabajo y evitando un enlace «Siguiente» que sugiera continuación directa.
