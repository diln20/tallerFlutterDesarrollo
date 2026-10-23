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
import 'repositories/vehiculos_api.dart';
import 'validators/validadores.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider<VehiculosBloc>(
      create: (context) => VehiculosBloc(VehiculosApi())
        ..add(VehiculosCargados()),
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

  void comenzarEdicion(int id) {
    final bloc = context.read<VehiculosBloc>();
    final vehiculo = bloc.state.vehiculos.firstWhere((v) => v.id == id);
    vehiculoController.text = vehiculo.nombre;
    anioController.text = vehiculo.anio.toString();
    precioController.text = vehiculo.precio.toString();
    correoController.text = vehiculo.correo;
    bloc.add(EdicionIniciada(id));
  }

  void borrarVehiculo(int id) {
    limpiarCampos();
    context.read<VehiculosBloc>().add(VehiculoEliminado(id));
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
      body: SafeArea(
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
                          texto: estado.enviando
                              ? 'Guardando...'
                              : (estado.idEnEdicion == null
                                  ? 'Agregar vehículo'
                                  : 'Guardar cambios'),
                          alPresionar: guardarVehiculo,
                        ),
                      ),
                      if (estado.idEnEdicion != null) ...[
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
              BlocBuilder<VehiculosBloc, VehiculosEstado>(
                builder: (context, estado) {
                  if (estado.error == null) return const SizedBox.shrink();
                  return Card(
                    color: Colors.amber.shade50,
                    child: Padding(
                      padding: const EdgeInsets.all(10),
                      child: Row(
                        children: [
                          Expanded(child: Text(estado.error!)),
                          IconButton(
                            tooltip: 'Reintentar',
                            icon: const Icon(Icons.refresh),
                            onPressed: () {
                              context.read<VehiculosBloc>().add(
                                VehiculosCargados(),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 8),
              Expanded(
                child: BlocBuilder<VehiculosBloc, VehiculosEstado>(
                  builder: (context, estado) {
                    if (estado.cargando) {
                      return const Center(child: CircularProgressIndicator());
                    }
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
                        final id = vehiculo.id;
                        return Card(
                          child: ListTile(
                            title: Text(vehiculo.nombre),
                            isThreeLine: true,
                            subtitle: Text(
                              'Año: ' + vehiculo.anio.toString() +
                              ' · Precio: ' + vehiculo.precio.toStringAsFixed(2) +
                              '\nCorreo: ' + vehiculo.correo,
                            ),
                            trailing: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                IconButton(
                                  tooltip: 'Editar vehículo',
                                  onPressed: () => comenzarEdicion(id),
                                  icon: const Icon(Icons.edit),
                                ),
                                IconButton(
                                  tooltip: 'Eliminar vehículo',
                                  onPressed: () => borrarVehiculo(id),
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
            ],
          ),
        ),
      ),
    );
  }
}
