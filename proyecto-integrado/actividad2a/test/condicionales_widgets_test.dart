import 'package:actividad2a/models/vehiculo.dart';
import 'package:actividad2a/widgets/vehiculo_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

// Pruebas del proyecto REAL: estado disponible, callbacks y acciones por rol.
// CatalogoPage decide qué callbacks autoriza según el permiso del usuario.
// VehiculoCard solo muestra el menú cuando recibe alguno de esos callbacks.
Vehiculo crearVehiculo({bool disponible = true, bool favorito = false}) {
  return Vehiculo(
    id: 31,
    nombre: 'Renault Logan',
    marca: 'Renault',
    precio: 35000000,
    disponible: disponible,
    esFavorito: favorito,
  );
}

Widget appConTarjeta({
  required Vehiculo vehiculo,
  required VoidCallback onFavorito,
  VoidCallback? onEditar,
  VoidCallback? onEliminar,
}) {
  return MaterialApp(
    home: Scaffold(
      body: SingleChildScrollView(
        child: VehiculoCard(
          vehiculo: vehiculo,
          urlImagen: (ruta) => 'http://localhost:8091$ruta',
          onFavorito: onFavorito,
          onEditar: onEditar,
          onEliminar: onEliminar,
        ),
      ),
    ),
  );
}

void main() {
  testWidgets('Disponible y cliente sin acciones de edición', (tester) async {
    await tester.binding.setSurfaceSize(const Size(390, 844));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    var favoritos = 0;

    await tester.pumpWidget(
      appConTarjeta(
        vehiculo: crearVehiculo(),
        onFavorito: () => favoritos++,
      ),
    );

    expect(find.text('Renault Logan'), findsOneWidget);
    expect(find.text('Disponible'), findsOneWidget);
    expect(find.text('No disponible'), findsNothing);
    expect(find.byIcon(Icons.directions_car_filled), findsOneWidget);
    expect(find.byTooltip('Opciones del vehículo'), findsNothing);

    await tester.tap(find.byTooltip('Marcar favorito'));
    expect(favoritos, 1);
    expect(tester.takeException(), isNull);
  });

  testWidgets('No disponible y vendedor solo puede editar', (tester) async {
    var ediciones = 0;
    await tester.binding.setSurfaceSize(const Size(1100, 900));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    await tester.pumpWidget(
      appConTarjeta(
        vehiculo: crearVehiculo(disponible: false),
        onFavorito: () {},
        onEditar: () => ediciones++,
      ),
    );
    expect(find.text('No disponible'), findsOneWidget);
    expect(find.text('Disponible'), findsNothing);
    expect(find.byTooltip('Opciones del vehículo'), findsOneWidget);

    await tester.tap(find.byTooltip('Opciones del vehículo'));
    await tester.pumpAndSettle();
    expect(find.text('Editar vehículo'), findsOneWidget);
    expect(find.text('Eliminar vehículo'), findsNothing);

    await tester.tap(find.text('Editar vehículo'));
    await tester.pumpAndSettle();
    expect(ediciones, 1);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Administrador recibe las acciones editar y eliminar',
      (tester) async {
    var eliminaciones = 0;

    await tester.pumpWidget(
      appConTarjeta(
        vehiculo: crearVehiculo(favorito: true),
        onFavorito: () {},
        onEditar: () {},
        onEliminar: () => eliminaciones++,
      ),
    );

    expect(find.byTooltip('Quitar de favoritos'), findsOneWidget);
    await tester.tap(find.byTooltip('Opciones del vehículo'));
    await tester.pumpAndSettle();
    expect(find.text('Editar vehículo'), findsOneWidget);
    expect(find.text('Eliminar vehículo'), findsOneWidget);

    await tester.tap(find.text('Eliminar vehículo'));
    await tester.pumpAndSettle();
    expect(eliminaciones, 1);
    expect(tester.takeException(), isNull);
  });
}
