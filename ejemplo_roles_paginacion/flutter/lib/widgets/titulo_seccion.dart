import 'package:flutter/material.dart';

class TituloSeccion extends StatelessWidget {
  const TituloSeccion({
    super.key,
    required this.texto,
  });

  final String texto;

  @override
  Widget build(BuildContext context) {
    return Text(texto);
  }
}
