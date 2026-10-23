import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/vehiculo.dart';

class VehiculosApi {
  VehiculosApi({String? urlBase, http.Client? cliente})
      : urlBase = urlBase ??
            const String.fromEnvironment(
              'API_URL',
              defaultValue: 'http://10.0.2.2:8000',
            ),
        _cliente = cliente ?? http.Client();

  final String urlBase;
  final http.Client _cliente;

  Uri get _ruta => Uri.parse('$urlBase/vehiculos');

  Future<List<Vehiculo>> listar() async {
    final respuesta = await _cliente.get(_ruta);
    _verificar(respuesta, 200);
    final datos = jsonDecode(respuesta.body) as List<dynamic>;
    return datos
        .map((item) => Vehiculo.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<void> crear({
    required String nombre,
    required int anio,
    required double precio,
    required String correo,
  }) async {
    final respuesta = await _cliente.post(
      _ruta,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'nombre': nombre,
        'anio': anio,
        'precio': precio,
        'correo': correo,
        'disponible': true,
      }),
    );
    _verificar(respuesta, 201);
  }

  Future<void> actualizar({
    required int id,
    required String nombre,
    required int anio,
    required double precio,
    required String correo,
    required bool disponible,
  }) async {
    final respuesta = await _cliente.put(
      Uri.parse('$urlBase/vehiculos/$id'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'nombre': nombre,
        'anio': anio,
        'precio': precio,
        'correo': correo,
        'disponible': disponible,
      }),
    );
    _verificar(respuesta, 200);
  }

  Future<void> eliminar(int id) async {
    final respuesta = await _cliente.delete(
      Uri.parse('$urlBase/vehiculos/$id'),
    );
    _verificar(respuesta, 204);
  }

  void _verificar(http.Response respuesta, int esperado) {
    if (respuesta.statusCode != esperado) {
      throw Exception(
        'Error HTTP ${respuesta.statusCode}. Revisa la API y sus datos.',
      );
    }
  }

  void cerrar() => _cliente.close();
}
