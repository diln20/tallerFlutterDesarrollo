import 'package:flutter/material.dart';
import '../utils/colores_app.dart';

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
      style: ElevatedButton.styleFrom(
        backgroundColor: ColoresApp.accion,
        foregroundColor: Colors.white,
      ),
      child: Text(texto),
    );
  }
}
