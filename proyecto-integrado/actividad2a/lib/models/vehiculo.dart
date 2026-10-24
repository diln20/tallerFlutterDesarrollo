class Vehiculo {
  const Vehiculo({
    required this.id,
    required this.nombre,
    required this.marca,
    required this.precio,
    required this.disponible,
    this.imagenUrl,
    this.esFavorito = false,
  });

  final int id;
  final String nombre;
  final String marca;
  final double precio;
  final bool disponible;
  final String? imagenUrl;
  final bool esFavorito;

  factory Vehiculo.fromJson(Map<String, dynamic> json) => Vehiculo(
    id: (json['id'] as num).toInt(),
    nombre: json['nombre'] as String,
    marca: json['marca'] as String,
    precio: (json['precio'] as num).toDouble(),
    disponible: json['disponible'] as bool,
    imagenUrl: json['imagen_url'] as String?,
    esFavorito: json['es_favorito'] as bool? ?? false,
  );
}

class DatosVehiculo {
  const DatosVehiculo({
    required this.nombre,
    required this.marca,
    required this.precio,
    required this.disponible,
  });

  final String nombre;
  final String marca;
  final double precio;
  final bool disponible;

  Map<String, dynamic> toJson() => {
    'nombre': nombre,
    'marca': marca,
    'precio': precio,
    'disponible': disponible,
  };
}

class PaginaVehiculos {
  const PaginaVehiculos({
    required this.datos,
    required this.pagina,
    required this.total,
    required this.totalPaginas,
  });

  final List<Vehiculo> datos;
  final int pagina;
  final int total;
  final int totalPaginas;

  factory PaginaVehiculos.fromJson(Map<String, dynamic> json) =>
      PaginaVehiculos(
        datos: (json['datos'] as List<dynamic>)
            .map((v) => Vehiculo.fromJson(v as Map<String, dynamic>))
            .toList(),
        pagina: (json['pagina'] as num).toInt(),
        total: (json['total'] as num).toInt(),
        totalPaginas: (json['total_paginas'] as num).toInt(),
      );
}

class ResumenVehiculos {
  const ResumenVehiculos({
    required this.total,
    required this.disponibles,
    required this.favoritos,
  });

  final int total;
  final int disponibles;
  final int favoritos;

  factory ResumenVehiculos.fromJson(Map<String, dynamic> json) =>
      ResumenVehiculos(
        total: (json['total'] as num).toInt(),
        disponibles: (json['disponibles'] as num).toInt(),
        favoritos: (json['favoritos'] as num).toInt(),
      );
}
