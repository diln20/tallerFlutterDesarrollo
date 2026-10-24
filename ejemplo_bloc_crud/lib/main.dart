import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'bloc/vehiculos_bloc.dart';
import 'bloc/vehiculos_evento.dart';
import 'bloc/vehiculos_estado.dart';
import 'pages/acerca_page.dart';
import 'widgets/boton_tienda.dart';
import 'widgets/campo_nombre_vehiculo.dart';
import 'widgets/titulo_seccion.dart';

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
  final GlobalKey<FormState> formularioKey = GlobalKey<FormState>();
  int indicePestana = 0;

  void guardarVehiculo() {
    if (formularioKey.currentState?.validate() != true) {
      return;
    }
    context.read<VehiculosBloc>().add(
      VehiculoGuardado(vehiculoController.text),
    );
    vehiculoController.clear();
  }

  void comenzarEdicion(int indice) {
    final bloc = context.read<VehiculosBloc>();
    vehiculoController.text = bloc.state.vehiculos[indice].nombre;
    bloc.add(EdicionIniciada(indice));
  }

  void borrarVehiculo(int indice) {
    vehiculoController.clear();
    context.read<VehiculosBloc>().add(VehiculoEliminado(indice));
  }

  void cancelarEdicion() {
    vehiculoController.clear();
    context.read<VehiculosBloc>().add(EdicionCancelada());
  }

  @override
  void dispose() {
    vehiculoController.dispose();
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
      body: IndexedStack(
        index: indicePestana,
        children: [
          SafeArea(
            child: Padding(
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
                      context.read<VehiculosBloc>().add(BusquedaCambiada(texto));
                    },
                  ),
                  const SizedBox(height: 16),
                  const TituloSeccion(texto: 'Agregar un vehículo'),
                  const SizedBox(height: 10),
                  Form(
                    key: formularioKey,
                    child: CampoNombreVehiculo(controller: vehiculoController),
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
                  Expanded(
                    child: BlocBuilder<VehiculosBloc, VehiculosEstado>(
                      builder: (context, estado) {
                        if (estado.visibles.isEmpty) {
                          return Center(
                            child: Text(
                              estado.vehiculos.isEmpty
                                  ? 'Todavía no hay vehículos registrados.'
                                  : 'No hay vehículos que coincidan con la búsqueda.',
                              textAlign: TextAlign.center,
                            ),
                          );
                        }
                        return ListView.builder(
                          itemCount: estado.visibles.length,
                          itemBuilder: (context, indiceVisible) {
                            final vehiculo = estado.visibles[indiceVisible];
                            final indiceReal = estado.vehiculos.indexOf(vehiculo);
                            return Card(
                              child: ListTile(
                                title: Text(vehiculo.nombre),
                                subtitle: Text(
                                  vehiculo.disponible
                                      ? 'Disponible'
                                      : 'No disponible',
                                ),
                                trailing: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    IconButton(
                                      tooltip: 'Editar vehículo',
                                      onPressed: () => comenzarEdicion(indiceReal),
                                      icon: const Icon(Icons.edit),
                                    ),
                                    IconButton(
                                      tooltip: 'Eliminar vehículo',
                                      onPressed: () => borrarVehiculo(indiceReal),
                                      icon: const Icon(Icons.delete_outline),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 8),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: TextButton.icon(
                      icon: const Icon(Icons.info_outline),
                      label: const Text('Acerca de y ayuda'),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const AcercaPage(),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
          BlocBuilder<VehiculosBloc, VehiculosEstado>(
            builder: (context, estado) {
              return Center(
                child: Text('Vehículos registrados: ${estado.vehiculos.length}'),
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
