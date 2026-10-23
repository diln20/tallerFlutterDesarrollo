class Validadores {
  static String? nombre(String? valor) {
    final texto = (valor ?? '').trim();
    if (texto.isEmpty) return 'Escribe el nombre del vehículo';
    if (texto.length < 3) return 'Mínimo 3 caracteres';
    if (texto.length > 60) return 'Máximo 60 caracteres';
    return null;
  }

  static String? anio(String? valor) {
    final numero = int.tryParse((valor ?? '').trim());
    if (numero == null) return 'Escribe un año con números enteros';
    if (numero < 1900 || numero > DateTime.now().year + 1) {
      return 'El año debe estar entre 1900 y el próximo año';
    }
    return null;
  }

  static String? precio(String? valor) {
    final numero = double.tryParse((valor ?? '').trim());
    if (numero == null || !numero.isFinite || numero <= 0) {
      return 'Escribe un precio mayor que cero (ej. 25000000.50)';
    }
    return null;
  }

  static String? correo(String? valor) {
    final texto = (valor ?? '').trim();
    if (texto.isEmpty) return 'Escribe un correo de contacto';
    if (texto.length > 120) return 'Máximo 120 caracteres';
    if (!RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(texto)) {
      return 'Escribe un correo válido: ejemplo@correo.com';
    }
    return null;
  }
}
