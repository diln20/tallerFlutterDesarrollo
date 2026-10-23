import 'package:flutter/material.dart';
import '../models/pagina_vehiculos.dart';

class ControlesPaginacion extends StatelessWidget {
  const ControlesPaginacion({
    super.key,
    required this.pagina,
    required this.cargando,
    required this.alCambiarPagina,
    required this.alCambiarTamano,
  });

  final PaginaVehiculos pagina;
  final bool cargando;
  final ValueChanged<int> alCambiarPagina;
  final ValueChanged<int> alCambiarTamano;

  @override
  Widget build(BuildContext context) {
    final paginas = pagina.totalPaginas;
    final paginaVisible = paginas == 0 ? 0 : pagina.pagina;
    final puedeRetroceder = !cargando && pagina.pagina > 1;
    final puedeAvanzar = !cargando && pagina.pagina < paginas;

    return Wrap(
      alignment: WrapAlignment.center,
      crossAxisAlignment: WrapCrossAlignment.center,
      spacing: 12,
      runSpacing: 8,
      children: [
        Text('Total: ' + pagina.total.toString() + ' vehículos'),
        DropdownButton<int>(
          value: pagina.tamano,
          tooltip: 'Registros por página',
          items: const [5, 10, 20]
              .map((numero) => DropdownMenuItem<int>(
                    value: numero,
                    child: Text(numero.toString() + ' por página'),
                  ))
              .toList(),
          onChanged: cargando
              ? null
              : (numero) {
                  if (numero != null) alCambiarTamano(numero);
                },
        ),
        IconButton(
          tooltip: 'Página anterior',
          onPressed: puedeRetroceder
              ? () => alCambiarPagina(pagina.pagina - 1)
              : null,
          icon: const Icon(Icons.chevron_left),
        ),
        Text(
          'Página ' + paginaVisible.toString() + ' de ' +
              (paginas == 0 ? '0' : paginas.toString()),
          semanticsLabel: 'Página ' + pagina.pagina.toString() +
              ' de ' + paginas.toString(),
        ),
        IconButton(
          tooltip: 'Página siguiente',
          onPressed: puedeAvanzar
              ? () => alCambiarPagina(pagina.pagina + 1)
              : null,
          icon: const Icon(Icons.chevron_right),
        ),
      ],
    );
  }
}
