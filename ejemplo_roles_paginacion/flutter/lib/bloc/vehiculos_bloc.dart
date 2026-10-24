import 'package:flutter_bloc/flutter_bloc.dart';
import '../models/pagina_vehiculos.dart';
import '../repositories/vehiculos_api.dart';
import 'vehiculos_evento.dart';
import 'vehiculos_estado.dart';

class VehiculosBloc extends Bloc<VehiculosEvento, VehiculosEstado> {
  VehiculosBloc(this.api) : super(VehiculosEstado.inicial()) {
    on<SesionIniciada>((evento, emit) async {
      emit(VehiculosEstado.inicial().copyWith(cargando: true));
      try {
        final usuario = await api.iniciarSesion(
          evento.usuario.trim(),
          evento.contrasena,
        );
        emit(VehiculosEstado.inicial().copyWith(sesion: usuario));
        await _cargar(emit, numero: 1);
      } catch (error) {
        api.cerrarSesion();
        emit(VehiculosEstado.inicial().copyWith(error: _mensaje(error)));
      }
    });

    on<SesionCerrada>((evento, emit) {
      api.cerrarSesion();
      emit(VehiculosEstado.inicial());
    });

    on<PaginaSolicitada>((evento, emit) async {
      if (state.cargando || state.enviando) return;
      final maximo = state.pagina.totalPaginas;
      if (evento.pagina < 1 || evento.pagina > maximo) return;
      await _cargar(emit, numero: evento.pagina);
    });

    on<TamanoPaginaCambiado>((evento, emit) async {
      if (state.cargando || state.enviando) return;
      if (![5, 10, 20].contains(evento.tamano)) return;
      await _cargar(emit, numero: 1, tamano: evento.tamano);
    });

    on<BusquedaSolicitada>((evento, emit) async {
      if (state.cargando || state.enviando) return;
      await _cargar(emit, numero: 1, buscar: evento.texto.trim());
    });

    on<EdicionIniciada>((evento, emit) {
      if (!state.puedeEditar || state.enviando) return;
      if (state.pagina.datos.any((v) => v.id == evento.id)) {
        emit(state.copyWith(idEnEdicion: evento.id, borrarError: true));
      }
    });

    on<EdicionCancelada>((evento, emit) {
      emit(state.copyWith(limpiarEdicion: true));
    });

    on<VehiculoGuardado>((evento, emit) async {
      if (!state.puedeEditar || state.enviando) return;
      final id = state.idEnEdicion;
      emit(state.copyWith(enviando: true, borrarError: true));
      try {
        if (id == null) {
          await api.crear(
            nombre: evento.nombre,
            anio: evento.anio,
            precio: evento.precio,
            correo: evento.correo,
          );
        } else {
          final original = state.pagina.datos.firstWhere((v) => v.id == id);
          await api.actualizar(
            id: id,
            nombre: evento.nombre,
            anio: evento.anio,
            precio: evento.precio,
            correo: evento.correo,
            disponible: original.disponible,
          );
        }
        final cargado = await _cargar(emit, numero: state.pagina.pagina);
        if (cargado) {
          emit(state.copyWith(
            enviando: false,
            limpiarEdicion: true,
            revisionGuardado: state.revisionGuardado + 1,
          ));
        } else {
          emit(state.copyWith(enviando: false));
        }
      } catch (error) {
        emit(state.copyWith(enviando: false, error: _mensaje(error)));
      }
    });

    on<DisponibilidadAlternada>((evento, emit) async {
      if (!state.puedeEditar || state.enviando) return;
      final actuales=state.pagina.datos.where((v) => v.id == evento.id);
      if (actuales.isEmpty) return;
      final v=actuales.first;
      emit(state.copyWith(enviando: true, borrarError: true));
      try {
        await api.actualizar(
          id: v.id,
          nombre: v.nombre,
          anio: v.anio,
          precio: v.precio,
          correo: v.correo,
          disponible: !v.disponible,
        );
        await _cargar(emit, numero: state.pagina.pagina);
        emit(state.copyWith(enviando: false));
      } catch (error) {
        emit(state.copyWith(enviando: false, error: _mensaje(error)));
      }
    });

    on<VehiculoEliminado>((evento, emit) async {
      if (!state.puedeEditar || state.enviando) return;
      emit(state.copyWith(enviando: true, borrarError: true));
      try {
        await api.eliminar(evento.id);
        final cargado = await _cargar(emit, numero: state.pagina.pagina);
        emit(state.copyWith(
          enviando: false,
          limpiarEdicion: cargado,
        ));
      } catch (error) {
        emit(state.copyWith(enviando: false, error: _mensaje(error)));
      }
    });
  }

  final VehiculosApi api;

  Future<bool> _cargar(
    Emitter<VehiculosEstado> emit, {
    required int numero,
    int? tamano,
    String? buscar,
  }) async {
    if (!state.autenticado) return false;
    final tamanoSolicitado = tamano ?? state.pagina.tamano;
    final filtro = buscar ?? state.busqueda;
    emit(state.copyWith(cargando: true, borrarError: true));
    try {
      var resultado = await api.listarPagina(
        pagina: numero,
        tamano: tamanoSolicitado,
        buscar: filtro,
      );
      if (numero > 1 && numero > resultado.totalPaginas) {
        final ultima = resultado.totalPaginas < 1 ? 1 : resultado.totalPaginas;
        resultado = await api.listarPagina(
          pagina: ultima,
          tamano: tamanoSolicitado,
          buscar: filtro,
        );
      }
      emit(state.copyWith(
        pagina: resultado,
        busqueda: filtro,
        cargando: false,
        limpiarEdicion: true,
      ));
      return true;
    } catch (error) {
      emit(state.copyWith(
        pagina: PaginaVehiculos.vacia(
          pagina: numero,
          tamano: tamanoSolicitado,
        ),
        busqueda: filtro,
        cargando: false,
        error: _mensaje(error),
      ));
      return false;
    }
  }

  String _mensaje(Object error) {
    if (error is ErrorApi) return error.mensaje;
    return 'No se pudo contactar la API. Revisa la conexión y vuelve a intentar.';
  }

  @override
  Future<void> close() {
    api.cerrar();
    return super.close();
  }
}
