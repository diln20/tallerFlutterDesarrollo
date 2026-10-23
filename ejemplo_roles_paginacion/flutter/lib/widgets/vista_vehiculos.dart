import 'package:flutter/material.dart';
import '../models/vehiculo.dart';

class VistaVehiculos extends StatelessWidget {
  const VistaVehiculos({
    super.key,
    required this.vehiculos,
    required this.puedeEditar,
    required this.alEditar,
    required this.alEliminar,
  });

  final List<Vehiculo> vehiculos;
  final bool puedeEditar;
  final ValueChanged<Vehiculo> alEditar;
  final ValueChanged<Vehiculo> alEliminar;

  @override
  Widget build(BuildContext context) {
    if (vehiculos.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(22),
          child: Text('No hay vehículos en esta búsqueda.'),
        ),
      );
    }

    return LayoutBuilder(
      builder: (context, restricciones) {
        if (restricciones.maxWidth < 720) {
          return ListView.builder(
            itemCount: vehiculos.length,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemBuilder: (context, indice) {
              final auto = vehiculos[indice];
              return Card(
                key: ValueKey(auto.id),
                child: ListTile(
                  title: Text(auto.nombre),
                  subtitle: Text(
                    'Año ' + auto.anio.toString() +
                    ' · Precio ' + auto.precio.toStringAsFixed(2) +
                    '\n' + auto.correo,
                  ),
                  isThreeLine: true,
                  trailing: puedeEditar
                      ? PopupMenuButton<String>(
                          tooltip: 'Acciones para ' + auto.nombre,
                          onSelected: (opcion) {
                            if (opcion == 'editar') alEditar(auto);
                            if (opcion == 'eliminar') alEliminar(auto);
                          },
                          itemBuilder: (_) => const [
                            PopupMenuItem(
                              value: 'editar',
                              child: Text('Editar'),
                            ),
                            PopupMenuItem(
                              value: 'eliminar',
                              child: Text('Eliminar'),
                            ),
                          ],
                        )
                      : null,
                ),
              );
            },
          );
        }

        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: DataTable(
            columns: [
              const DataColumn(label: Text('ID')),
              const DataColumn(label: Text('Vehículo')),
              const DataColumn(label: Text('Año')),
              const DataColumn(label: Text('Precio')),
              const DataColumn(label: Text('Correo')),
              if (puedeEditar)
                const DataColumn(label: Text('Acciones')),
            ],
            rows: vehiculos.map((auto) => DataRow(
              cells: [
                DataCell(Text(auto.id.toString())),
                DataCell(Text(auto.nombre)),
                DataCell(Text(auto.anio.toString())),
                DataCell(Text(auto.precio.toStringAsFixed(2))),
                DataCell(Text(auto.correo)),
                if (puedeEditar)
                  DataCell(Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        tooltip: 'Editar ' + auto.nombre,
                        onPressed: () => alEditar(auto),
                        icon: const Icon(Icons.edit_outlined),
                      ),
                      IconButton(
                        tooltip: 'Eliminar ' + auto.nombre,
                        onPressed: () => alEliminar(auto),
                        icon: const Icon(Icons.delete_outline),
                      ),
                    ],
                  )),
              ],
            )).toList(),
          ),
        );
      },
    );
  }
}
