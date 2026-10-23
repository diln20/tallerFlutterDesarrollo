class Vehiculo {
  const Vehiculo({
    required this.nombre,
    this.disponible = true,
  });

  final String nombre;
  final bool disponible;
}
