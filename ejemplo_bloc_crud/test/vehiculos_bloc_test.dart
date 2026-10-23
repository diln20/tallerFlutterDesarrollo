import 'package:flutter_test/flutter_test.dart';
import 'package:tienda_bloc_crud/bloc/vehiculos_bloc.dart';
import 'package:tienda_bloc_crud/bloc/vehiculos_evento.dart';

void main() {
  test('crear, editar, buscar y eliminar conservan el estado', () async {
    final bloc = VehiculosBloc();

    bloc.add(VehiculoGuardado('  Renault 9  '));
    await bloc.stream.first;
    expect(bloc.state.vehiculos.single.nombre, 'Renault 9');

    bloc.add(EdicionIniciada(0));
    await bloc.stream.first;
    expect(bloc.state.indiceEnEdicion, 0);

    bloc.add(VehiculoGuardado('Mazda 3'));
    await bloc.stream.first;
    expect(bloc.state.vehiculos.single.nombre, 'Mazda 3');
    expect(bloc.state.indiceEnEdicion, isNull);

    bloc.add(BusquedaCambiada(' MAZDA '));
    await bloc.stream.first;
    expect(bloc.state.visibles.single.nombre, 'Mazda 3');

    bloc.add(BusquedaCambiada('modelo inexistente'));
    await bloc.stream.first;
    expect(bloc.state.visibles, isEmpty);

    bloc.add(VehiculoEliminado(0));
    await bloc.stream.first;
    expect(bloc.state.vehiculos, isEmpty);

    await bloc.close();
  });
}
