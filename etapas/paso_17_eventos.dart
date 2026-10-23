abstract class VehiculosEvento {}

class VehiculoGuardado extends VehiculosEvento {
  VehiculoGuardado({
    required this.nombre,
    required this.anio,
    required this.precio,
    required this.correo,
  });

  final String nombre;
  final int anio;
  final double precio;
  final String correo;
}

class EdicionIniciada extends VehiculosEvento {
  EdicionIniciada(this.indice);
  final int indice;
}

class EdicionCancelada extends VehiculosEvento {}

class VehiculoEliminado extends VehiculosEvento {
  VehiculoEliminado(this.indice);
  final int indice;
}

class BusquedaCambiada extends VehiculosEvento {
  BusquedaCambiada(this.texto);
  final String texto;
}
