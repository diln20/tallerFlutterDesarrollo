class SesionUsuario {
  const SesionUsuario({required this.nombre, required this.rol});

  final String nombre;
  final String rol;
  bool get puedeModificar => rol == 'administrador';

  factory SesionUsuario.fromJson(Map<String, dynamic> json) => SesionUsuario(
        nombre: json['nombre'] as String,
        rol: json['rol'] as String,
      );
}
