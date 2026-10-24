import '../models/usuario.dart';
import '../services/api_service.dart';

class UsuarioRepository {
  const UsuarioRepository(this.api);

  final ApiService api;

  Future<List<Usuario>> listar() async {
    final datos = await api.obtener('/usuarios') as List<dynamic>;
    return datos
        .map((e) => Usuario.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<Usuario> crear({
    required String nombre,
    required String correo,
    required String contrasena,
    required RolUsuario rol,
  }) async => Usuario.fromJson(
    await api.enviar('POST', '/usuarios', {
          'nombre': nombre,
          'correo': correo,
          'contrasena': contrasena,
          'rol': rol.name,
        })
        as Map<String, dynamic>,
  );

  Future<Usuario> cambiarRol(Usuario usuario, RolUsuario rol) async =>
      Usuario.fromJson(
        await api.enviar('PATCH', '/usuarios/${usuario.id}/rol', {
              'rol': rol.name,
            })
            as Map<String, dynamic>,
      );

  Future<void> eliminar(Usuario usuario) async =>
      api.enviar('DELETE', '/usuarios/${usuario.id}');
}
