import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

import '../lib/models/vehiculo.dart';
import '../lib/repositories/vehiculos_api.dart';
import '../lib/validators/validadores.dart';

void main() {
  test('validadores rechazan entradas no válidas', () {
    expect(Validadores.nombre('  '), isNotNull);
    expect(Validadores.nombre('Renault 9'), isNull);
    expect(Validadores.anio('abc'), isNotNull);
    expect(Validadores.anio('2020'), isNull);
    expect(Validadores.precio('0'), isNotNull);
    expect(Validadores.precio('25000000.50'), isNull);
    expect(Validadores.correo('correo sin arroba'), isNotNull);
    expect(Validadores.correo('cliente@ejemplo.com'), isNull);
  });

  test('modelo transforma precio JSON a double', () {
    final vehiculo = Vehiculo.fromJson({
      'id': 7,
      'nombre': 'Renault 9',
      'anio': 1994,
      'precio': 12000000,
      'correo': 'cliente@ejemplo.com',
      'disponible': true,
    });
    expect(vehiculo.id, 7);
    expect(vehiculo.precio, 12000000.0);
  });

  test('repositorio lee respuesta JSON de GET /vehiculos', () async {
    final cliente = MockClient((peticion) async {
      expect(peticion.method, 'GET');
      expect(peticion.url.path, '/vehiculos');
      return http.Response(
        '[{"id":4,"nombre":"Mazda 3","anio":2020,'
        '"precio":35000000.5,"correo":"cliente@ejemplo.com",'
        '"disponible":true}]',
        200,
        headers: {'content-type': 'application/json'},
      );
    });
    final api = VehiculosApi(urlBase: 'http://ejemplo.local:8000', cliente: cliente);
    final lista = await api.listar();
    expect(lista, hasLength(1));
    expect(lista.first.nombre, 'Mazda 3');
    api.cerrar();
  });
}
