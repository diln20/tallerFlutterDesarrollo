import 'dart:convert';

import 'package:actividad2a/models/usuario.dart';
import 'package:actividad2a/pages/catalogo_page.dart';
import 'package:actividad2a/pages/usuarios_page.dart';
import 'package:actividad2a/services/api_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

Map<String, dynamic> vehiculo({
  int id = 1,
  String nombre = 'Renault Logan',
}) => {
  'id': id,
  'nombre': nombre,
  'marca': 'Renault',
  'precio': 35000000,
  'disponible': true,
  'imagen_url': null,
  'es_favorito': false,
};

void main() {
  testWidgets('El cliente puede ver el catálogo pero no modificarlo',
      (tester) async {
    final usuario = Usuario.fromJson(const {
      'id': 3, 'nombre': 'Sofía', 'correo': 'cliente@demo.local',
      'rol': 'cliente',
    });
    final api = ApiService(url: 'http://localhost:8091',
      client: MockClient((request) async {
        if (request.url.path == '/vehiculos') {
          return http.Response(jsonEncode({
            'datos': [vehiculo()], 'pagina': 1,
            'tamano': 6, 'total': 1, 'total_paginas': 1,
          }), 200);
        }
        if (request.url.path == '/resumen') {
          return http.Response(
            '{"total":1,"disponibles":1,"favoritos":0}', 200);
        }
        return http.Response('{}', 404);
      }),
    );
    await tester.binding.setSurfaceSize(const Size(1100, 1000));
    await tester.pumpWidget(MaterialApp(home: Scaffold(
      body: CatalogoPage(api: api, usuario: usuario),
    )));
    await tester.pumpAndSettle();
    expect(find.text('Catálogo de vehículos'), findsOneWidget);
    expect(find.text('Renault Logan'), findsOneWidget);
    expect(find.text('Nuevo vehículo'), findsNothing);
    expect(find.byTooltip('Quitar de favoritos'), findsNothing);
    api.dispose();
    await tester.binding.setSurfaceSize(null);
  });

  testWidgets('El administrador puede registrar un vehículo', (tester) async {
    final usuario = Usuario.fromJson(const {
      'id': 1, 'nombre': 'Ana', 'correo': 'admin@demo.local',
      'rol': 'administrador',
    });
    final registros = <Map<String, dynamic>>[];
    final api = ApiService(url: 'http://localhost:8091',
      client: MockClient((request) async {
        if (request.url.path == '/vehiculos' && request.method == 'GET') {
          return http.Response(jsonEncode({
            'datos': registros, 'pagina': 1, 'tamano': 6,
            'total': registros.length,
            'total_paginas': registros.isEmpty ? 0 : 1,
          }), 200);
        }
        if (request.url.path == '/resumen') {
          return http.Response(jsonEncode({
            'total': registros.length, 'disponibles': registros.length,
            'favoritos': 0,
          }), 200);
        }
        if (request.url.path == '/vehiculos' && request.method == 'POST') {
          final data = jsonDecode(request.body) as Map<String, dynamic>;
          final creado = {
            ...data, 'id': 22, 'imagen_url': null, 'es_favorito': false,
          };
          registros.add(creado);
          return http.Response(jsonEncode(creado), 201);
        }
        return http.Response('{}', 404);
      }),
    );
    await tester.binding.setSurfaceSize(const Size(1100, 1000));
    await tester.pumpWidget(MaterialApp(home: Scaffold(
      body: CatalogoPage(api: api, usuario: usuario),
    )));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Nuevo vehículo'));
    await tester.pumpAndSettle();
    expect(find.text('Nuevo vehículo'), findsWidgets);
    final campos = find.byType(TextFormField);
    await tester.enterText(campos.at(0), 'Mazda 2');
    await tester.enterText(campos.at(1), 'Mazda');
    await tester.enterText(campos.at(2), '55000000');
    await tester.tap(find.text('Registrar'));
    await tester.pumpAndSettle();
    expect(find.text('Mazda 2'), findsOneWidget);
    expect(registros.single['marca'], 'Mazda');
    api.dispose();
    await tester.binding.setSurfaceSize(null);
  });

  testWidgets('Administrador ve usuarios y perfiles correctamente',
      (tester) async {
    final administrador = Usuario.fromJson(const {
      'id': 1, 'nombre': 'Ana', 'correo': 'admin@demo.local',
      'rol': 'administrador',
    });
    final api = ApiService(url: 'http://localhost:8091',
      client: MockClient((request) async {
        if (request.url.path == '/usuarios') {
          return http.Response(jsonEncode([
            {'id': 1, 'nombre': 'Ana', 'correo': 'admin@demo.local',
              'rol': 'administrador'},
            {'id': 2, 'nombre': 'Luis', 'correo': 'vendedor@demo.local',
              'rol': 'vendedor'},
          ]), 200);
        }
        return http.Response('{}', 404);
      }),
    );
    await tester.binding.setSurfaceSize(const Size(1100, 1000));
    await tester.pumpWidget(MaterialApp(
      home: Scaffold(body: UsuariosPage(api: api, actual: administrador)),
    ));
    await tester.pumpAndSettle();
    expect(find.text('Administración de usuarios'), findsOneWidget);
    expect(find.text('Crear usuario'), findsOneWidget);
    expect(find.text('Luis'), findsOneWidget);
    expect(find.text('Tu cuenta'), findsOneWidget);
    api.dispose();
    await tester.binding.setSurfaceSize(null);
  });
  testWidgets('Catálogo mantiene diseño sin desbordar en móvil', (tester) async {
    final cliente = Usuario.fromJson(const {
      'id': 3, 'nombre': 'Sofía', 'correo': 'cliente@demo.local',
      'rol': 'cliente',
    });
    final api = ApiService(url: 'http://localhost:8091',
      client: MockClient((request) async {
        if (request.url.path == '/resumen') {
          return http.Response('{"total":1,"disponibles":1,"favoritos":0}', 200);
        }
        return http.Response(jsonEncode({
          'datos': [vehiculo()], 'pagina': 1, 'tamano': 6,
          'total': 1, 'total_paginas': 1,
        }), 200);
      }),
    );
    await tester.binding.setSurfaceSize(const Size(360, 760));
    await tester.pumpWidget(MaterialApp(
      home: Scaffold(body: CatalogoPage(api: api, usuario: cliente)),
    ));
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
    expect(find.text('Catálogo de vehículos'), findsOneWidget);
    expect(
      tester.getSize(find.byType(TextField).first).width,
      greaterThan(285),
    );
    expect(
      tester.getSize(find.byType(DropdownButtonFormField<String>).first).width,
      greaterThan(285),
    );
    api.dispose();
    await tester.binding.setSurfaceSize(null);
  });

}
