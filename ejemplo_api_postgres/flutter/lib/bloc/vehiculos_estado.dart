import '../models/vehiculo.dart';

enum FiltroVehiculos { todos, disponibles, favoritos }
enum OrdenVehiculos { recientes, nombre, precioMenor, precioMayor }

class VehiculosEstado {
  const VehiculosEstado({
    required this.vehiculos,
    required this.visibles,
    required this.busqueda,
    this.idEnEdicion,
    this.cargando = false,
    this.enviando = false,
    this.error,
    this.filtro = FiltroVehiculos.todos,
    this.orden = OrdenVehiculos.recientes,
  });

  final List<Vehiculo> vehiculos;
  final List<Vehiculo> visibles;
  final String busqueda;
  final int? idEnEdicion;
  final bool cargando;
  final bool enviando;
  final String? error;
  final FiltroVehiculos filtro;
  final OrdenVehiculos orden;
}
