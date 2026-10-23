import 'package:flutter/material.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Tienda')),
        body: Center(
          child: Column(
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
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
