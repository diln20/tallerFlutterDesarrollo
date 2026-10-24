import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tienda_bloc_crud/main.dart';
import 'package:tienda_bloc_crud/bloc/vehiculos_bloc.dart';
import 'package:tienda_bloc_crud/bloc/vehiculos_evento.dart';

void main() {
  test('Deshacer devuelve el veh�culo a su posici�n y conserva favorito', () async {
    final bloc = VehiculosBloc();
    addTearDown(bloc.close);
    bloc.add(VehiculoGuardado(
      nombre: 'Renault 9', anio: 1994, precio: 17000, correo: 'a@ejemplo.com',
    ));
    await bloc.stream.firstWhere((s) => s.vehiculos.length == 1);
    bloc.add(FavoritoAlternado(0));
    final saved = await bloc.stream.firstWhere((s) => s.vehiculos.single.favorito);
    final item = saved.vehiculos.single;
    bloc.add(VehiculoEliminado(0));
    await bloc.stream.firstWhere((s) => s.vehiculos.isEmpty);
    bloc.add(VehiculoRestaurado(0, item));
    final restored=await bloc.stream.firstWhere((s)=>s.vehiculos.isNotEmpty);
    expect(restored.vehiculos.single.nombre,'Renault 9');
    expect(restored.vehiculos.single.favorito,isTrue);
  });

  testWidgets('Indicadores de Resumen y bot�n Explorar favoritos', (tester) async {
    tester.view.physicalSize = const Size(1250, 1400);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(const MainApp());
    final context=tester.element(find.byType(TiendaPage));
    final bloc=context.read<VehiculosBloc>();
    bloc.add(VehiculoGuardado(
      nombre:'Renault 9', anio:1994, precio:12000, correo:'a@ejemplo.com',
    ));
    await tester.pumpAndSettle();
    bloc.add(FavoritoAlternado(0));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Resumen').last);
    await tester.pumpAndSettle();
    expect(find.text('Resumen de la Tienda'),findsOneWidget);
    expect(find.text('Registrados'),findsOneWidget);
    expect(find.text('Favoritos'),findsWidgets);
    expect(find.text('Precio promedio'),findsOneWidget);
    expect(find.byType(LinearProgressIndicator),findsOneWidget);
    await tester.tap(find.text('Explorar favoritos'));
    await tester.pumpAndSettle();
    expect(find.byType(PopupMenuButton<String>),findsWidgets);
    expect(find.text('Renault 9'),findsWidgets);
  });
}

