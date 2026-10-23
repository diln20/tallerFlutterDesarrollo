class Vehiculo {
  const Vehiculo({
    required this.id,
    required this.nombre,
    required this.anio,
    required this.precio,
    required this.correo,
    required this.disponible,
  });
  final int id;
  final String nombre;
  final int anio;
  final double precio;
  final String correo;
  final bool disponible;

  factory Vehiculo.fromJson(Map<String, dynamic> json) => Vehiculo(
        id: json['id'] as int,
        nombre: json['nombre'] as String,
        anio: json['anio'] as int,
        precio: (json['precio'] as num).toDouble(),
        correo: json['correo'] as String,
        disponible: json['disponible'] as bool,
      );

  Map<String, dynamic> toJson() => {
        'nombre': nombre,
        'anio': anio,
        'precio': precio,
        'correo': correo,
        'disponible': disponible,
      };
}
