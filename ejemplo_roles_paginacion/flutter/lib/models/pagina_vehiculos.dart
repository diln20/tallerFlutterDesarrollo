import 'vehiculo.dart';

class PaginaVehiculos {
  const PaginaVehiculos({
    required this.datos,
    required this.pagina,
    required this.tamano,
    required this.total,
    required this.totalPaginas,
  });
  final List<Vehiculo> datos;
  final int pagina;
  final int tamano;
  final int total;
  final int totalPaginas;

  factory PaginaVehiculos.fromJson(Map<String, dynamic> json) => PaginaVehiculos(
        datos: (json['datos'] as List<dynamic>)
            .map((item) => Vehiculo.fromJson(item as Map<String, dynamic>))
            .toList(growable: false),
        pagina: json['pagina'] as int,
        tamano: json['tamano'] as int,
        total: json['total'] as int,
        totalPaginas: json['total_paginas'] as int,
      );

  factory PaginaVehiculos.vacia({int pagina = 1, int tamano = 5}) =>
      PaginaVehiculos(
        datos: const [],
        pagina: pagina,
        tamano: tamano,
        total: 0,
        totalPaginas: 0,
      );
}
