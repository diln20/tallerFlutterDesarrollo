abstract class VehiculosEvento {}

class VehiculosCargados extends VehiculosEvento {}

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
  EdicionIniciada(this.id);
  final int id;
}

class EdicionCancelada extends VehiculosEvento {}

class VehiculoEliminado extends VehiculosEvento {
  VehiculoEliminado(this.id);
  final int id;
}

class BusquedaCambiada extends VehiculosEvento {
  BusquedaCambiada(this.texto);
  final String texto;
}
