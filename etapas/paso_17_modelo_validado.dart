class Vehiculo {
  const Vehiculo({
    required this.nombre,
    required this.anio,
    required this.precio,
    required this.correo,
    this.disponible = true,
  });

  final String nombre;
  final int anio;
  final double precio;
  final String correo;
  final bool disponible;
}
