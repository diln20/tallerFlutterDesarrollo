import 'package:flutter/material.dart';

class BotonTienda extends StatelessWidget {
  const BotonTienda({
    super.key,
    required this.texto,
    required this.alPresionar,
  });

  final String texto;
  final VoidCallback alPresionar;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: alPresionar,
      child: Text(texto),
    );
  }
}
