import '../models/vehiculo.dart';
import '../services/api_service.dart';
import '../services/imagen_service.dart';

class VehiculoRepository {
  const VehiculoRepository(this.api);

  final ApiService api;

  Future<PaginaVehiculos> listar({
    int pagina = 1,
    int tamano = 6,
    String buscar = '',
    String marca = '',
    double? precioMaximo,
    bool soloFavoritos = false,
    bool soloDisponibles = false,
    String orden = 'recientes',
  }) async {
    final params = {
      'pagina': '$pagina',
      'tamano': '$tamano',
      'buscar': buscar,
      'marca': marca,
      if (precioMaximo != null) 'precio_max': precioMaximo.toString(),
      'solo_favoritos': '$soloFavoritos',
      'solo_disponibles': '$soloDisponibles',
      'orden': orden,
    };
    final respuesta = await api.obtener('/vehiculos', params);
    return PaginaVehiculos.fromJson(respuesta as Map<String, dynamic>);
  }

  Future<ResumenVehiculos> resumen() async => ResumenVehiculos.fromJson(
    await api.obtener('/resumen') as Map<String, dynamic>,
  );

  Future<Vehiculo> crear(DatosVehiculo datos) async => Vehiculo.fromJson(
    await api.enviar('POST', '/vehiculos', datos.toJson())
        as Map<String, dynamic>,
  );

  Future<Vehiculo> editar(int id, DatosVehiculo datos) async =>
      Vehiculo.fromJson(
        await api.enviar('PUT', '/vehiculos/$id', datos.toJson())
            as Map<String, dynamic>,
      );

  Future<void> eliminar(int id) async => api.enviar('DELETE', '/vehiculos/$id');

  Future<Vehiculo> subirImagen(int id, ImagenSeleccionada imagen) async =>
      Vehiculo.fromJson(
        await api.subirImagen(id, imagen) as Map<String, dynamic>,
      );

  Future<Vehiculo> quitarImagen(int id) async => Vehiculo.fromJson(
    await api.enviar('DELETE', '/vehiculos/$id/imagen') as Map<String, dynamic>,
  );

  Future<void> cambiarFavorito(int id, {required bool favorito}) async {
    await api.enviar(favorito ? 'PUT' : 'DELETE', '/vehiculos/$id/favorito');
  }
}
