# Conceptos básicos y reutilización — FlutterLab

El taller incorpora estas ampliaciones en el orden en que se necesitan, sin adelantar BLoC ni las APIs.

## Dónde se enseña cada tema

| Sección | Concepto | Ejercicio que continúa la Tienda |
|---|---|---|
| [02, Entender main.dart](../index.html#explicacion-widget-build) | `Widget build(BuildContext context)`, `return`, `@override`, contexto en el árbol | `EtiquetaDisponible` y colores del tema en un widget hijo |
| [05, Campo de texto](../index.html#input-decoration-guia) | `TextField`, `InputDecoration`, `labelText`, `hintText`, bordes, iconos, ayuda | Campo de nombre del vehículo con aspecto mejorado |
| [P1, Primer formulario](../index.html#teclado-desbordamiento) | Teclado, desbordamiento vertical, `SingleChildScrollView` y limitaciones de `Expanded` | Mantener el botón de agregar visible desplazando el formulario |
| [P2, Carpetas](../index.html#carpetas-paso-7) | `lib/utils/` junto con las otras carpetas, sin implementar nada todavía | Preparar la carpeta para centralizar colores |
| [P3, Widgets reutilizables](../index.html#p3-ambos-tipos) | `StatelessWidget`, `StatefulWidget`, `State`, `setState`, `static const Color` | Dos títulos reutilizados, contador interactivo y colores compartidos |

## Archivos Dart de referencia

- `etapas/paso_09_formulario_scroll.dart`: formulario completo con teclado y desplazamiento.
- `etapas/paso_10_contador_toques.dart`: StatefulWidget completo, sin introducir BLoC.
- `etapas/paso_10_colores_app.dart`: clase para guardar colores en `lib/utils/colores_app.dart`.
- `etapas/paso_10_titulo_seccion_colores.dart`: StatelessWidget con colores importados.
- `etapas/paso_10_reutilizacion_ampliada.dart`: `main.dart` que combina todo sin abandonar la Tienda.

El alumno **no debe pegar esos cinco archivos dentro de main.dart**. En el módulo P3 se explica dónde crear cada archivo y cómo importar sus clases. La práctica completa es una variante ampliada: al continuar con P4 se debe preservar el código ya trabajado y sustituir solamente los campos que se van a validar.

## Comprobaciones

La guía se inspeccionó con el navegador Chrome para verificar el orden y los enlaces internos. Se crearon pruebas reales de widgets en un proyecto Flutter de verificación, con tres casos: actualización de un contador Stateful, aplicación de colores compartidos y formulario con ventana pequeña y teclado visible.

```powershell
node tests/validar-secuencia-flutter.mjs
node tests/verificar-conceptos-flutter.mjs
```

Las páginas presentan comparaciones y ejemplos sin rotularlos como «analogías»; las explicaciones técnicas no se sustituyen por comparaciones.

## Referencias oficiales

- https://api.flutter.dev/flutter/widgets/BuildContext-class.html
- https://api.flutter.dev/flutter/material/InputDecoration-class.html
- https://api.flutter.dev/flutter/widgets/SingleChildScrollView-class.html
- https://api.flutter.dev/flutter/widgets/StatefulWidget-class.html
