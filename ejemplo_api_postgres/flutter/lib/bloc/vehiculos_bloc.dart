import 'package:flutter_bloc/flutter_bloc.dart';
import '../models/vehiculo.dart';
import '../repositories/vehiculos_api.dart';
import 'vehiculos_evento.dart';
import 'vehiculos_estado.dart';

class VehiculosBloc extends Bloc<VehiculosEvento, VehiculosEstado> {
  VehiculosBloc(this.api)
      : super(const VehiculosEstado(
          vehiculos: [],
          visibles: [],
          busqueda: '',
        )) {
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
        emit(_nuevoEstado(datos));
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
        _favoritos.remove(evento.id);
        final datos = await api.listar();
        emit(_nuevoEstado(datos));
      } catch (error) {
        emit(_nuevoEstado(state.vehiculos, error: _mensaje(error)));
      }
    });

    // La restauración remota crea un nuevo registro: el servidor asigna otro ID.
    // No se modifica la lista en memoria sin confirmar primero la respuesta HTTP.
    on<VehiculoRestaurado>((evento, emit) async {
      if (state.enviando) return;
      emit(_nuevoEstado(state.vehiculos, enviando: true));
      try {
        final v = evento.vehiculo;
        await api.crear(
          nombre: v.nombre,
          anio: v.anio,
          precio: v.precio,
          correo: v.correo,
          disponible: v.disponible,
        );
        final datos = await api.listar();
        emit(_nuevoEstado(datos));
      } catch (error) {
        emit(_nuevoEstado(state.vehiculos, error: _mensaje(error)));
      }
    });

    on<EdicionIniciada>((evento, emit) {
      if (state.vehiculos.any((v) => v.id == evento.id)) {
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

    // Favoritos es una preferencia visual local de esta versión.
    on<FavoritoAlternado>((evento, emit) {
      if (!state.vehiculos.any((v) => v.id == evento.id)) return;
      if (!_favoritos.add(evento.id)) _favoritos.remove(evento.id);
      emit(_nuevoEstado(state.vehiculos,
          idEnEdicion: state.idEnEdicion));
    });

    on<DisponibilidadAlternada>((evento, emit) async {
      if (state.enviando) return;
      final lista = state.vehiculos.where((v) => v.id == evento.id);
      if (lista.isEmpty) return;
      final v = lista.first;
      emit(_nuevoEstado(state.vehiculos, enviando: true));
      try {
        await api.actualizar(
          id: v.id, nombre: v.nombre, anio: v.anio,
          precio: v.precio, correo: v.correo,
          disponible: !v.disponible,
        );
        emit(_nuevoEstado(await api.listar()));
      } catch (error) {
        emit(_nuevoEstado(state.vehiculos, error: _mensaje(error)));
      }
    });

    on<FiltroCambiado>((evento, emit) {
      emit(_nuevoEstado(
        state.vehiculos,
        filtro: evento.filtro,
        idEnEdicion: state.idEnEdicion,
      ));
    });

    on<OrdenCambiado>((evento, emit) {
      emit(_nuevoEstado(
        state.vehiculos,
        orden: evento.orden,
        idEnEdicion: state.idEnEdicion,
      ));
    });
  }

  final VehiculosApi api;
  final Set<int> _favoritos = {};

  VehiculosEstado _nuevoEstado(
    List<Vehiculo> vehiculos, {
    String? busqueda,
    int? idEnEdicion,
    FiltroVehiculos? filtro,
    OrdenVehiculos? orden,
    bool cargando = false,
    bool enviando = false,
    String? error,
  }) {
    final actualBusqueda = busqueda ?? state.busqueda;
    final actualFiltro = filtro ?? state.filtro;
    final actualOrden = orden ?? state.orden;
    final texto = actualBusqueda.trim().toLowerCase();

    final datos = vehiculos
        .map((v) => v.copiarCon(favorito: _favoritos.contains(v.id)))
        .toList();
    final visibles = datos.where((v) {
      if (!v.nombre.toLowerCase().contains(texto)) return false;
      switch (actualFiltro) {
        case FiltroVehiculos.todos:
          return true;
        case FiltroVehiculos.disponibles:
          return v.disponible;
        case FiltroVehiculos.favoritos:
          return v.favorito;
      }
    }).toList();

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

    return VehiculosEstado(
      vehiculos: List<Vehiculo>.unmodifiable(datos),
      visibles: List<Vehiculo>.unmodifiable(visibles),
      busqueda: actualBusqueda,
      idEnEdicion: idEnEdicion,
      filtro: actualFiltro,
      orden: actualOrden,
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
