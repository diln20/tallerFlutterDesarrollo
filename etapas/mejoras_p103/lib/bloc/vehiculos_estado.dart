import '../models/vehiculo.dart';

enum FiltroVehiculos { todos, disponibles, favoritos }

enum OrdenVehiculos { recientes, nombre, precioMenor, precioMayor }

class VehiculosEstado {
  const VehiculosEstado({
    required this.vehiculos,
    required this.visibles,
    required this.busqueda,
    this.indiceEnEdicion,
    this.filtro = FiltroVehiculos.todos,
    this.orden = OrdenVehiculos.recientes,
  });

  final List<Vehiculo> vehiculos;
  final List<Vehiculo> visibles;
  final String busqueda;
  final int? indiceEnEdicion;
  final FiltroVehiculos filtro;
  final OrdenVehiculos orden;
}
