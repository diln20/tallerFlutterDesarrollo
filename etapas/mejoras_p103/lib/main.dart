import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'bloc/vehiculos_bloc.dart';
import 'bloc/vehiculos_evento.dart';
import 'bloc/vehiculos_estado.dart';
import 'pages/acerca_page.dart';
import 'pages/ayuda_page.dart';
import 'widgets/boton_tienda.dart';
import 'widgets/campo_nombre_vehiculo.dart';
import 'widgets/titulo_seccion.dart';
import 'widgets/tarjeta_indicador.dart';
import 'validators/validadores.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider<VehiculosBloc>(
      create: (context) => VehiculosBloc(),
      child: const MaterialApp(
        debugShowCheckedModeBanner: false,
        home: TiendaPage(),
      ),
    );
  }
}

class TiendaPage extends StatefulWidget {
  const TiendaPage({super.key});

  @override
  State<TiendaPage> createState() => _TiendaPageState();
}

class _TiendaPageState extends State<TiendaPage> {
  final TextEditingController vehiculoController = TextEditingController();
  final TextEditingController anioController = TextEditingController();
  final TextEditingController precioController = TextEditingController();
  final TextEditingController correoController = TextEditingController();
  final GlobalKey<FormState> formularioKey = GlobalKey<FormState>();
  int indicePestana = 0;
  int paginaActual = 1;
  int registrosPorPagina = 5;

  void cambiarPagina(int nuevaPagina, int totalPaginas) {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setState(() => paginaActual = nuevaPagina);
  }

  void cambiarFiltro(FiltroVehiculos filtro) {
    setState(() => paginaActual = 1);
    context.read<VehiculosBloc>().add(FiltroCambiado(filtro));
  }

  void alternarFavorito(int indiceReal) {
    context.read<VehiculosBloc>().add(FavoritoAlternado(indiceReal));
  }

  void alternarDisponibilidad(int indiceReal) {
    context.read<VehiculosBloc>().add(DisponibilidadAlternada(indiceReal));
  }

  void guardarVehiculo() {
    if (formularioKey.currentState?.validate() != true) {
      return;
    }
    final anio = int.tryParse(anioController.text.trim());
    final precio = double.tryParse(precioController.text.trim());
    if (anio == null || precio == null) return;

    context.read<VehiculosBloc>().add(
      VehiculoGuardado(
        nombre: vehiculoController.text.trim(),
        anio: anio,
        precio: precio,
        correo: correoController.text.trim(),
      ),
    );
    limpiarCampos();
  }

  void limpiarCampos() {
    vehiculoController.clear();
    anioController.clear();
    precioController.clear();
    correoController.clear();
  }

  void comenzarEdicion(int indice) {
    final bloc = context.read<VehiculosBloc>();
    final vehiculo = bloc.state.vehiculos[indice];
    vehiculoController.text = vehiculo.nombre;
    anioController.text = vehiculo.anio.toString();
    precioController.text = vehiculo.precio.toString();
    correoController.text = vehiculo.correo;
    bloc.add(EdicionIniciada(indice));
  }

