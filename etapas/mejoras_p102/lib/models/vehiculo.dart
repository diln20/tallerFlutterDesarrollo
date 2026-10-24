class Vehiculo {
  const Vehiculo({
    required this.nombre,
    required this.anio,
    required this.precio,
    required this.correo,
    this.disponible = true,
    this.favorito = false,
  });

  final String nombre;
  final int anio;
  final double precio;
  final String correo;
  final bool disponible;
  final bool favorito;

  Vehiculo copiarCon({
    String? nombre,
    int? anio,
    double? precio,
    String? correo,
    bool? disponible,
    bool? favorito,
  }) {
    return Vehiculo(
      nombre: nombre ?? this.nombre,
      anio: anio ?? this.anio,
      precio: precio ?? this.precio,
      correo: correo ?? this.correo,
      disponible: disponible ?? this.disponible,
      favorito: favorito ?? this.favorito,
    );
  }
}
