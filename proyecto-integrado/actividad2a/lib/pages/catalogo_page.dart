import 'dart:async';

import 'package:flutter/material.dart';

import '../models/permiso.dart';
import '../models/usuario.dart';
import '../models/vehiculo.dart';
import '../repositories/vehiculo_repository.dart';
import '../services/api_service.dart';
import '../services/imagen_service.dart';
import '../widgets/vehiculo_card.dart';
import '../widgets/vehiculo_form_dialog.dart';

class CatalogoPage extends StatefulWidget {
  const CatalogoPage({super.key, required this.api, required this.usuario});

  final ApiService api;
  final Usuario usuario;

  @override
  State<CatalogoPage> createState() => _CatalogoPageState();
}

class _CatalogoPageState extends State<CatalogoPage> {
  late final VehiculoRepository _repositorio;
  final _imagenService = ImagenService();
  final _buscar = TextEditingController();
  final _marca = TextEditingController();

  Timer? _debounce;
  int _peticionActual = 0;
  int _pagina = 1;
  String _orden = 'recientes';
  double? _precioMaximo;
  bool _soloFavoritos = false;
  bool _soloDisponibles = false;
  bool _cargando = true;
  String? _error;
  PaginaVehiculos? _datos;
  ResumenVehiculos? _resumen;

  @override
  void initState() {
    super.initState();
    _repositorio = VehiculoRepository(widget.api);
    _cargar();
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _buscar.dispose();
    _marca.dispose();
    super.dispose();
  }

