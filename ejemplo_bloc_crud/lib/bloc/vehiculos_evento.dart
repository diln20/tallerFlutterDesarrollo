abstract class VehiculosEvento {}

class VehiculoGuardado extends VehiculosEvento {
  VehiculoGuardado(this.nombre);
  final String nombre;
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