  Future<void> borrarVehiculo(int indice) async {
    final bloc = context.read<VehiculosBloc>();
    if (indice < 0 || indice >= bloc.state.vehiculos.length) return;
    final eliminado = bloc.state.vehiculos[indice];

    final confirmado = await showDialog<bool>(
      context: context,
      builder: (dialogo) => AlertDialog(
        title: const Text('Eliminar vehículo'),
        content: Text('¿Eliminar ${eliminado.nombre} del inventario?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogo, false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogo, true),
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );
    if (!mounted || confirmado != true) return;

    limpiarCampos();
    bloc.add(VehiculoEliminado(indice));
    final mensajes = ScaffoldMessenger.of(context);
    mensajes.hideCurrentSnackBar();
    mensajes.showSnackBar(SnackBar(
      content: Text('${eliminado.nombre} eliminado'),
      duration: const Duration(seconds: 6),
      action: SnackBarAction(
        label: 'Deshacer',
        onPressed: () {
          if (!bloc.isClosed) {
            bloc.add(VehiculoRestaurado(indice, eliminado));
          }
        },
      ),
    ));
  }

  void cancelarEdicion() {
    limpiarCampos();
    context.read<VehiculosBloc>().add(EdicionCancelada());
  }

  @override
  void dispose() {
    vehiculoController.dispose();
    anioController.dispose();
    precioController.dispose();
    correoController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tienda')),
      bottomNavigationBar: NavigationBar(
        selectedIndex: indicePestana,
        onDestinationSelected: (indice) {
          setState(() => indicePestana = indice);
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.storefront_outlined),
            selectedIcon: Icon(Icons.storefront),
            label: 'Tienda',
          ),
          NavigationDestination(
            icon: Icon(Icons.summarize_outlined),
            selectedIcon: Icon(Icons.summarize),
            label: 'Resumen',
          ),
          NavigationDestination(
            icon: Icon(Icons.lightbulb_outline),
            selectedIcon: Icon(Icons.lightbulb),
            label: 'Consejos',
          ),
        ],
      ),
      drawer: Drawer(
        child: SafeArea(
          child: ListView(
            padding: EdgeInsets.zero,
            children: [
              const DrawerHeader(
                decoration: BoxDecoration(color: Color(0xFF183B61)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.directions_car, color: Colors.white, size: 42),
                    SizedBox(height: 12),
                    Text('Tienda de vehículos',
                        style: TextStyle(color: Colors.white, fontSize: 19)),
                    Text('Menú de navegación',
                        style: TextStyle(color: Colors.white70)),
                  ],
                ),
              ),
              ListTile(
                leading: const Icon(Icons.storefront),
                title: const Text('Tienda'),
                onTap: () => Navigator.pop(context),
              ),
              ListTile(
                leading: const Icon(Icons.info_outline),
                title: const Text('Acerca de'),
                onTap: () {
                  final navegador = Navigator.of(context);
                  navegador.pop();
                  navegador.push(
                    MaterialPageRoute(builder: (_) => const AcercaPage()),
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.help_outline),
                title: const Text('Ayuda'),
                onTap: () {
                  final navegador = Navigator.of(context);
                  navegador.pop();
                  navegador.push(
                    MaterialPageRoute(builder: (_) => const AyudaPage()),
                  );
                },
              ),
            ],
          ),
        ),
      ),
      body: IndexedStack(
        index: indicePestana,
        children: [
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const TituloSeccion(texto: 'Tienda de vehículos'),
                  const SizedBox(height: 12),
                  const Row(
                    children: [
                      Icon(Icons.directions_car),
                      SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Ingenieria de Sistemas',
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    decoration: const InputDecoration(
                      labelText: 'Buscar marca o modelo',
                      prefixIcon: Icon(Icons.search),
                      border: OutlineInputBorder(),
                    ),
                    onChanged: (texto) {
                      setState(() => paginaActual = 1);
                      context.read<VehiculosBloc>().add(BusquedaCambiada(texto));
                    },
                  ),
                  const SizedBox(height: 12),
                  BlocBuilder<VehiculosBloc, VehiculosEstado>(
                    builder: (context, estado) {
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              ChoiceChip(
                                label: const Text('Todos'),
                                selected: estado.filtro == FiltroVehiculos.todos,
                                onSelected: (_) => cambiarFiltro(FiltroVehiculos.todos),
                              ),
                              ChoiceChip(
                                label: const Text('Disponibles'),
                                selected: estado.filtro == FiltroVehiculos.disponibles,
                                onSelected: (_) =>
                                    cambiarFiltro(FiltroVehiculos.disponibles),
                              ),
                              ChoiceChip(
                                avatar: const Icon(Icons.star, size: 18),
                                label: const Text('Favoritos'),
                                selected: estado.filtro == FiltroVehiculos.favoritos,
                                onSelected: (_) => cambiarFiltro(FiltroVehiculos.favoritos),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          DropdownButtonFormField<OrdenVehiculos>(
                            initialValue: estado.orden,
                            isExpanded: true,
                            decoration: const InputDecoration(
                              labelText: 'Ordenar vehículos',
                              border: OutlineInputBorder(),
                              isDense: true,
                            ),
                            items: const [
                              DropdownMenuItem(
                                value: OrdenVehiculos.recientes,
                                child: Text('Orden de registro'),
                              ),
                              DropdownMenuItem(
                                value: OrdenVehiculos.nombre,
                                child: Text('Nombre A–Z'),
                              ),
                              DropdownMenuItem(
                                value: OrdenVehiculos.precioMenor,
                                child: Text('Precio: menor a mayor'),
                              ),
                              DropdownMenuItem(
                                value: OrdenVehiculos.precioMayor,
                                child: Text('Precio: mayor a menor'),
                              ),
                            ],
                            onChanged: (orden) {
                              if (orden == null) return;
                              setState(() => paginaActual = 1);
                              context.read<VehiculosBloc>().add(OrdenCambiado(orden));
                            },
                          ),
                        ],
                      );
                    },
                  ),
                  const SizedBox(height: 16),
                  const TituloSeccion(texto: 'Agregar un vehículo'),
                  const SizedBox(height: 10),
                  Form(
                    key: formularioKey,
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    child: Column(
                      children: [
                        CampoNombreVehiculo(controller: vehiculoController),
                        const SizedBox(height: 10),
                        TextFormField(
                          controller: anioController,
                          keyboardType: TextInputType.number,
                          decoration: const InputDecoration(
                            labelText: 'Año del vehículo',
                            hintText: '2020',
                            border: OutlineInputBorder(),
                          ),
                          validator: Validadores.anio,
                        ),
                        const SizedBox(height: 10),
                        TextFormField(
                          controller: precioController,
                          keyboardType: const TextInputType.numberWithOptions(
                            decimal: true,
                          ),
                          decoration: const InputDecoration(
                            labelText: 'Precio',
                            hintText: '25000000.50',
                            border: OutlineInputBorder(),
                          ),
                          validator: Validadores.precio,
                        ),
                        const SizedBox(height: 10),
                        TextFormField(
                          controller: correoController,
                          keyboardType: TextInputType.emailAddress,
                          decoration: const InputDecoration(
                            labelText: 'Correo de contacto',
                            hintText: 'cliente@ejemplo.com',
                            border: OutlineInputBorder(),
                          ),
                          validator: Validadores.correo,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                  BlocBuilder<VehiculosBloc, VehiculosEstado>(
                    builder: (context, estado) {
                      return Row(
                        children: [
                          Expanded(
                            child: BotonTienda(
                              texto: estado.indiceEnEdicion == null
                                  ? 'Agregar vehículo'
                                  : 'Guardar cambios',
                              alPresionar: guardarVehiculo,
                            ),
                          ),
                          if (estado.indiceEnEdicion != null) ...[
                            const SizedBox(width: 8),
                            TextButton(
                              onPressed: cancelarEdicion,
                              child: const Text('Cancelar'),
                            ),
                          ],
                        ],
                      );
                    },
                  ),
                  const SizedBox(height: 14),
                  BlocBuilder<VehiculosBloc, VehiculosEstado>(
                    builder: (context, estado) {
                      return Text(
                        'Registrados: ${estado.vehiculos.length} · '
                        'Visibles: ${estado.visibles.length}',
                      );
                    },
                  ),
                  const SizedBox(height: 8),
                  BlocBuilder<VehiculosBloc, VehiculosEstado>(
                    builder: (context, estado) {
                      final cantidad = estado.visibles.length;
                      final totalPaginas = cantidad == 0
                          ? 1
                          : (cantidad + registrosPorPagina - 1) ~/ registrosPorPagina;
                      final paginaSegura =
                          paginaActual > totalPaginas ? totalPaginas : paginaActual;
                      final inicio = (paginaSegura - 1) * registrosPorPagina;
                      final visiblesPagina = estado.visibles
                          .skip(inicio)
                          .take(registrosPorPagina)
                          .toList();

                      if (visiblesPagina.isEmpty) {
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          child: Text(
                            estado.vehiculos.isEmpty
                                ? 'Todavía no hay vehículos registrados.'
                                : 'No hay vehículos que coincidan con la búsqueda o filtro.',
                            textAlign: TextAlign.center,
                          ),
                        );
                      }

                      return ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: visiblesPagina.length,
                        itemBuilder: (context, indiceVisible) {
                          final vehiculo = visiblesPagina[indiceVisible];
                          // El índice REAL evita editar otro vehículo al filtrar.
                          final indiceReal = estado.vehiculos.indexOf(vehiculo);
                          return Card(
                            child: ListTile(
                              leading: IconButton(
                                tooltip: vehiculo.favorito
                                    ? 'Quitar de favoritos'
                                    : 'Marcar como favorito',
                                onPressed: () => alternarFavorito(indiceReal),
                                icon: Icon(
                                  vehiculo.favorito
                                      ? Icons.star
                                      : Icons.star_border,
                                  color: vehiculo.favorito
                                      ? Colors.amber.shade700
                                      : null,
                                ),
                              ),
                              title: Text(
                                vehiculo.nombre,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              isThreeLine: true,
                              subtitle: Text(
                                'Año: ${vehiculo.anio} · '
                                'Precio: ${vehiculo.precio.toStringAsFixed(2)}\n'
                                '${vehiculo.disponible ? "Disponible" : "No disponible"}'
                                ' · ${vehiculo.correo}',
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                              trailing: PopupMenuButton<String>(
                                tooltip: 'Acciones de ${vehiculo.nombre}',
                                onSelected: (accion) {
                                  switch (accion) {
                                    case 'editar':
                                      comenzarEdicion(indiceReal);
                                      break;
                                    case 'disponibilidad':
                                      alternarDisponibilidad(indiceReal);
                                      break;
                                    case 'eliminar':
                                      borrarVehiculo(indiceReal);
                                      break;
                                  }
                                },
                                itemBuilder: (_) => [
                                  const PopupMenuItem(
                                    value: 'editar',
                                    child: Text('Editar'),
                                  ),
                                  PopupMenuItem(
                                    value: 'disponibilidad',
                                    child: Text(
                                      vehiculo.disponible
                                          ? 'Marcar no disponible'
                                          : 'Marcar disponible',
                                    ),
                                  ),
                                  const PopupMenuItem(
                                    value: 'eliminar',
                                    child: Text('Eliminar'),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      );
                    },
                  ),
                  const SizedBox(height: 12),
                  BlocBuilder<VehiculosBloc, VehiculosEstado>(
                    builder: (context, estado) {
                      final cantidad = estado.visibles.length;
                      final totalPaginas = cantidad == 0
                          ? 1
                          : (cantidad + registrosPorPagina - 1) ~/ registrosPorPagina;
                      final paginaSegura =
                          paginaActual > totalPaginas ? totalPaginas : paginaActual;
                      final inicio = cantidad == 0
                          ? 0
                          : (paginaSegura - 1) * registrosPorPagina + 1;
                      final fin = cantidad < paginaSegura * registrosPorPagina
                          ? cantidad
                          : paginaSegura * registrosPorPagina;

                      return Wrap(
                        alignment: WrapAlignment.spaceBetween,
                        crossAxisAlignment: WrapCrossAlignment.center,
                        spacing: 8,
                        runSpacing: 6,
                        children: [
                          Text('$inicio–$fin de $cantidad'),
                          DropdownButton<int>(
                            value: registrosPorPagina,
                            items: const [
                              DropdownMenuItem(value: 5, child: Text('5 por página')),
                              DropdownMenuItem(value: 10, child: Text('10 por página')),
                              DropdownMenuItem(value: 20, child: Text('20 por página')),
                            ],
                            onChanged: (valor) {
                              if (valor == null) return;
                              setState(() {
                                registrosPorPagina = valor;
                                paginaActual = 1;
                              });
                            },
                          ),
                          IconButton(
                            tooltip: 'Página anterior',
                            icon: const Icon(Icons.chevron_left),
                            onPressed: paginaSegura > 1
                                ? () => cambiarPagina(paginaSegura - 1, totalPaginas)
                                : null,
                          ),
                          Text('Página $paginaSegura de $totalPaginas'),
                          IconButton(
                            tooltip: 'Página siguiente',
                            icon: const Icon(Icons.chevron_right),
                            onPressed: paginaSegura < totalPaginas
                                ? () => cambiarPagina(paginaSegura + 1, totalPaginas)
                                : null,
                          ),
                        ],
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
          BlocBuilder<VehiculosBloc, VehiculosEstado>(
            builder: (context, estado) {
              final vehiculos = estado.vehiculos;
              final total = vehiculos.length;
              final disponibles = vehiculos.where((v) => v.disponible).length;
              final favoritos = vehiculos.where((v) => v.favorito).length;
              final promedio = total == 0
                  ? 0.0
                  : vehiculos.fold<double>(0, (suma, v) => suma + v.precio) /
                      total;

              return SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text(
                      'Resumen de la Tienda',
                      style: TextStyle(fontSize: 23, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 6),
                    const Text('Estos indicadores se calculan desde el BLoC.'),
                    const SizedBox(height: 16),
                    Wrap(
                      spacing: 10,
                      runSpacing: 10,
                      children: [
                        TarjetaIndicador(
                          titulo: 'Registrados',
                          valor: '$total',
                          icono: Icons.directions_car,
                          color: Colors.indigo,
                        ),
                        TarjetaIndicador(
                          titulo: 'Disponibles',
                          valor: '$disponibles',
                          icono: Icons.check_circle_outline,
                          color: Colors.teal,
                        ),
                        TarjetaIndicador(
                          titulo: 'Favoritos',
                          valor: '$favoritos',
                          icono: Icons.star,
                          color: Colors.orange,
                        ),
                        TarjetaIndicador(
                          titulo: 'Precio promedio',
                          valor: promedio.toStringAsFixed(0),
                          icono: Icons.payments_outlined,
                          color: Colors.blueGrey,
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Disponibilidad: $disponibles de $total',
                      style: const TextStyle(fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 8),
                    LinearProgressIndicator(
                      minHeight: 10,
                      borderRadius: BorderRadius.circular(8),
                      value: total == 0 ? 0 : disponibles / total,
                    ),
                    const SizedBox(height: 18),
                    FilledButton.icon(
                      icon: const Icon(Icons.star_outline),
                      label: const Text('Explorar favoritos'),
                      onPressed: () {
                        cambiarFiltro(FiltroVehiculos.favoritos);
                        setState(() => indicePestana = 0);
                      },
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'En esta etapa los datos siguen en memoria. P11 '
                      'introducirá el servidor para guardarlos.',
                    ),
                  ],
                ),
              );
            },
          ),
          const Center(
            child: Padding(
              padding: EdgeInsets.all(24),
              child: Text(
                'Para registrar un vehículo, escribe un nombre válido '
                'y pulsa Agregar en la pestaña Tienda.',
                textAlign: TextAlign.center,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
