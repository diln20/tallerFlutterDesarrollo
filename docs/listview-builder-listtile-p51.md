# P5.1 — Mostrar los vehículos con `ListView.builder`

La explicación ampliada se encuentra en [Paso 4 de P5.1](../index.html#crud-listado-detallado), antes del bloque final que se copia en `lib/main.dart`.

## Orden para aprenderlo

Se explican nueve conceptos, en este orden:

1. La lista `List<Vehiculo>` y `vehiculos.add(...)`, creada en el paso 1.
2. Qué diferencia hay entre `ListView(children: [...])` y `ListView.builder`.
3. `SizedBox(height: 12)`, para separar el botón de la lista.
4. `itemCount: vehiculos.length`, y resultados con 0, 1 o 3 carros.
5. `itemBuilder: (context, indice)`, `context` y las posiciones que empiezan en cero.
6. `vehiculos[indice]` y la variable local `vehiculo`.
7. `return ListTile(...)`, `title`, `subtitle` y el operador `? :` para mostrar disponibilidad.
8. `shrinkWrap: true` y `NeverScrollableScrollPhysics()` para el formulario ya desplazable de P1.
9. Paréntesis, llaves, comas, `return` y cierres de la función.

La misma sección muestra las propiedades comunes de `ListTile` (incluidos `leading`, `trailing`, `onTap` y `dense`), una simulación para 0/1/3 objetos, y explica por qué `Expanded` vertical es una alternativa válida **solo cuando el padre proporciona altura limitada**.

Los pasos 5 y 6 añaden `IconButton` para editar y eliminar. La edición se aborda después de mostrar las filas porque depende del índice de `itemBuilder`.

## Archivo principal comprobado

El archivo [`etapas/paso_12b_crud.dart`](../etapas/paso_12b_crud.dart) se sincronizó con el código final visible en la guía. También se ajustaron [P6](../etapas/paso_13_extraccion.dart) y [P7](../etapas/paso_14_navegacion.dart) para no reintroducir una `Expanded` vertical dentro de `SingleChildScrollView`.

Estas clases son referencias de aprendizaje: si el estudiante ya personalizó su proyecto, debe agregar el fragmento al `main.dart` existente y preservar sus `imports`, colores, controladores y widgets.

## Pruebas

```powershell
node tests/verificar-listado-crud.mjs
node tests/validar-secuencia-flutter.mjs
```

Además de la validación estática, se probó con Chrome el comportamiento de la simulación (0, 1, 3 y 0 objetos) en escritorio y móvil, y se compiló el código real Flutter con pruebas de `ListView.builder`, entrada de texto, edición, eliminación y altura reducida por teclado.

## Referencias oficiales

- [ListView.builder](https://api.flutter.dev/flutter/widgets/ListView/ListView.builder.html)
- [ListTile](https://api.flutter.dev/flutter/material/ListTile-class.html)
- [SingleChildScrollView](https://api.flutter.dev/flutter/widgets/SingleChildScrollView-class.html)
