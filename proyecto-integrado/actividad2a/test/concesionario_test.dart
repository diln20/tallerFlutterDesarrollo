import 'dart:convert';

import 'package:actividad2a/models/permiso.dart';
import 'package:actividad2a/models/usuario.dart';
import 'package:actividad2a/models/vehiculo.dart';
import 'package:actividad2a/services/api_service.dart';
import 'package:actividad2a/pages/login_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

void main() {
  group('Modelos y permisos', () {
    final administrador = Usuario.fromJson(const {
      'id': 1,
      'nombre': 'Ana',
      'correo': 'ana@demo.local',
      'rol': 'administrador',
    });
    final vendedor = Usuario.fromJson(const {
      'id': 2,
      'nombre': 'Luis',
      'correo': 'luis@demo.local',
      'rol': 'vendedor',
    });
    final cliente = Usuario.fromJson(const {
      'id': 3,
      'nombre': 'Sofía',
      'correo': 'sofia@demo.local',
      'rol': 'cliente',
    });

    test('los tres perfiles tienen permisos distintos', () {
      expect(tienePermiso(administrador, Permiso.eliminarVehiculo), isTrue);
      expect(tienePermiso(administrador, Permiso.gestionarUsuarios), isTrue);
      expect(tienePermiso(vendedor, Permiso.crearVehiculo), isTrue);
      expect(tienePermiso(vendedor, Permiso.eliminarVehiculo), isFalse);
      expect(tienePermiso(cliente, Permiso.crearVehiculo), isFalse);
      expect(tienePermiso(cliente, Permiso.agregarFavoritos), isTrue);
    });

    test('Vehiculo conserva todos los campos que usa el catálogo', () {
      final vehiculo = Vehiculo.fromJson(const {
        'id': 42,
        'nombre': 'Logan',
        'marca': 'Renault',
        'precio': 35000000,
        'disponible': true,
        'imagen_url': '/media/auto.png',
        'es_favorito': true,
      });
      expect(vehiculo.id, 42);
      expect(vehiculo.marca, 'Renault');
      expect(vehiculo.precio, 35000000.0);
      expect(vehiculo.imagenUrl, '/media/auto.png');
      expect(vehiculo.esFavorito, isTrue);
      expect(
        const DatosVehiculo(
          nombre: 'Logan',
          marca: 'Renault',
          precio: 35000000,
          disponible: true,
        ).toJson(),
        containsPair('marca', 'Renault'),
      );
    });

    test('PaginaVehiculos respeta la paginación del servidor', () {
      final pagina = PaginaVehiculos.fromJson(const {
        'datos': [],
        'pagina': 2,
        'tamano': 6,
        'total': 16,
        'total_paginas': 3,
      });
      expect(pagina.pagina, 2);
      expect(pagina.total, 16);
      expect(pagina.totalPaginas, 3);
    });
  });

  test('Cliente HTTP agrega autenticación y interpreta respuestas', () async {
    final client = MockClient((request) async {
      expect(request.headers['Authorization'], startsWith('Basic '));
      if (request.url.path == '/sesion') {
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
      if (request.url.path == '/vehiculos') {
        expect(request.url.queryParameters['pagina'], '2');
        return http.Response(
          jsonEncode({
            'datos': [],
            'pagina': 2,
            'tamano': 6,
            'total': 6,
            'total_paginas': 1,
          }),
          200,
        );
      }
      return http.Response('{"detail":"No encontrado"}', 404);
    });
    final api = ApiService(url: 'http://localhost:8091', client: client);
    final usuario = await api.iniciarSesion('admin@demo.local', 'demo');
    expect(usuario.esAdministrador, isTrue);
    final datos = await api.obtener('/vehiculos', {'pagina': '2'});
    expect(datos['pagina'], 2);
    expect(
      api.urlImagen('/media/foto.png'),
      'http://localhost:8091/media/foto.png',
    );
    api.cerrarSesion();
    api.dispose();
  });

  testWidgets('El login permite entrar como administrador', (tester) async {
    final api = ApiService(
      url: 'http://localhost:8091',
      client: MockClient(
        (request) async => http.Response(
          '{"id":1,"nombre":"Ana","correo":"admin@demo.local","rol":"administrador"}',
          200,
        ),
      ),
    );
    Usuario? autenticado;
    await tester.binding.setSurfaceSize(const Size(1000, 900));
    await tester.pumpWidget(
      MaterialApp(
        home: LoginPage(api: api, onSesion: (u) => autenticado = u),
      ),
    );
    expect(find.text('Mi concesionario'), findsOneWidget);
    expect(find.text('Administrador'), findsOneWidget);
    await tester.ensureVisible(
      find.widgetWithText(ActionChip, 'Administrador'),
    );
    await tester.tap(find.widgetWithText(ActionChip, 'Administrador'));
    await tester.pumpAndSettle();
    await tester.tap(find.widgetWithText(FilledButton, 'Ingresar'));
    await tester.pumpAndSettle();
    expect(autenticado?.esAdministrador, isTrue);
    api.dispose();
    await tester.binding.setSurfaceSize(null);
  });
}
