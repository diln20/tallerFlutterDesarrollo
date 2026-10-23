import 'package:flutter_bloc/flutter_bloc.dart';
import '../models/vehiculo.dart';
import 'vehiculos_evento.dart';
import 'vehiculos_estado.dart';

class VehiculosBloc extends Bloc<VehiculosEvento, VehiculosEstado> {
  VehiculosBloc()
      : super(
          const VehiculosEstado(
            vehiculos: [],
            visibles: [],
            busqueda: '',
          ),
        ) {
    on<VehiculoGuardado>((evento, emit) {
      final nombre = evento.nombre.trim();
      if (nombre.length < 3) {
        return;
      }
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
        final anterior = copia[indice];
        copia[indice] = Vehiculo(
          nombre: nombre,
          anio: evento.anio,
          precio: evento.precio,
          correo: evento.correo.trim(),
          disponible: anterior.disponible,
        );
      } else {
        return;
      }
      _publicar(emit, copia, state.busqueda, null);
    });

    on<EdicionIniciada>((evento, emit) {
      if (evento.indice < 0 || evento.indice >= state.vehiculos.length) {
        return;
      }
      _publicar(emit, state.vehiculos, state.busqueda, evento.indice);
    });

    on<EdicionCancelada>((evento, emit) {
      _publicar(emit, state.vehiculos, state.busqueda, null);
    });

    on<VehiculoEliminado>((evento, emit) {
      if (evento.indice < 0 || evento.indice >= state.vehiculos.length) {
        return;
      }
      final copia = List<Vehiculo>.from(state.vehiculos)
        ..removeAt(evento.indice);
      _publicar(emit, copia, state.busqueda, null);
    });

    on<BusquedaCambiada>((evento, emit) {
      _publicar(
        emit,
        state.vehiculos,
        evento.texto,
        state.indiceEnEdicion,
      );
    });
  }

  void _publicar(
    Emitter<VehiculosEstado> emit,
    List<Vehiculo> vehiculos,
    String busqueda,
    int? indiceEnEdicion,
  ) {
    final texto = busqueda.trim().toLowerCase();
    final visibles = vehiculos.where((vehiculo) {
      return vehiculo.nombre.toLowerCase().contains(texto);
    }).toList();

    emit(
      VehiculosEstado(
        vehiculos: List<Vehiculo>.unmodifiable(vehiculos),
        visibles: List<Vehiculo>.unmodifiable(visibles),
        busqueda: busqueda,
        indiceEnEdicion: indiceEnEdicion,
      ),
    );
  }
}
