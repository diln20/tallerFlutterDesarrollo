import 'package:flutter/material.dart';

// Taller Flutter - modulo 03: funciones que retornan widgets.
// Este archivo es independiente y se puede copiar en lib/main.dart.
// Cambia los valores de stock y rol dentro de build() para practicar.

void main() {
  runApp(const TallerFuncionesApp());
}

class TallerFuncionesApp extends StatelessWidget {
  const TallerFuncionesApp({super.key});

  // Funcion de logica: devuelve un bool, no un widget.
  bool hayStock(int cantidad) {
    return cantidad > 0;
  }

  // Funcion de presentacion: devuelve exactamente un Widget.
  // Los dos caminos retornan un widget gracias al if/else.
  Widget mostrarEstado(int stock) {
    if (hayStock(stock)) {
      return const Chip(
        avatar: Icon(Icons.check_circle, color: Colors.green),
        label: Text('Vehiculo disponible'),
      );
    } else {
      return const Chip(
        avatar: Icon(Icons.cancel, color: Colors.red),
        label: Text('Vehiculo agotado'),
      );
    }
  }

  // Funcion que recibe dos parametros nombrados y obligatorios.
  // Se usa SizedBox.shrink() cuando no debe aparecer ninguna accion.
  Widget mostrarAccion({
    required String rol,
    required int stock,
  }) {
    if (rol == 'admin') {
      return ElevatedButton(
        onPressed: () {
          debugPrint('Simulacion: abrir formulario de vehiculo');
        },
        child: const Text('Agregar vehiculo'),
      );
    }

    if (rol == 'vendedor' && stock > 0) {
      return ElevatedButton(
        onPressed: registrarVenta,
        child: const Text('Registrar venta'),
      );
    }

    if (rol == 'cliente' && stock > 0) {
      return ElevatedButton(
        onPressed: () {
          debugPrint('Simulacion: seleccionar vehiculo');
        },
        child: const Text('Comprar'),
      );
    }

    return const SizedBox.shrink();
  }

  // Esta funcion devuelve varios widgets en una lista.
  // No se debe confundir List<Widget> con Widget.
  List<Widget> mostrarDetalles(int stock) {
    return [
      const Text(
        'Renault Logan',
        style: TextStyle(fontSize: 23, fontWeight: FontWeight.bold),
      ),
      const SizedBox(height: 8),
      Text('Existencias: $stock'),
      if (stock > 0) ...[
        const SizedBox(height: 8),
        const Text('Listo para venta'),
      ],
    ];
  }

  // Funcion void: realiza una accion, pero no devuelve un widget.
  void registrarVenta() {
    debugPrint('Simulacion: venta iniciada');
  }

  // Reutilizamos las funciones anteriores dentro de otra funcion Widget.
  Widget mostrarTarjeta({
    required int stock,
    required String rol,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ...mostrarDetalles(stock), // List<Widget> en children.
            const SizedBox(height: 12),
            mostrarEstado(stock), // Un Widget en children.
            const SizedBox(height: 12),
            mostrarAccion(rol: rol, stock: stock),
          ],
        ),
      ),
    );
  }

  // build() es un metodo especial de Flutter: tambien retorna un Widget.
  @override
  Widget build(BuildContext context) {
    const int stock = 3;
    const String rol = 'vendedor'; // admin, vendedor o cliente

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Concesionario - funciones'),
        ),
        body: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: mostrarTarjeta(stock: stock, rol: rol),
          ),
        ),
      ),
    );
  }
}
