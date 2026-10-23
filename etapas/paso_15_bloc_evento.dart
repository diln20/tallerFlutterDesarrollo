abstract class BusquedaEvento {
  const BusquedaEvento();
}

class BusquedaTextoCambiado extends BusquedaEvento {
  final String texto;

  const BusquedaTextoCambiado(this.texto);
}
