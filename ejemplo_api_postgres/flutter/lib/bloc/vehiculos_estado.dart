import '../models/vehiculo.dart';

class VehiculosEstado {
  const VehiculosEstado({
    required this.vehiculos,
    required this.visibles,
    required this.busqueda,
    this.idEnEdicion,
    this.cargando = false,
    this.enviando = false,
    this.error,
  });

  final List<Vehiculo> vehiculos;
  final List<Vehiculo> visibles;
  final String busqueda;
  final int? idEnEdicion;
  final bool cargando;
  final bool enviando;
  final String? error;
}
