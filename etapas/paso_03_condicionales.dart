import 'package:flutter/material.dart';

// Ampliacion opcional del modulo 03.
// Copia este archivo a lib/main.dart en tu proyecto de practica.
// Cambia stock y rol y utiliza Hot Reload para observar los resultados.

void main() {
  runApp(const EjemploCondicionales());
}

class EjemploCondicionales extends StatelessWidget {
  const EjemploCondicionales({super.key});

  Widget estadoVehiculo(int stock) {
    // Un if tradicional con llaves puede retornar distintos widgets.
    if (stock > 0) {
      return const Text('Hay existencias para continuar la compra.');
    } else {
      return const Text('No es posible comprar sin existencias.');
    }
  }

  @override
  Widget build(BuildContext context) {
    const int stock = 3;
    const String rol = 'admin'; // admin, vendedor o cliente

    // Otro if tradicional: agregamos widgets a una lista.
    final List<Widget> contenido = [
      const Text('Renault Logan', style: TextStyle(fontSize: 22)),
      const SizedBox(height: 8),
    ];

    if (stock > 0) {
      contenido.add(const Text('Vehiculo disponible'));
    } else {
      contenido.add(const Text('Vehiculo agotado'));
    }

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        appBar: AppBar(title: const Text('Concesionario')),
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ...contenido,
              const SizedBox(height: 12),

              // En children se escribe un if de coleccion, SIN llaves.
              if (stock > 0) ...[
                const Icon(Icons.check_circle, color: Colors.green),
                const Text('Disponible para venta'),
              ],

              const SizedBox(height: 12),
              if (rol == 'admin')
                ElevatedButton(
                  onPressed: () {
                    debugPrint('Abrir formulario para agregar vehiculo');
                  },
                  child: const Text('Agregar vehiculo'),
                )
              else if (rol == 'vendedor' && stock > 0)
                ElevatedButton(
                  onPressed: () {
                    debugPrint('Abrir formulario de ventas');
                  },
                  child: const Text('Registrar venta'),
                )
              else if (rol == 'cliente' && stock > 0)
                ElevatedButton(
                  onPressed: () {
                    debugPrint('Vehiculo seleccionado');
                  },
                  child: const Text('Comprar'),
                ),

              const SizedBox(height: 12),
              estadoVehiculo(stock),
            ],
          ),
        ),
      ),
    );
  }
}
