import 'package:flutter/material.dart';

import '../models/permiso.dart';
import '../models/usuario.dart';

class PerfilPage extends StatelessWidget {
  const PerfilPage({super.key, required this.usuario});

  final Usuario usuario;

  @override
  Widget build(BuildContext context) {
    const permisos = [
      (Permiso.verCatalogo, 'Ver vehículos'),
      (Permiso.crearVehiculo, 'Registrar vehículos'),
      (Permiso.editarVehiculo, 'Editar vehículos'),
      (Permiso.eliminarVehiculo, 'Eliminar vehículos'),
      (Permiso.gestionarUsuarios, 'Gestionar cuentas y roles'),
      (Permiso.agregarFavoritos, 'Guardar favoritos'),
    ];
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text('Mi perfil', style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 16),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                const CircleAvatar(
                  radius: 35,
                  child: Icon(Icons.person, size: 35),
                ),
                const SizedBox(height: 14),
                Text(
                  usuario.nombre,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                Text(usuario.correo),
                const SizedBox(height: 8),
                Chip(label: Text('Rol: ${usuario.rol.etiqueta}')),
              ],
            ),
          ),
        ),
        const SizedBox(height: 18),
        Text(
          'Acciones permitidas',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 8),
        ...permisos.map(
          (permiso) => ListTile(
            leading: Icon(
              tienePermiso(usuario, permiso.$1)
                  ? Icons.check_circle_outline
                  : Icons.block,
              color: tienePermiso(usuario, permiso.$1)
                  ? Theme.of(context).colorScheme.primary
                  : Theme.of(context).colorScheme.onSurfaceVariant,
            ),
            title: Text(permiso.$2),
            subtitle: Text(
              tienePermiso(usuario, permiso.$1) ? 'Permitida' : 'No permitida',
            ),
          ),
        ),
        const Card(
          child: Padding(
            padding: EdgeInsets.all(16),
            child: Text(
              'Los roles son reglas definidas en el servidor. '
              'Ocultar un botón en Flutter no reemplaza la autorización de la API.',
            ),
          ),
        ),
      ],
    );
  }
}
