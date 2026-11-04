import 'package:flutter/material.dart';

import '../models/vehiculo.dart';

class VehiculoCard extends StatelessWidget {
  const VehiculoCard({
    super.key,
    required this.vehiculo,
    required this.urlImagen,
    required this.onFavorito,
    this.onEditar,
    this.onEliminar,
  });

  final Vehiculo vehiculo;
  final String Function(String) urlImagen;
  final VoidCallback onFavorito;
  final VoidCallback? onEditar;
  final VoidCallback? onEliminar;

  // Función que retorna un Widget distinto según un if normal con llaves.
  // El modelo de la API utiliza disponible (bool), no un stock inventado.
  Widget _construirEstado() {
    if (vehiculo.disponible) {
      return const Chip(
        label: Text('Disponible'),
        avatar: Icon(Icons.check_circle_outline, size: 17),
        visualDensity: VisualDensity.compact,
      );
    }

    return const Chip(
      label: Text('No disponible'),
      avatar: Icon(Icons.remove_circle_outline, size: 17),
      visualDensity: VisualDensity.compact,
    );
  }

  // Esta función devuelve una lista, no un Widget individual.
  // Así reutilizamos el nombre, marca, precio y estado sin duplicarlos.
  List<Widget> _construirDetalles(BuildContext context) {
    final colores = Theme.of(context).colorScheme;
    return [
                Text(
                  vehiculo.nombre,
                  style: Theme.of(context).textTheme.titleMedium,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  vehiculo.marca,
                  style: TextStyle(color: colores.onSurfaceVariant),
                ),
                const SizedBox(height: 8),
                Text(
                  '\$ ${vehiculo.precio.toStringAsFixed(0).replaceAllMapped(RegExp(r'\B(?=(\d{3})+(?!\d))'), (m) => '.')} COP',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: colores.primary,
                  ),
                ),
                const SizedBox(height: 6),
                _construirEstado(),
    ];
  }

  // Otra función que retorna un solo Widget (imagen real o marcador).
  Widget _construirFoto(BuildContext context) {
    final colores = Theme.of(context).colorScheme;
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: SizedBox(
        height: 145,
        width: double.infinity,
        child: vehiculo.imagenUrl == null
            ? ColoredBox(
                color: colores.primaryContainer,
                child: Icon(
                  Icons.directions_car_filled,
                  color: colores.onPrimaryContainer,
                  size: 56,
                ),
              )
            : Image.network(
                urlImagen(vehiculo.imagenUrl!),
                fit: BoxFit.cover,
                errorBuilder: (_, _, _) => ColoredBox(
                  color: colores.surfaceContainerHighest,
                  child: const Icon(Icons.broken_image_outlined, size: 48),
                ),
              ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colores = Theme.of(context).colorScheme;
    final foto = _construirFoto(context);
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: LayoutBuilder(
          builder: (context, constraints) {
            final anchoGrande = constraints.maxWidth > 610;
            final descripcion = Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: _construirDetalles(context),
            );
            final acciones = Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                IconButton(
                  tooltip: vehiculo.esFavorito
                      ? 'Quitar de favoritos'
                      : 'Marcar favorito',
                  onPressed: onFavorito,
                  icon: Icon(
                    vehiculo.esFavorito
                        ? Icons.favorite
                        : Icons.favorite_border,
                    color: vehiculo.esFavorito ? colores.error : null,
                  ),
                ),
                if (onEditar != null || onEliminar != null)
                  PopupMenuButton<String>(
                    tooltip: 'Opciones del vehículo',
                    onSelected: (accion) {
                      if (accion == 'editar') onEditar?.call();
                      if (accion == 'eliminar') onEliminar?.call();
                    },
                    itemBuilder: (_) => [
                      if (onEditar != null)
                        const PopupMenuItem(
                          value: 'editar',
                          child: Text('Editar vehículo'),
                        ),
                      if (onEliminar != null)
                        const PopupMenuItem(
                          value: 'eliminar',
                          child: Text('Eliminar vehículo'),
                        ),
                    ],
                  ),
              ],
            );
            if (anchoGrande) {
              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(width: 210, child: foto),
                  const SizedBox(width: 18),
                  Expanded(child: descripcion),
                  acciones,
                ],
              );
            }
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                foto,
                const SizedBox(height: 10),
                descripcion,
                Align(alignment: Alignment.centerRight, child: acciones),
              ],
            );
          },
        ),
      ),
    );
  }
}
