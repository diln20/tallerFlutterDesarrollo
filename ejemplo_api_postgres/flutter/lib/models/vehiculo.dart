class Vehiculo {
  const Vehiculo({
    required this.id,
    required this.nombre,
    required this.anio,
    required this.precio,
    required this.correo,
    required this.disponible,
    this.favorito = false,
  });

  final int id;
  final String nombre;
  final int anio;
  final double precio;
  final String correo;
  final bool disponible;
  final bool favorito;

  Vehiculo copiarCon({bool? disponible, bool? favorito}) {
    return Vehiculo(
      id: id,
      nombre: nombre,
      anio: anio,
      precio: precio,
      correo: correo,
      disponible: disponible ?? this.disponible,
      favorito: favorito ?? this.favorito,
    );
  }

  factory Vehiculo.fromJson(Map<String, dynamic> json) {
    return Vehiculo(
      id: json['id'] as int,
      nombre: json['nombre'] as String,
      anio: json['anio'] as int,
      precio: (json['precio'] as num).toDouble(),
      correo: json['correo'] as String,
      disponible: json['disponible'] as bool,
    );
  }
}
