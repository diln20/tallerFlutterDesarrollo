import 'package:flutter/material.dart';
import '../validators/validadores.dart';

class CampoNombreVehiculo extends StatelessWidget {
  const CampoNombreVehiculo({super.key, required this.controller});

  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      textCapitalization: TextCapitalization.words,
      decoration: const InputDecoration(
        labelText: 'Nombre del vehículo',
        hintText: 'Renault 9',
        border: OutlineInputBorder(),
      ),
      validator: Validadores.nombre,
    );
  }
}
