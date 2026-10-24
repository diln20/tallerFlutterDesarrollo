enum RolUsuario { administrador, vendedor, cliente }

extension RolUsuarioTexto on RolUsuario {
  String get etiqueta => switch (this) {
    RolUsuario.administrador => 'Administrador',
    RolUsuario.vendedor => 'Vendedor',
    RolUsuario.cliente => 'Cliente',
  };
}

class Usuario {
  const Usuario({
    required this.id,
    required this.nombre,
    required this.correo,
    required this.rol,
  });

  final int id;
  final String nombre;
  final String correo;
  final RolUsuario rol;

  factory Usuario.fromJson(Map<String, dynamic> json) => Usuario(
    id: (json['id'] as num).toInt(),
    nombre: json['nombre'] as String,
    correo: json['correo'] as String,
    rol: RolUsuario.values.byName(json['rol'] as String),
  );

  bool get esAdministrador => rol == RolUsuario.administrador;
  bool get puedeEditar => rol != RolUsuario.cliente;
}
