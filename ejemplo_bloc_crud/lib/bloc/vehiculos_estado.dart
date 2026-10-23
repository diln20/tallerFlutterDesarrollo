import '../models/vehiculo.dart';

class VehiculosEstado {
  const VehiculosEstado({
    required this.vehiculos,
    required this.visibles,
    required this.busqueda,
    this.indiceEnEdicion,
  });

  final List<Vehiculo> vehiculos;
  final List<Vehiculo> visibles;
  final String busqueda;
  final int? indiceEnEdicion;
}
