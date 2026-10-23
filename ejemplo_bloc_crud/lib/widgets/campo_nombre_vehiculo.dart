import 'package:flutter/material.dart';

class CampoNombreVehiculo extends StatelessWidget {
  const CampoNombreVehiculo({
    super.key,
    required this.controller,
  });

  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      decoration: const InputDecoration(
        hintText: 'Nombre del vehículo',
        border: OutlineInputBorder(),
      ),
      validator: (valor) {
        if (valor == null || valor.trim().isEmpty) {
          return 'Escribe un nombre';
        }
        if (valor.trim().length < 3) {
          return 'Mínimo 3 caracteres';
        }
        return null;
      },
    );
  }
}
