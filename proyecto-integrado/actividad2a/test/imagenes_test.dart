import 'dart:convert';
import 'dart:typed_data';

import 'package:actividad2a/services/api_service.dart';
import 'package:actividad2a/services/imagen_service.dart';
import 'package:actividad2a/widgets/vehiculo_form_dialog.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

class ImagenServiceSimulado extends ImagenService {
  ImagenServiceSimulado(this.foto);
  final ImagenSeleccionada foto;

  @override
  Future<ImagenSeleccionada?> seleccionar({bool camara = false}) async => foto;
}

void main() {
  final bytesPng = Uint8List.fromList(const [
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a,
    0x00,
  ]);

  test(
    'El servicio HTTP construye una petición multipart autenticada',
    () async {
      int peticionesImagen = 0;
      final cliente = MockClient((solicitud) async {
        if (solicitud.url.path == '/sesion') {
          return http.Response(
            jsonEncode({
              'id': 1,
              'nombre': 'Ana',
              'correo': 'admin@demo.local',
              'rol': 'administrador',
            }),
            200,
          );
        }

        if (solicitud.url.path == '/vehiculos/7/imagen') {
          peticionesImagen++;
          expect(solicitud.method, 'POST');
          expect(solicitud.headers['authorization'], startsWith('Basic '));
          expect(
            solicitud.headers['content-type'],
            contains('multipart/form-data'),
          );
          final contenido = solicitud.bodyBytes;
          expect(
            latin1.decode(contenido),
            contains('name="archivo"; filename="foto.png"'),
          );
          expect(contenido, containsAllInOrder(bytesPng));
          return http.Response(
            jsonEncode({
              'id': 7,
              'nombre': 'Renault',
              'marca': 'Renault',
              'precio': 35000000,
              'disponible': true,
              'imagen_url': '/media/foto.png',
              'es_favorito': false,
            }),
            200,
          );
        }

        return http.Response('{"detail":"No encontrado"}', 404);
      });

      final api = ApiService(url: 'http://127.0.0.1:8091', client: cliente);
      await api.iniciarSesion('admin@demo.local', 'demo');
      final respuesta = await api.subirImagen(
        7,
        ImagenSeleccionada(bytes: bytesPng, nombre: 'foto.png'),
      );
      expect(
        (respuesta as Map<String, dynamic>)['imagen_url'],
        '/media/foto.png',
      );
      expect(peticionesImagen, 1);
      api.dispose();
    },
  );

  test('Rechaza bytes que no representan JPEG PNG o WebP', () async {
    final api = ApiService(url: 'http://127.0.0.1:8091');
    expect(
      () => api.subirImagen(
        4,
        ImagenSeleccionada(
          bytes: Uint8List.fromList([0x41, 0x42, 0x43]),
          nombre: 'falso.txt',
        ),
      ),
      throwsA(isA<ApiException>()),
    );
    api.dispose();
  });

  testWidgets('El formulario permite elegir imagen y entrega datos completos', (
    tester,
  ) async {
    final imagen = ImagenSeleccionada(bytes: bytesPng, nombre: 'foto.png');
    DatosFormularioVehiculo? guardados;
    await tester.binding.setSurfaceSize(const Size(680, 950));
    final api = ApiService(url: 'http://127.0.0.1:8091');

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: Builder(
            builder: (context) => TextButton(
              onPressed: () => showDialog<bool>(
                context: context,
                builder: (_) => VehiculoFormDialog(
                  api: api,
                  imagenService: ImagenServiceSimulado(imagen),
                  onGuardar: (datos) async => guardados = datos,
                ),
              ),
              child: const Text('Formulario'),
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('Formulario'));
    await tester.pumpAndSettle();
    await tester.enterText(find.byType(TextFormField).at(0), 'Renault Logan');
    await tester.enterText(find.byType(TextFormField).at(1), 'Renault');
    await tester.enterText(find.byType(TextFormField).at(2), '35000000');
    await tester.tap(find.text('Galería / archivos'));
    await tester.pumpAndSettle();

    expect(find.byType(Image), findsOneWidget);
    await tester.tap(find.text('Registrar'));
    await tester.pumpAndSettle();

    expect(guardados?.datos.nombre, 'Renault Logan');
    expect(guardados?.datos.precio, 35000000.0);
    expect(guardados?.imagen?.nombre, 'foto.png');
    api.dispose();
    await tester.binding.setSurfaceSize(null);
  });
}

