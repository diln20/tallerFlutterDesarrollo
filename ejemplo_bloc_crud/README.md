# Tienda de vehículos: aplicación con BLoC

Este ejemplo acompaña la **P8 — Aplicar BLoC al CRUD de vehículos** del taller.
Conserva el modelo Vehiculo, los widgets reutilizables y las dos páginas de P7.

## Cómo utilizar el ejemplo

La ruta de aprendizaje principal es: P5 (objeto) → P5.1 (CRUD con setState)
→ P6 (widgets) → P7 (páginas) → **P8 (mismo CRUD con BLoC)**.

Desde el proyecto del estudiante, en la terminal de VS Code:

```powershell
cd actividad2
flutter pub add flutter_bloc
```

Copia los archivos de `lib/` de esta carpeta de referencia hacia
`actividad2/lib/`, **respetando las subcarpetas**, después de hacer una copia
de seguridad de `actividad2/lib/main.dart`. No copies solamente main.dart
porque importa el modelo, los widgets, las páginas y las clases BLoC.

Ejecuta:

```powershell
flutter pub get
flutter run
flutter test
```

Si quieres utilizar este ejemplo como proyecto independiente, crea una carpeta
Flutter vacía con `flutter create --empty tienda_bloc_crud` y copia todos
los archivos de `lib/` y `test/` de esta referencia a ese proyecto.

## Cómo se reparten las responsabilidades

- `lib/models/vehiculo.dart`: datos de cada vehículo.
- `lib/bloc/vehiculos_evento.dart`: pedidos que hace el usuario.
- `lib/bloc/vehiculos_estado.dart`: datos actuales y resultados visibles.
- `lib/bloc/vehiculos_bloc.dart`: lógica para guardar, editar, buscar y eliminar.
- `lib/main.dart`: controles, validación, envío de eventos y representación
  mediante `BlocBuilder`.
- `lib/widgets/`: campo, botón y título reutilizables.
- `lib/pages/`: Acerca de y Ayuda, conservadas desde P7.

**Importante:** la lista vive en memoria y se pierde al cerrar o reiniciar.
No hay base de datos ni guardado local. El ejemplo no modifica la referencia
del docente `actividad2a`.

Durante una búsqueda, la posición del elemento visible no es necesariamente la
misma que la del catálogo completo. Por eso `main.dart` obtiene
`indiceReal = estado.vehiculos.indexOf(vehiculo)` antes de editar o borrar.

La carpeta `test/` incluye una prueba automatizada de las operaciones.
