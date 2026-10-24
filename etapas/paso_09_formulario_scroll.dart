import 'package:flutter/material.dart';

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
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Primer widget'),
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
              const Text('Agregar un vehículo'),
              const SizedBox(height: 10),
              TextField(
                controller: vehiculoController,
                decoration: const InputDecoration(
                  hintText: 'Nombre del vehículo',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: () {
                  final nombre = vehiculoController.text.trim();
                  if (nombre.isEmpty) return;
                  debugPrint('Vehículo escrito: $nombre');
                  vehiculoController.clear();
                },
                child: const Text('Agregar vehículo'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