  void _programarFiltro() {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 330), () {
      if (mounted) _cargar(reiniciar: true);
    });
  }

  Future<void> _cargar({bool reiniciar = false}) async {
    if (reiniciar) _pagina = 1;
    final numeroPeticion = ++_peticionActual;
    setState(() {
      _cargando = true;
      _error = null;
    });
    try {
      final resultado = await _repositorio.listar(
        pagina: _pagina,
        buscar: _buscar.text.trim(),
        marca: _marca.text.trim(),
        precioMaximo: _precioMaximo,
        soloFavoritos: _soloFavoritos,
        soloDisponibles: _soloDisponibles,
        orden: _orden,
      );
      final resumen = await _repositorio.resumen();
      if (!mounted || numeroPeticion != _peticionActual) return;
      if (_pagina > 1 && _pagina > resultado.totalPaginas) {
        _pagina = resultado.totalPaginas == 0 ? 1 : resultado.totalPaginas;
        await _cargar();
        return;
      }
      setState(() {
        _datos = resultado;
        _resumen = resumen;
        _cargando = false;
      });
    } catch (error) {
      if (mounted && numeroPeticion == _peticionActual) {
        setState(() {
          _error = error.toString();
          _cargando = false;
        });
      }
    }
  }

  Future<void> _guardarVehiculo(Vehiculo? anterior) async {
    int? idPersistido = anterior?.id;
    await showDialog<bool>(
      context: context,
      builder: (_) => VehiculoFormDialog(
        api: widget.api,
        imagenService: _imagenService,
        vehiculo: anterior,
        onGuardar: (formulario) async {
          if (idPersistido == null) {
            final nuevo = await _repositorio.crear(formulario.datos);
            idPersistido = nuevo.id;
          } else {
            await _repositorio.editar(idPersistido!, formulario.datos);
          }
          if (formulario.quitarImagen) {
            await _repositorio.quitarImagen(idPersistido!);
          }
          if (formulario.imagen != null) {
            await _repositorio.subirImagen(idPersistido!, formulario.imagen!);
          }
        },
      ),
    );
    if (mounted) _cargar();
  }

  Future<void> _eliminar(Vehiculo vehiculo) async {
    final confirmar = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirmar eliminación'),
        content: Text('¿Eliminar ${vehiculo.nombre} y su fotografía?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );
    if (confirmar != true) return;
    try {
      await _repositorio.eliminar(vehiculo.id);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vehículo eliminado correctamente')),
      );
      _cargar();
    } catch (error) {
      _avisar(error.toString());
    }
  }

  Future<void> _favorito(Vehiculo vehiculo) async {
    try {
      await _repositorio.cambiarFavorito(
        vehiculo.id,
        favorito: !vehiculo.esFavorito,
      );
      if (mounted) _cargar();
    } catch (error) {
      _avisar(error.toString());
    }
  }

  void _avisar(String mensaje) {
    if (!mounted) return;
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(mensaje)));
  }

  Widget _contador(String titulo, int cantidad, IconData icono) => Card(
    elevation: 0,
    child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icono, color: Theme.of(context).colorScheme.primary),
          const SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('$cantidad', style: Theme.of(context).textTheme.titleLarge),
              Text(titulo, style: Theme.of(context).textTheme.bodySmall),
            ],
          ),
        ],
      ),
    ),
  );

  @override
  Widget build(BuildContext context) {
    final datos = _datos;
    final puedeCrear = tienePermiso(widget.usuario, Permiso.crearVehiculo);
    final puedeEditar = tienePermiso(widget.usuario, Permiso.editarVehiculo);
    final puedeEliminar = tienePermiso(
      widget.usuario,
      Permiso.eliminarVehiculo,
    );
    final colores = Theme.of(context).colorScheme;

    return RefreshIndicator(
      onRefresh: _cargar,
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
        children: [
          Wrap(
            spacing: 12,
            runSpacing: 10,
            alignment: WrapAlignment.spaceBetween,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Catálogo de vehículos',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  Text(
                    'Consulta, compara y guarda tus favoritos.',
                    style: TextStyle(color: colores.onSurfaceVariant),
                  ),
                ],
              ),
              if (puedeCrear)
                FilledButton.icon(
                  onPressed: () => _guardarVehiculo(null),
                  icon: const Icon(Icons.add),
                  label: const Text('Nuevo vehículo'),
                ),
            ],
          ),
          const SizedBox(height: 14),
          if (_resumen != null)
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _contador(
                  'Registrados',
                  _resumen!.total,
                  Icons.directions_car_outlined,
                ),
                _contador(
                  'Disponibles',
                  _resumen!.disponibles,
                  Icons.check_circle_outline,
                ),
                _contador(
                  'Mis favoritos',
                  _resumen!.favoritos,
                  Icons.favorite_border,
                ),
              ],
            ),
          const SizedBox(height: 14),
          Card(
            elevation: 0,
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Buscar y filtrar',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      SizedBox(
                        width: 260,
                        child: TextField(
                          controller: _buscar,
                          onChanged: (_) => _programarFiltro(),
                          decoration: const InputDecoration(
                            labelText: 'Marca o modelo',
                            prefixIcon: Icon(Icons.search),
                          ),
                        ),
                      ),
                      SizedBox(
                        width: 210,
                        child: TextField(
                          controller: _marca,
                          onChanged: (_) => _programarFiltro(),
                          decoration: const InputDecoration(
                            labelText: 'Filtrar por marca',
                            prefixIcon: Icon(Icons.sell_outlined),
                          ),
                        ),
                      ),
                      SizedBox(
                        width: 230,
                        child: DropdownButtonFormField<double?>(
                          initialValue: _precioMaximo,
                          isExpanded: true,
                          decoration: const InputDecoration(
                            labelText: 'Precio máximo',
                          ),
                          items: const [
                            DropdownMenuItem<double?>(
                              value: null,
                              child: Text('Cualquier precio'),
                            ),
                            DropdownMenuItem<double?>(
                              value: 35000000,
                              child: Text('Hasta 35 millones'),
                            ),
                            DropdownMenuItem<double?>(
                              value: 60000000,
                              child: Text('Hasta 60 millones'),
                            ),
                            DropdownMenuItem<double?>(
                              value: 100000000,
                              child: Text('Hasta 100 millones'),
                            ),
                            DropdownMenuItem<double?>(
                              value: 200000000,
                              child: Text('Hasta 200 millones'),
                            ),
                          ],
                          onChanged: (v) {
                            _precioMaximo = v;
                            _cargar(reiniciar: true);
                          },
                        ),
                      ),
                      SizedBox(
                        width: 205,
                        child: DropdownButtonFormField<String>(
                          isExpanded: true,
                          initialValue: _orden,
                          decoration: const InputDecoration(
                            labelText: 'Ordenar por',
                          ),
                          items: const [
                            DropdownMenuItem(
                              value: 'recientes',
                              child: Text('Más recientes'),
                            ),
                            DropdownMenuItem(
                              value: 'nombre',
                              child: Text('Nombre'),
                            ),
                            DropdownMenuItem(
                              value: 'precio_asc',
                              child: Text('Menor precio'),
                            ),
                            DropdownMenuItem(
                              value: 'precio_desc',
                              child: Text('Mayor precio'),
                            ),
                          ],
                          onChanged: (v) {
                            if (v != null) {
                              _orden = v;
                              _cargar(reiniciar: true);
                            }
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Wrap(
                    spacing: 14,
                    children: [
                      FilterChip(
                        label: const Text('Solo disponibles'),
                        selected: _soloDisponibles,
                        onSelected: (v) {
                          _soloDisponibles = v;
                          _cargar(reiniciar: true);
                        },
                      ),
                      FilterChip(
                        label: const Text('Solo mis favoritos'),
                        avatar: const Icon(Icons.favorite_border, size: 18),
                        selected: _soloFavoritos,
                        onSelected: (v) {
                          _soloFavoritos = v;
                          _cargar(reiniciar: true);
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 14),
          if (_cargando) const LinearProgressIndicator(),
          if (_error != null)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Text(_error!, style: TextStyle(color: colores.error)),
                    TextButton.icon(
                      onPressed: _cargar,
                      icon: const Icon(Icons.refresh),
                      label: const Text('Reintentar'),
                    ),
                  ],
                ),
              ),
            ),
          if (!_cargando && _error == null && datos != null) ...[
            Text(
              '${datos.total} vehículo(s) encontrado(s)',
              style: Theme.of(context).textTheme.titleSmall,
            ),
            const SizedBox(height: 8),
            if (datos.datos.isEmpty)
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(26),
                  child: Center(
                    child: Text('No hay vehículos con estos filtros.'),
                  ),
                ),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: datos.datos.length,
                itemBuilder: (context, index) {
                  final vehiculo = datos.datos[index];
                  return VehiculoCard(
                    key: ValueKey(vehiculo.id),
                    vehiculo: vehiculo,
                    urlImagen: widget.api.urlImagen,
                    onFavorito: () => _favorito(vehiculo),
                    onEditar: puedeEditar
                        ? () => _guardarVehiculo(vehiculo)
                        : null,
                    onEliminar: puedeEliminar
                        ? () => _eliminar(vehiculo)
                        : null,
                  );
                },
              ),
            if (datos.totalPaginas > 0)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    IconButton.filledTonal(
                      tooltip: 'Página anterior',
                      onPressed: _pagina > 1 && !_cargando
                          ? () {
                              _pagina--;
                              _cargar();
                            }
                          : null,
                      icon: const Icon(Icons.chevron_left),
                    ),
                    const SizedBox(width: 16),
                    Text('Página ${datos.pagina} de ${datos.totalPaginas}'),
                    const SizedBox(width: 16),
                    IconButton.filledTonal(
                      tooltip: 'Página siguiente',
                      onPressed: _pagina < datos.totalPaginas && !_cargando
                          ? () {
                              _pagina++;
                              _cargar();
                            }
                          : null,
                      icon: const Icon(Icons.chevron_right),
                    ),
                  ],
                ),
              ),
          ],
          const SizedBox(height: 35),
        ],
      ),
    );
  }
}
