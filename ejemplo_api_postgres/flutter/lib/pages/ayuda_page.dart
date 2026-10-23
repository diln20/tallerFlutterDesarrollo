import 'package:flutter/material.dart';
import '../widgets/titulo_seccion.dart';
import '../widgets/boton_tienda.dart';

class AyudaPage extends StatelessWidget {
  const AyudaPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ayuda')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const TituloSeccion(texto: 'Ayuda de la Tienda'),
            const SizedBox(height: 12),
            const Text('Escribe al menos tres caracteres para crear un vehículo.'),
            const SizedBox(height: 12),
            BotonTienda(
              texto: 'Volver',
              alPresionar: () {
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
    );
  }
}
