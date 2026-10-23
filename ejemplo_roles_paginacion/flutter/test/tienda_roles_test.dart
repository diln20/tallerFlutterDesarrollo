import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

import '../lib/models/pagina_vehiculos.dart';
import '../lib/models/vehiculo.dart';
import '../lib/repositories/vehiculos_api.dart';
import '../lib/validators/validadores.dart';

void main() {
  test('El mismo JSON produce objetos con propiedades tipadas', () {
    final auto = Vehiculo.fromJson({
      'id': 15,
      'nombre': 'Renault 9',
      'anio': 1994,
      'precio': 12000000,
      'correo': 'cliente@ejemplo.com',
      'disponible': true,
    });
    expect(auto.id, 15);
    expect(auto.precio, 12000000.0);
    expect(auto.toJson()['nombre'], 'Renault 9');
  });

  test('La pagina JSON conserva total y tamano', () {
    final pagina = PaginaVehiculos.fromJson({
      'datos': [
        {
          'id': 2,
          'nombre': 'Mazda 3',
          'anio': 2019,
          'precio': 28000000.0,
          'correo': 'cliente@ejemplo.com',
          'disponible': true,
        },
      ],
      'pagina': 2,
      'tamano': 5,
      'total': 6,
      'total_paginas': 2,
    });
    expect(pagina.datos.single.nombre, 'Mazda 3');
    expect(pagina.pagina, 2);
    expect(pagina.total, 6);
  });

  test('Lector envia Basic y consulta pagina sin modificar', () async {
    final llamadas = <String>[];
    final cliente = MockClient((solicitud) async {
      llamadas.add(solicitud.method + ' ' + solicitud.url.path);
      expect(solicitud.headers['Authorization'], startsWith('Basic '));
      if (solicitud.url.path == '/sesion') {
        return http.Response('{"nombre":"lector","rol":"lector"}', 200);
      }
      expect(solicitud.url.queryParameters['pagina'], '2');
      expect(solicitud.url.queryParameters['tamano'], '5');
      expect(solicitud.url.queryParameters['buscar'], 'mazda');
      return http.Response(
        jsonEncode({
          'datos': <Object>[],
          'pagina': 2, 'tamano': 5, 'total': 6, 'total_paginas': 2,
        }),
        200,
      );
    });
    final api = VehiculosApi(
      cliente: cliente,
      urlBase: 'http://prueba.local:8000',
    );
    final usuario = await api.iniciarSesion('lector', 'lector123');
    expect(usuario.puedeModificar, false);
    final pagina = await api.listarPagina(
      pagina: 2, tamano: 5, buscar: 'mazda',
    );
    expect(pagina.totalPaginas, 2);
    expect(llamadas, ['/sesion', '/vehiculos']);
    api.cerrar();
  });

  test('Si la API devuelve 403 se explica permiso insuficiente', () async {
    final cliente = MockClient((peticion) async {
      if (peticion.url.path == '/sesion') {
        return http.Response('{"nombre":"lector","rol":"lector"}', 200);
      }
      return http.Response('{"detail":"Prohibido"}', 403);
    });
    final api = VehiculosApi(cliente: cliente, urlBase: 'http://prueba.local');
    await api.iniciarSesion('lector', 'lector123');
    expect(
      () => api.eliminar(5),
      throwsA(isA<ErrorApi>().having((e) => e.codigo, 'codigo', 403)),
    );
    api.cerrar();
  });

  test('Validadores comunes siguen activos', () {
    expect(Validadores.nombre(''), isNotNull);
    expect(Validadores.nombre('Renault 9'), isNull);
    expect(Validadores.anio('abc'), isNotNull);
    expect(Validadores.precio('0'), isNotNull);
    expect(Validadores.correo('cliente@ejemplo.com'), isNull);
  });
}
