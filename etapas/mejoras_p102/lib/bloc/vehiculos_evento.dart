import 'vehiculos_estado.dart';

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

class FavoritoAlternado extends VehiculosEvento {
  FavoritoAlternado(this.indice);
  final int indice;
}

class DisponibilidadAlternada extends VehiculosEvento {
  DisponibilidadAlternada(this.indice);
  final int indice;
}

class FiltroCambiado extends VehiculosEvento {
  FiltroCambiado(this.filtro);
  final FiltroVehiculos filtro;
}

class OrdenCambiado extends VehiculosEvento {
  OrdenCambiado(this.orden);
  final OrdenVehiculos orden;
}

