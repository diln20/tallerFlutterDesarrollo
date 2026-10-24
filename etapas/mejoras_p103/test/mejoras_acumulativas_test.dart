import 'package:flutter_test/flutter_test.dart';
import 'package:tienda_bloc_crud/bloc/vehiculos_bloc.dart';
import 'package:tienda_bloc_crud/bloc/vehiculos_evento.dart';
import 'package:tienda_bloc_crud/bloc/vehiculos_estado.dart';

Future<void> registrar(VehiculosBloc bloc, String nombre, double precio) async {
  bloc.add(VehiculoGuardado(
    nombre: nombre,
    anio: 2020,
    precio: precio,
    correo: 'cliente@ejemplo.com',
  ));
  await bloc.stream.firstWhere((estado) =>
      estado.vehiculos.any((v) => v.nombre == nombre));
}

void main() {
  test('Favorito, disponible, filtro y orden sobreviven a edicion', () async {
    final bloc = VehiculosBloc();
    addTearDown(bloc.close);
    await registrar(bloc, 'Renault 9', 15000);
    await registrar(bloc, 'Mazda 3', 25000);
    await registrar(bloc, 'Renault 21', 18000);
    bloc.add(FavoritoAlternado(0));
    await bloc.stream.firstWhere((s) => s.vehiculos.first.favorito);
    bloc.add(FiltroCambiado(FiltroVehiculos.favoritos));
    final favorites = await bloc.stream.firstWhere(
        (s) => s.filtro == FiltroVehiculos.favoritos);
    expect(favorites.visibles.map((v) => v.nombre), ['Renault 9']);
    bloc.add(EdicionIniciada(0));
    await bloc.stream.firstWhere((s) => s.indiceEnEdicion == 0);
    bloc.add(VehiculoGuardado(
        nombre: 'Renault 9 Turbo',
        anio: 1994,
        precio: 16000,
        correo: 'nuevo@ejemplo.com'));
    final edited = await bloc.stream.firstWhere(
        (s) => s.vehiculos.first.nombre == 'Renault 9 Turbo');
    expect(edited.vehiculos.first.favorito, isTrue);
    bloc.add(DisponibilidadAlternada(0));
    await bloc.stream.firstWhere((s) => !s.vehiculos.first.disponible);
    bloc.add(FiltroCambiado(FiltroVehiculos.disponibles));
    final available = await bloc.stream.firstWhere(
        (s) => s.filtro == FiltroVehiculos.disponibles);
    expect(available.visibles.length, 2);
    bloc.add(OrdenCambiado(OrdenVehiculos.precioMayor));
    final sorted = await bloc.stream.firstWhere(
        (s) => s.orden == OrdenVehiculos.precioMayor);
    expect(sorted.visibles.first.nombre, 'Mazda 3');
    expect(sorted.visibles.last.nombre, 'Renault 21');
  });
}

