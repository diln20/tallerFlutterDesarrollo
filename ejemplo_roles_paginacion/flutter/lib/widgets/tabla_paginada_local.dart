import 'package:flutter/material.dart';
import '../models/vehiculo.dart';

// EJEMPLO OPCIONAL: solo si ya tienes TODOS los registros en memoria.
// NO lo combines con GET /vehiculos paginado por el servidor.
class FuenteVehiculosLocal extends DataTableSource {
  FuenteVehiculosLocal(this._datos);
  List<Vehiculo> _datos;

  void reemplazar(List<Vehiculo> nuevos) {
    _datos = nuevos;
    notifyListeners();
  }

  @override
  DataRow? getRow(int indice) {
    if (indice >= _datos.length) return null;
    final v = _datos[indice];
    return DataRow.byIndex(
      index: indice,
      cells: [
        DataCell(Text(v.nombre)),
        DataCell(Text(v.anio.toString())),
        DataCell(Text(v.precio.toStringAsFixed(2))),
      ],
    );
  }

  @override
  int get rowCount => _datos.length;

  @override
  bool get isRowCountApproximate => false;

  @override
  int get selectedRowCount => 0;
}

class TablaPaginadaLocal extends StatefulWidget {
  const TablaPaginadaLocal({super.key, required this.todos});
  final List<Vehiculo> todos;

  @override
  State<TablaPaginadaLocal> createState() => _TablaPaginadaLocalState();
}

class _TablaPaginadaLocalState extends State<TablaPaginadaLocal> {
  late FuenteVehiculosLocal fuente;

  @override
  void initState() {
    super.initState();
    fuente = FuenteVehiculosLocal(widget.todos);
  }

  @override
  void didUpdateWidget(covariant TablaPaginadaLocal anterior) {
    super.didUpdateWidget(anterior);
    fuente.reemplazar(widget.todos);
  }

  @override
  void dispose() {
    fuente.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PaginatedDataTable(
      header: const Text('Vehículos en memoria'),
      columns: const [
        DataColumn(label: Text('Nombre')),
        DataColumn(label: Text('Año')),
        DataColumn(label: Text('Precio')),
      ],
      source: fuente,
      rowsPerPage: 5,
      availableRowsPerPage: const [5, 10, 20],
      showFirstLastButtons: true,
      showCheckboxColumn: false,
    );
  }
}
