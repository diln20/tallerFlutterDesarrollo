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


  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Tienda')),
        body: Padding(
          padding: const EdgeInsets.all(16),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text('Primer widget'),
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
              ],
            ),
          ),
        ),
      ),
    );
  }
}
