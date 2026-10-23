import '../models/pagina_vehiculos.dart';
import '../models/sesion_usuario.dart';

class VehiculosEstado {
  const VehiculosEstado({
    required this.pagina,
    this.sesion,
    this.busqueda = '',
    this.cargando = false,
    this.enviando = false,
    this.error,
    this.idEnEdicion,
    this.revisionGuardado = 0,
  });

  final SesionUsuario? sesion;
  final PaginaVehiculos pagina;
  final String busqueda;
  final bool cargando;
  final bool enviando;
  final String? error;
  final int? idEnEdicion;
  final int revisionGuardado;

  bool get autenticado => sesion != null;
  bool get puedeEditar => sesion?.puedeModificar ?? false;

  factory VehiculosEstado.inicial() =>
      VehiculosEstado(pagina: PaginaVehiculos.vacia());

  VehiculosEstado copyWith({
    SesionUsuario? sesion,
    PaginaVehiculos? pagina,
    String? busqueda,
    bool? cargando,
    bool? enviando,
    String? error,
    bool borrarError = false,
    int? idEnEdicion,
    bool limpiarEdicion = false,
    int? revisionGuardado,
  }) =>
      VehiculosEstado(
        sesion: sesion ?? this.sesion,
        pagina: pagina ?? this.pagina,
        busqueda: busqueda ?? this.busqueda,
        cargando: cargando ?? this.cargando,
        enviando: enviando ?? this.enviando,
        error: borrarError ? null : (error ?? this.error),
        idEnEdicion:
            limpiarEdicion ? null : (idEnEdicion ?? this.idEnEdicion),
        revisionGuardado: revisionGuardado ?? this.revisionGuardado,
      );
}
