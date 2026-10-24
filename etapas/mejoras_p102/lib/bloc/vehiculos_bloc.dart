import 'package:flutter_bloc/flutter_bloc.dart';
import '../models/vehiculo.dart';
import 'vehiculos_evento.dart';
import 'vehiculos_estado.dart';

class VehiculosBloc extends Bloc<VehiculosEvento, VehiculosEstado> {
  VehiculosBloc()
      : super(const VehiculosEstado(
          vehiculos: [],
          visibles: [],
          busqueda: '',
        )) {
    on<VehiculoGuardado>((evento, emit) {
      final nombre = evento.nombre.trim();
      if (nombre.length < 3) return;
      final copia = List<Vehiculo>.from(state.vehiculos);
      final indice = state.indiceEnEdicion;
      if (indice == null) {
        copia.add(Vehiculo(
          nombre: nombre,
          anio: evento.anio,
          precio: evento.precio,
          correo: evento.correo.trim(),
        ));
      } else if (indice >= 0 && indice < copia.length) {
        // copiarCon conserva favorito y disponible cuando se edita.
        copia[indice] = copia[indice].copiarCon(
          nombre: nombre,
          anio: evento.anio,
          precio: evento.precio,
          correo: evento.correo.trim(),
        );
      } else {
        return;
      }
      _publicar(emit, copia, indiceEnEdicion: null);
    });

    on<EdicionIniciada>((evento, emit) {
      if (evento.indice < 0 || evento.indice >= state.vehiculos.length) return;
      _publicar(emit, state.vehiculos, indiceEnEdicion: evento.indice);
    });

    on<EdicionCancelada>((evento, emit) {
      _publicar(emit, state.vehiculos, indiceEnEdicion: null);
    });

    on<VehiculoEliminado>((evento, emit) {
      if (evento.indice < 0 || evento.indice >= state.vehiculos.length) return;
      final copia = List<Vehiculo>.from(state.vehiculos)..removeAt(evento.indice);
      _publicar(emit, copia, indiceEnEdicion: null);
    });

    on<BusquedaCambiada>((evento, emit) {
      _publicar(emit, state.vehiculos, busqueda: evento.texto);
    });

    on<FavoritoAlternado>((evento, emit) {
      final indice = evento.indice;
      if (indice < 0 || indice >= state.vehiculos.length) return;
      final copia = List<Vehiculo>.from(state.vehiculos);
      copia[indice] = copia[indice].copiarCon(favorito: !copia[indice].favorito);
      _publicar(emit, copia);
    });

    on<DisponibilidadAlternada>((evento, emit) {
      final indice = evento.indice;
      if (indice < 0 || indice >= state.vehiculos.length) return;
      final copia = List<Vehiculo>.from(state.vehiculos);
      copia[indice] = copia[indice].copiarCon(disponible: !copia[indice].disponible);
      _publicar(emit, copia);
    });

    on<FiltroCambiado>((evento, emit) {
      _publicar(emit, state.vehiculos, filtro: evento.filtro);
    });

    on<OrdenCambiado>((evento, emit) {
      _publicar(emit, state.vehiculos, orden: evento.orden);
    });
  }

  void _publicar(
    Emitter<VehiculosEstado> emit,
    List<Vehiculo> vehiculos, {
    String? busqueda,
    int? indiceEnEdicion,
    FiltroVehiculos? filtro,
    OrdenVehiculos? orden,
  }) {
    final actualBusqueda = busqueda ?? state.busqueda;
    final actualFiltro = filtro ?? state.filtro;
    final actualOrden = orden ?? state.orden;
    final texto = actualBusqueda.trim().toLowerCase();

    final visibles = vehiculos.where((vehiculo) {
      final coincide = vehiculo.nombre.toLowerCase().contains(texto);
      if (!coincide) return false;
      switch (actualFiltro) {
        case FiltroVehiculos.todos:
          return true;
        case FiltroVehiculos.disponibles:
          return vehiculo.disponible;
        case FiltroVehiculos.favoritos:
          return vehiculo.favorito;
      }
    }).toList();

    // La copia ordenada NO cambia el orden del inventario original.
    switch (actualOrden) {
      case OrdenVehiculos.recientes:
        break;
      case OrdenVehiculos.nombre:
        visibles.sort((a, b) => a.nombre.toLowerCase()
            .compareTo(b.nombre.toLowerCase()));
        break;
      case OrdenVehiculos.precioMenor:
        visibles.sort((a, b) => a.precio.compareTo(b.precio));
        break;
      case OrdenVehiculos.precioMayor:
        visibles.sort((a, b) => b.precio.compareTo(a.precio));
        break;
    }

    emit(VehiculosEstado(
      vehiculos: List<Vehiculo>.unmodifiable(vehiculos),
      visibles: List<Vehiculo>.unmodifiable(visibles),
      busqueda: actualBusqueda,
      indiceEnEdicion: indiceEnEdicion,
      filtro: actualFiltro,
      orden: actualOrden,
    ));
  }
}
