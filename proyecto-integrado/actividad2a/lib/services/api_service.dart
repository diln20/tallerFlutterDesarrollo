import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';

import '../models/usuario.dart';
import 'imagen_service.dart';

class ApiException implements Exception {
  const ApiException(this.mensaje, {this.codigo});

  final String mensaje;
  final int? codigo;

  @override
  String toString() => mensaje;
}

class ApiService {
  ApiService({String? url, http.Client? client})
    : urlBase = (url ?? _direccionPredeterminada()).replaceFirst(
        RegExp(r'/$'),
        '',
      ),
      _cliente = client ?? http.Client();

  final String urlBase;
  final http.Client _cliente;
  String? _autorizacion;

  static String _direccionPredeterminada() {
    const configurada = String.fromEnvironment('API_URL', defaultValue: '');
    if (configurada.isNotEmpty) return configurada;
    if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:8091';
    }
    return 'http://127.0.0.1:8091';
  }

  String urlImagen(String ruta) {
    final uri = Uri.parse(ruta);
    if (uri.hasScheme) return ruta;
    return Uri.parse(urlBase).resolve(ruta).toString();
  }

  Map<String, String> get _encabezados => {
    'Accept': 'application/json',
    if (_autorizacion != null) 'Authorization': 'Basic $_autorizacion',
  };

  Future<Usuario> iniciarSesion(String correo, String contrasena) async {
    _autorizacion = base64Encode(utf8.encode('$correo:$contrasena'));
    try {
      final respuesta = await obtener('/sesion');
      return Usuario.fromJson(respuesta as Map<String, dynamic>);
    } catch (_) {
      _autorizacion = null;
      rethrow;
    }
  }

  void cerrarSesion() => _autorizacion = null;

  Uri _uri(String ruta, [Map<String, String>? params]) =>
      Uri.parse('$urlBase$ruta').replace(queryParameters: params);

  Future<dynamic> obtener(String ruta, [Map<String, String>? params]) async {
    return _leer(
      await _solicitar(
        () => _cliente.get(_uri(ruta, params), headers: _encabezados),
      ),
    );
  }

  Future<dynamic> enviar(String metodo, String ruta, [Object? datos]) async {
    final headers = {
      ..._encabezados,
      if (datos != null) 'Content-Type': 'application/json',
    };
    final body = datos == null ? null : jsonEncode(datos);
    return _leer(
      await _solicitar(() {
        final uri = _uri(ruta);
        return switch (metodo) {
          'POST' => _cliente.post(uri, headers: headers, body: body),
          'PUT' => _cliente.put(uri, headers: headers, body: body),
          'PATCH' => _cliente.patch(uri, headers: headers, body: body),
          'DELETE' => _cliente.delete(uri, headers: headers),
          _ => throw ArgumentError('Método HTTP no admitido: $metodo'),
        };
      }),
    );
  }

  Future<dynamic> subirImagen(int id, ImagenSeleccionada imagen) async {
    final request = http.MultipartRequest(
      'POST',
      _uri('/vehiculos/$id/imagen'),
    );
    request.headers.addAll(_encabezados);
    String subtipo;
    final b = imagen.bytes;
    if (b.length >= 8 && b[0] == 0x89 && b[1] == 0x50) {
      subtipo = 'png';
    } else if (b.length >= 3 && b[0] == 0xff && b[1] == 0xd8) {
      subtipo = 'jpeg';
    } else if (b.length >= 12 &&
        String.fromCharCodes(b.take(4)) == 'RIFF' &&
        String.fromCharCodes(b.skip(8).take(4)) == 'WEBP') {
      subtipo = 'webp';
    } else {
      throw const ApiException('La imagen debe ser JPEG, PNG o WebP.');
    }
    request.files.add(
      http.MultipartFile.fromBytes(
        'archivo',
        imagen.bytes,
        filename: imagen.nombre,
        contentType: MediaType('image', subtipo),
      ),
    );
    final respuesta = await _solicitar(() async {
      final streamed = await _cliente.send(request);
      return http.Response.fromStream(streamed);
    });
    return _leer(respuesta);
  }

  Future<http.Response> _solicitar(
    Future<http.Response> Function() tarea,
  ) async {
    try {
      return await tarea().timeout(const Duration(seconds: 20));
    } on ApiException {
      rethrow;
    } catch (_) {
      throw ApiException(
        'No se pudo conectar con la API ($urlBase). '
        'Verifica que esté iniciada y que la dirección corresponda al dispositivo.',
      );
    }
  }

  dynamic _leer(http.Response respuesta) {
    if (respuesta.statusCode == 204) return null;
    dynamic contenido;
    try {
      contenido = jsonDecode(utf8.decode(respuesta.bodyBytes));
    } on FormatException {
      if (respuesta.statusCode >= 200 && respuesta.statusCode < 300) {
        throw const ApiException('La API devolvió una respuesta no válida.');
      }
    }
    if (respuesta.statusCode < 200 || respuesta.statusCode >= 300) {
      final detalle = contenido is Map<String, dynamic>
          ? contenido['detail']
          : null;
      final texto = detalle is String
          ? detalle
          : (respuesta.statusCode == 401
                ? 'Correo o contraseña incorrectos.'
                : 'La operación no se pudo completar.');
      throw ApiException(texto, codigo: respuesta.statusCode);
    }
    return contenido;
  }

  void dispose() => _cliente.close();
}
