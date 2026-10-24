import 'package:flutter/material.dart';

class ContadorToques extends StatefulWidget {
  const ContadorToques({super.key});

  @override
  State<ContadorToques> createState() => _ContadorToquesState();
}

class _ContadorToquesState extends State<ContadorToques> {
  int _toques = 0;

  void sumarPrueba() {
    setState(() {
      _toques++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Pruebas realizadas: $_toques'),
        const SizedBox(height: 8),
        ElevatedButton(
          onPressed: sumarPrueba,
          child: const Text('Sumar una prueba'),
        ),
      ],
    );
  }
}
