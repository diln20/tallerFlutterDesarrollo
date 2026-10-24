import 'usuario.dart';

enum Permiso {
  verCatalogo,
  crearVehiculo,
  editarVehiculo,
  eliminarVehiculo,
  gestionarUsuarios,
  agregarFavoritos,
}

bool tienePermiso(Usuario usuario, Permiso permiso) {
  switch (usuario.rol) {
    case RolUsuario.administrador:
      return true;
    case RolUsuario.vendedor:
      return {
        Permiso.verCatalogo,
        Permiso.crearVehiculo,
        Permiso.editarVehiculo,
        Permiso.agregarFavoritos,
      }.contains(permiso);
    case RolUsuario.cliente:
      return {Permiso.verCatalogo, Permiso.agregarFavoritos}.contains(permiso);
  }
}
