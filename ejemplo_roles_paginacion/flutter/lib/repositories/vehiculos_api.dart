import 'dart:convert';
import 'package:flutter/foundation.dart' show kIsWeb, TargetPlatform, defaultTargetPlatform;

import 'package:http/http.dart' as http;
import '../models/pagina_vehiculos.dart';
import '../models/sesion_usuario.dart';

/// El servidor FastAPI corre en Windows; el emulador Android usa 10.0.2.2.
/// API_URL puede cambiarse para probar Docker o una URL segura.
String urlApiPredeterminada() {
  const especificada = String.fromEnvironment('API_URL');
  if (especificada.isNotEmpty) return especificada;
  if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
    return 'http://10.0.2.2:8001';
  }
  return 'http://127.0.0.1:8001';
}

class ErrorApi implements Exception {
  const ErrorApi(this.mensaje, {this.codigo});
  final String mensaje;
  final int? codigo;

  @override
  String toString() => mensaje;
}

class VehiculosApi {
  VehiculosApi({http.Client? cliente, String? urlBase})
      : _cliente = cliente ?? http.Client(),
        urlBase = urlBase ?? urlApiPredeterminada();

  final http.Client _cliente;
  final String urlBase;
  String? _usuario;
  String? _contrasena;

  Map<String, String> get _headers {
    if (_usuario == null || _contrasena == null) {
      throw const ErrorApi('Primero debes iniciar sesión');
    }
    final token = base64Encode(utf8.encode(_usuario! + ':' + _contrasena!));
    return {
      'Authorization': 'Basic ' + token,
      'Content-Type': 'application/json',
    };
  }

  Future<SesionUsuario> iniciarSesion(String nombre, String clave) async {
    final token = base64Encode(utf8.encode(nombre + ':' + clave));
    final respuesta = await _cliente.get(
      Uri.parse(urlBase + '/sesion'),
      headers: {'Authorization': 'Basic ' + token},
    );
    _verificar(respuesta, 200);
    _usuario = nombre;
    _contrasena = clave;
    return SesionUsuario.fromJson(
      jsonDecode(respuesta.body) as Map<String, dynamic>,
    );
  }

  void cerrarSesion() {
    _usuario = null;
    _contrasena = null;
  }

  Future<PaginaVehiculos> listarPagina({
    required int pagina,
    required int tamano,
    String buscar = '',
  }) async {
    final uri = Uri.parse(urlBase + '/vehiculos').replace(
      queryParameters: {
        'pagina': pagina.toString(),
        'tamano': tamano.toString(),
        'buscar': buscar,
      },
    );
    final respuesta = await _cliente.get(uri, headers: _headers);
    _verificar(respuesta, 200);
    return PaginaVehiculos.fromJson(
      jsonDecode(respuesta.body) as Map<String, dynamic>,
    );
  }

  Future<int> crear({
    required String nombre,
    required int anio,
    required double precio,
    required String correo,
    bool disponible = true,
  }) async {
    final respuesta = await _cliente.post(
      Uri.parse(urlBase + '/vehiculos'),
      headers: _headers,
      body: jsonEncode({
        'nombre': nombre,
        'anio': anio,
        'precio': precio,
        'correo': correo,
        'disponible': disponible,
      }),
    );
    _verificar(respuesta, 201);
    final objeto = jsonDecode(respuesta.body) as Map<String, dynamic>;
    return objeto['id'] as int;
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
      Uri.parse(urlBase + '/vehiculos/' + id.toString()),
      headers: _headers,
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
      Uri.parse(urlBase + '/vehiculos/' + id.toString()),
      headers: _headers,
    );
    _verificar(respuesta, 204);
  }

  void _verificar(http.Response respuesta, int esperado) {
    if (respuesta.statusCode == esperado) return;
    switch (respuesta.statusCode) {
      case 401:
        throw const ErrorApi('Usuario o contraseña incorrectos.', codigo: 401);
      case 403:
        throw const ErrorApi('Tu rol no tiene permiso para modificar.', codigo: 403);
      case 404:
        throw const ErrorApi('El vehículo ya no existe. Actualiza la lista.', codigo: 404);
      case 422:
        throw const ErrorApi('Revisa los valores del formulario.', codigo: 422);
      default:
        throw ErrorApi(
          'Error de conexión con la API (HTTP ' +
              respuesta.statusCode.toString() + ').',
          codigo: respuesta.statusCode,
        );
    }
  }

  void cerrar() => _cliente.close();
}
