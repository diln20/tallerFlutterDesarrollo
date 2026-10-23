import 'package:flutter/material.dart';
import 'widgets/titulo_seccion.dart';
import 'models/vehiculo.dart';
import 'widgets/campo_nombre_vehiculo.dart';
import 'widgets/boton_tienda.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatefulWidget {
  const MainApp({super.key});

  @override
  State<MainApp> createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  final TextEditingController vehiculoController = TextEditingController();
  final GlobalKey<FormState> formularioKey = GlobalKey<FormState>();

  @override
  void dispose() {
    vehiculoController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Tienda')),
        body: Center(
          child: Column(
            children: [
              const TituloSeccion(texto: 'Hello dsfdsWorld'),
              const SizedBox(height: 20),
              Icon(Icons.directions_car),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.directions_car),
                  const SizedBox(width: 8),
                  Text('Ingenieria de Sistemas'),
                  Expanded(
                    child: TextField(
                      decoration: const InputDecoration(
                        hintText: 'Buscar marca o modelo',
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              const TituloSeccion(texto: 'Agregar un vehículo'),
              const SizedBox(height: 10),
              Form(
                key: formularioKey,
                child: CampoNombreVehiculo(
                  controller: vehiculoController,
                ),
              ),
              const SizedBox(height: 12),
              BotonTienda(
                texto: 'Agregar vehículo',
                alPresionar: () {
                  if (formularioKey.currentState?.validate() != true) {
                    return;
                  }
                  final nombre = vehiculoController.text.trim();
                  final vehiculo = Vehiculo(nombre: nombre);
                  debugPrint(
                    'Vehículo creado: ${vehiculo.nombre} - Disponible: ${vehiculo.disponible}',
                  );
                  vehiculoController.clear();
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
