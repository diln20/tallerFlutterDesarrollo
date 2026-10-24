import '../models/vehiculo.dart';

abstract class VehiculosEvento {}

class SesionIniciada extends VehiculosEvento {
  SesionIniciada(this.usuario, this.contrasena);
  final String usuario;
  final String contrasena;
}

class SesionCerrada extends VehiculosEvento {}

class PaginaSolicitada extends VehiculosEvento {
  PaginaSolicitada(this.pagina);
  final int pagina;
}

class TamanoPaginaCambiado extends VehiculosEvento {
  TamanoPaginaCambiado(this.tamano);
  final int tamano;
}

class BusquedaSolicitada extends VehiculosEvento {
  BusquedaSolicitada(this.texto);
  final String texto;
}

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

class DisponibilidadAlternada extends VehiculosEvento {
  DisponibilidadAlternada(this.id);
  final int id;
}

class VehiculoRestaurado extends VehiculosEvento {
  VehiculoRestaurado(this.vehiculo);
  final Vehiculo vehiculo;
}
