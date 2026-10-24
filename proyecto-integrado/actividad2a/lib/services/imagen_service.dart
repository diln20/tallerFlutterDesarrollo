import 'package:flutter/foundation.dart';
import 'package:image_picker/image_picker.dart';

class ImagenSeleccionada {
  const ImagenSeleccionada({required this.bytes, required this.nombre});

  final Uint8List bytes;
  final String nombre;
}

class ImagenService {
  ImagenService({ImagePicker? picker}) : _picker = picker ?? ImagePicker();

  final ImagePicker _picker;
  static const int tamanoMaximo = 5 * 1024 * 1024;

  Future<ImagenSeleccionada?> seleccionar({bool camara = false}) async {
    if (camara && kIsWeb) {
      throw const FormatException(
        'Para navegador usa el selector de archivos.',
      );
    }
    final XFile? archivo = await _picker.pickImage(
      source: camara ? ImageSource.camera : ImageSource.gallery,
      maxWidth: 1600,
      imageQuality: 75,
    );
    if (archivo == null) return null;
    final bytes = await archivo.readAsBytes();
    if (bytes.isEmpty || bytes.length > tamanoMaximo) {
      throw const FormatException('Elige una imagen de hasta 5 MB.');
    }
    final nombre = archivo.name.trim().isEmpty ? 'vehiculo.jpg' : archivo.name;
    return ImagenSeleccionada(bytes: bytes, nombre: nombre);
  }
}
