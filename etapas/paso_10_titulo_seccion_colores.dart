import 'package:flutter/material.dart';
import '../utils/colores_app.dart';

class TituloSeccion extends StatelessWidget {
  const TituloSeccion({
    super.key,
    required this.texto,
  });

  final String texto;

  @override
  Widget build(BuildContext context) {
    return Text(
      texto,
      style: const TextStyle(
        color: ColoresApp.texto,
        fontSize: 20,
        fontWeight: FontWeight.w600,
      ),
    );
  }
}
