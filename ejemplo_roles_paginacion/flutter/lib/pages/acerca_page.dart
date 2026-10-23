import 'package:flutter/material.dart';
import '../widgets/titulo_seccion.dart';
import '../widgets/boton_tienda.dart';
import 'ayuda_page.dart';

class AcercaPage extends StatelessWidget {
  const AcercaPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Acerca de')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const TituloSeccion(texto: 'Nuestra Tienda'),
            const SizedBox(height: 12),
            const Text('Un ejercicio para aprender Flutter.'),
            const SizedBox(height: 16),
            BotonTienda(
              texto: 'Ver ayuda',
              alPresionar: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const AyudaPage()),
                );
              },
            ),
            const SizedBox(height: 8),
            BotonTienda(
              texto: 'Volver a la Tienda',
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
