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
  String busqueda = '';
  final List<String> vehiculos = [
    'Renault 9',
    'Renault 21',
    'Mazda 3',
    'Chevrolet Spark',
  ];


  @override
  Widget build(BuildContext context) {
    final resultados = vehiculos.where((vehiculo) {
      return vehiculo.toLowerCase().contains(
        busqueda.trim().toLowerCase(),
      );
    }).toList();

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Tienda')),
        body: Padding(
          padding: const EdgeInsets.all(16),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text('Hello dsfdsWorld'),
                const SizedBox(height: 20),
                const Icon(Icons.directions_car),
                const SizedBox(height: 8),
                const Row(
                  children: [
                    Icon(Icons.directions_car),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Ingenieria de Sistemas',
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                TextField(
                  onChanged: (valor) {
                    setState(() {
                      busqueda = valor;
                    });
                  },
                  decoration: const InputDecoration(
                    hintText: 'Buscar marca o modelo',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                Text('Estás buscando: $busqueda'),
                const SizedBox(height: 16),
                const Text('Vehículos encontrados:'),
                if (resultados.isEmpty)
                  const Text('No se encontraron vehículos.'),
                for (final vehiculo in resultados)
                  ListTile(
                    leading: const Icon(Icons.directions_car),
                    title: Text(vehiculo),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
