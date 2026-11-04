import 'package:flutter/material.dart';

// Ampliacion opcional: StatefulWidget y setState.
// Copia este archivo a lib/main.dart en tu proyecto de practica.
// Los botones no realizan ventas reales: solo cambian datos locales.

void main() {
  runApp(const MaterialApp(
    debugShowCheckedModeBanner: false,
    home: ConcesionarioInteractivo(),
  ));
}

class ConcesionarioInteractivo extends StatefulWidget {
  const ConcesionarioInteractivo({super.key});

  @override
  State<ConcesionarioInteractivo> createState() =>
      _ConcesionarioInteractivoState();
}

class _ConcesionarioInteractivoState
    extends State<ConcesionarioInteractivo> {
  int stock = 2;
  String rol = 'cliente';

  bool hayExistencias(int cantidad) {
    return cantidad > 0;
  }

  // Este Widget cambia cuando el nuevo valor llega desde build().
  Widget construirEstado(int cantidad) {
    if (hayExistencias(cantidad)) {
      return const Text(
        'Disponible',
        style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
      );
    }
    return const Text(
      'Agotado',
      style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
    );
  }

  // setState notifica a Flutter que los datos locales cambiaron.
  void cambiarStock(int cantidad) {
    setState(() {
      int nuevoStock = stock + cantidad;
      if (nuevoStock < 0) {
        nuevoStock = 0;
      }
      if (nuevoStock > 10) {
        nuevoStock = 10;
      }
      stock = nuevoStock;
    });
  }

  // Diferentes botones segun el rol y las existencias.
  Widget construirAccion({
    required String rol,
    required int stock,
  }) {
    if (rol == 'admin') {
      return ElevatedButton(
        onPressed: () {
          cambiarStock(1);
        },
        child: const Text('Agregar una unidad'),
      );
    }

    if (stock <= 0) {
      return const Text('No se puede vender: sin existencias');
    }

    if (rol == 'vendedor') {
      return ElevatedButton(
        onPressed: () {
          cambiarStock(-1);
        },
        child: const Text('Registrar venta (simulada)'),
      );
    }

    if (rol == 'cliente') {
      return ElevatedButton(
        onPressed: () {
          cambiarStock(-1);
        },
        child: const Text('Comprar (simulado)'),
      );
    }

    return const SizedBox.shrink();
  }

  List<Widget> construirDetalles() {
    return [
      const Text(
        'Renault Logan',
        style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
      ),
      Text('Unidades disponibles: $stock'),
      const SizedBox(height: 8),
      construirEstado(stock),
    ];
  }

  // Widget se construye con las funciones auxiliares.
  Widget construirTarjeta() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ...construirDetalles(),
            const SizedBox(height: 16),
            construirAccion(rol: rol, stock: stock),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Concesionario interactivo')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('Rol del usuario'),
            DropdownButton<String>(
              value: rol,
              isExpanded: true,
              items: const [
                DropdownMenuItem(
                  value: 'admin',
                  child: Text('Administrador'),
                ),
                DropdownMenuItem(
                  value: 'vendedor',
                  child: Text('Vendedor'),
                ),
                DropdownMenuItem(
                  value: 'cliente',
                  child: Text('Cliente'),
                ),
              ],
              onChanged: (String? nuevoRol) {
                if (nuevoRol == null) {
                  return;
                }
                setState(() {
                  rol = nuevoRol;
                });
              },
            ),
            const SizedBox(height: 12),
            construirTarjeta(),
            const SizedBox(height: 12),
            OutlinedButton(
              onPressed: stock > 0
                  ? () {
                      cambiarStock(-1);
                    }
                  : null,
              child: const Text('Restar una unidad'),
            ),
            const SizedBox(height: 10),
            const Text(
              'Practica: cambia el rol o el stock y observa como '
              'Flutter vuelve a llamar build() para actualizar los widgets.',
            ),
          ],
        ),
      ),
    );
  }
}
