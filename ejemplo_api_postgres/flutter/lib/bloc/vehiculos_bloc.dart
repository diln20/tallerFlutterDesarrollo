import 'package:flutter_bloc/flutter_bloc.dart';
import '../models/vehiculo.dart';
import '../repositories/vehiculos_api.dart';
import 'vehiculos_evento.dart';
import 'vehiculos_estado.dart';

class VehiculosBloc extends Bloc<VehiculosEvento, VehiculosEstado> {
  VehiculosBloc(this.api)
      : super(
          const VehiculosEstado(
            vehiculos: [],
            visibles: [],
            busqueda: '',
          ),
        ) {
    on<VehiculosCargados>((evento, emit) async {
      emit(_nuevoEstado(state.vehiculos, cargando: true));
      try {
        final datos = await api.listar();
        emit(_nuevoEstado(datos));
      } catch (error) {
        emit(_nuevoEstado(state.vehiculos, error: _mensaje(error)));
      }
    });

    on<VehiculoGuardado>((evento, emit) async {
      if (state.enviando) return;
      final id = state.idEnEdicion;
      emit(_nuevoEstado(
        state.vehiculos,
        idEnEdicion: id,
        enviando: true,
      ));
      try {
        if (id == null) {
          await api.crear(
            nombre: evento.nombre,
            anio: evento.anio,
            precio: evento.precio,
            correo: evento.correo,
          );
        } else {
          final anterior = state.vehiculos.firstWhere((v) => v.id == id);
          await api.actualizar(
            id: id,
            nombre: evento.nombre,
            anio: evento.anio,
            precio: evento.precio,
            correo: evento.correo,
            disponible: anterior.disponible,
          );
        }
        final datos = await api.listar();
        emit(_nuevoEstado(datos, idEnEdicion: null));
      } catch (error) {
        emit(_nuevoEstado(
          state.vehiculos,
          idEnEdicion: state.idEnEdicion,
          error: _mensaje(error),
        ));
      }
    });

    on<VehiculoEliminado>((evento, emit) async {
      if (state.enviando) return;
      emit(_nuevoEstado(state.vehiculos, enviando: true));
      try {
        await api.eliminar(evento.id);
        final datos = await api.listar();
        emit(_nuevoEstado(datos, idEnEdicion: null));
      } catch (error) {
        emit(_nuevoEstado(
          state.vehiculos,
          idEnEdicion: state.idEnEdicion,
          error: _mensaje(error),
        ));
      }
    });

    on<EdicionIniciada>((evento, emit) {
      final existe = state.vehiculos.any((v) => v.id == evento.id);
      if (existe) {
        emit(_nuevoEstado(state.vehiculos, idEnEdicion: evento.id));
      }
    });

    on<EdicionCancelada>((evento, emit) {
      emit(_nuevoEstado(state.vehiculos));
    });

    on<BusquedaCambiada>((evento, emit) {
      emit(_nuevoEstado(
        state.vehiculos,
        busqueda: evento.texto,
        idEnEdicion: state.idEnEdicion,
        cargando: state.cargando,
        enviando: state.enviando,
        error: state.error,
      ));
    });
  }

  final VehiculosApi api;

  VehiculosEstado _nuevoEstado(
    List<Vehiculo> vehiculos, {
    String? busqueda,
    int? idEnEdicion,
    bool cargando = false,
    bool enviando = false,
    String? error,
  }) {
    final actual = busqueda ?? state.busqueda;
    final texto = actual.trim().toLowerCase();
    final visibles = vehiculos
        .where((v) => v.nombre.toLowerCase().contains(texto))
        .toList();
    return VehiculosEstado(
      vehiculos: List<Vehiculo>.unmodifiable(vehiculos),
      visibles: List<Vehiculo>.unmodifiable(visibles),
      busqueda: actual,
      idEnEdicion: idEnEdicion,
      cargando: cargando,
      enviando: enviando,
      error: error,
    );
  }

  String _mensaje(Object error) {
    return error.toString().replaceFirst('Exception: ', '');
  }

  @override
  Future<void> close() {
    api.cerrar();
    return super.close();
  }
}
