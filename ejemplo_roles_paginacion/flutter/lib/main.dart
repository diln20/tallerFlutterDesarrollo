import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'bloc/vehiculos_bloc.dart';
import 'bloc/vehiculos_evento.dart';
import 'bloc/vehiculos_estado.dart';
import 'models/vehiculo.dart';
import 'pages/acerca_page.dart';
import 'pages/ayuda_page.dart';
import 'repositories/vehiculos_api.dart';
import 'validators/validadores.dart';
import 'widgets/controles_paginacion.dart';
import 'widgets/vista_vehiculos.dart';
import 'widgets/tarjeta_indicador.dart';

enum FiltroVista { todos, favoritos, disponibles }
enum OrdenVista { recientes, nombre, precioMenor, precioMayor }

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => VehiculosBloc(VehiculosApi()),
      child: MaterialApp(
        title: 'Tienda de vehículos',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorSchemeSeed: const Color(0xFF176A86),
          useMaterial3: true,
        ),
        home: const TiendaPage(),
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
  final loginKey = GlobalKey<FormState>();
  final formularioKey = GlobalKey<FormState>();

  final usuarioController = TextEditingController();
  final claveController = TextEditingController();
  final nombreController = TextEditingController();
  final anioController = TextEditingController();
  final precioController = TextEditingController();
  final correoController = TextEditingController();
  final buscarController = TextEditingController();

  int _revisionVista = 0;
  int? _idRestauradoProcesado;
  int? _idFavoritoPendiente;
  int indicePestana = 0;
  FiltroVista filtroVista = FiltroVista.todos;
  OrdenVista ordenVista = OrdenVista.recientes;
  final Set<int> favoritos = {};

  void alternarFavorito(Vehiculo vehiculo) {
    setState(() {
      if (!favoritos.add(vehiculo.id)) favoritos.remove(vehiculo.id);
    });
  }

  void cambiarDisponibilidad(Vehiculo vehiculo) {
    context.read<VehiculosBloc>().add(DisponibilidadAlternada(vehiculo.id));
  }

  void iniciarSesion() {
    if (loginKey.currentState?.validate() != true) return;
    context.read<VehiculosBloc>().add(
      SesionIniciada(usuarioController.text.trim(), claveController.text),
    );
  }

  void guardarVehiculo() {
    if (formularioKey.currentState?.validate() != true) return;
    final anio = int.tryParse(anioController.text.trim());
    final precio = double.tryParse(precioController.text.trim());
    if (anio == null || precio == null) return;
    context.read<VehiculosBloc>().add(VehiculoGuardado(
      nombre: nombreController.text.trim(),
      anio: anio,
      precio: precio,
      correo: correoController.text.trim(),
    ));
  }

  void limpiarFormulario() {
    nombreController.clear();
    anioController.clear();
    precioController.clear();
    correoController.clear();
  }

  void editarVehiculo(Vehiculo vehiculo) {
    nombreController.text = vehiculo.nombre;
    anioController.text = vehiculo.anio.toString();
    precioController.text = vehiculo.precio.toString();
    correoController.text = vehiculo.correo;
    context.read<VehiculosBloc>().add(EdicionIniciada(vehiculo.id));
  }

  Future<void> confirmarEliminar(Vehiculo vehiculo) async {
    final bloc = context.read<VehiculosBloc>();
    if (!bloc.state.puedeEditar || bloc.state.enviando) return;
    final confirmado = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('¿Eliminar vehículo?'),
        content: Text('Se eliminará ${vehiculo.nombre} del servidor.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );
    if (!mounted || confirmado != true) return;
    bloc.add(VehiculoEliminado(vehiculo.id));
    final fin = await bloc.stream.firstWhere((estado) =>
        !estado.enviando &&
        (estado.error != null ||
            !estado.pagina.datos.any((v) => v.id == vehiculo.id)));
    if (!mounted) return;
    if (fin.error != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(fin.error!)),
      );
      return;
    }
    final mensajes = ScaffoldMessenger.of(context);
    mensajes.hideCurrentSnackBar();
    mensajes.showSnackBar(SnackBar(
      content: Text('${vehiculo.nombre} eliminado del servidor'),
      duration: const Duration(seconds: 7),
      action: SnackBarAction(
        label: 'Deshacer',
        onPressed: () {
          if (bloc.isClosed) return;
          _idFavoritoPendiente =
              favoritos.contains(vehiculo.id) ? vehiculo.id : null;
          bloc.add(VehiculoRestaurado(vehiculo));
        },
      ),
    ));
  }

  @override
  void dispose() {
    usuarioController.dispose();
    claveController.dispose();
    nombreController.dispose();
    anioController.dispose();
    precioController.dispose();
    correoController.dispose();
    buscarController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<VehiculosBloc, VehiculosEstado>(
      listener: (context, estado) {
        if (estado.autenticado) claveController.clear();
        if (estado.idRestaurado != null &&
            estado.idRestaurado != _idRestauradoProcesado) {
          _idRestauradoProcesado = estado.idRestaurado;
          if (_idFavoritoPendiente != null) {
            favoritos.remove(_idFavoritoPendiente);
            favoritos.add(estado.idRestaurado!);
            _idFavoritoPendiente = null;
          }
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text(
              'Vehículo restaurado por la API con un nuevo ID')),
          );
        }
        if (estado.error != null && _idFavoritoPendiente != null) {
          favoritos.remove(_idFavoritoPendiente);
          _idFavoritoPendiente = null;
        }
        if (estado.revisionGuardado > _revisionVista) {
          _revisionVista = estado.revisionGuardado;
          limpiarFormulario();
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Vehículo guardado correctamente')),
          );
        }
      },
      builder: (context, estado) {
        if (!estado.autenticado) return _pantallaLogin(estado);
        return _pantallaTienda(estado);
      },
    );
  }

  Widget _pantallaLogin(VehiculosEstado estado) {
    return Scaffold(
      appBar: AppBar(title: const Text('Acceso a la Tienda')),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(22),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 430),
            child: Form(
              key: loginKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Icon(Icons.directions_car, size: 56),
                  const SizedBox(height: 12),
                  const Text(
                    'Iniciar sesión',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 14),
                  const Text(
                    'El rol se consulta a FastAPI. No se elige con un botón.',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 20),
                  TextFormField(
                    controller: usuarioController,
                    decoration: const InputDecoration(
                      labelText: 'Usuario',
                      border: OutlineInputBorder(),
                    ),
                    validator: (texto) => (texto ?? '').trim().isEmpty
                        ? 'Escribe un usuario'
                        : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: claveController,
                    obscureText: true,
                    decoration: const InputDecoration(
                      labelText: 'Contraseña',
                      border: OutlineInputBorder(),
                    ),
                    validator: (texto) => (texto ?? '').isEmpty
                        ? 'Escribe la contraseña'
                        : null,
                  ),
                  const SizedBox(height: 12),
                  if (estado.error != null)
                    Text(
                      estado.error!,
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.error,
                      ),
                    ),
                  const SizedBox(height: 10),
                  FilledButton.icon(
                    onPressed: estado.cargando ? null : iniciarSesion,
                    icon: const Icon(Icons.login),
                    label: Text(estado.cargando ? 'Verificando...' : 'Entrar'),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Solo laboratorio local: admin/admin123 o lector/lector123. '
                    'Nunca uses estas contraseñas en una aplicación pública.',
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _pantallaTienda(VehiculosEstado estado) {
    final rol = estado.sesion!.rol;
    // Solo filtramos/ordenamos la página entregada por FastAPI.
    final visibles = estado.pagina.datos.where((v) {
      if (filtroVista == FiltroVista.favoritos) return favoritos.contains(v.id);
      if (filtroVista == FiltroVista.disponibles) return v.disponible;
      return true;
    }).toList();
    switch (ordenVista) {
      case OrdenVista.recientes:
        break;
      case OrdenVista.nombre:
        visibles.sort((a,b) => a.nombre.toLowerCase().compareTo(b.nombre.toLowerCase()));
        break;
      case OrdenVista.precioMenor:
        visibles.sort((a,b) => a.precio.compareTo(b.precio));
        break;
      case OrdenVista.precioMayor:
        visibles.sort((a,b) => b.precio.compareTo(a.precio));
        break;
    }
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tienda de vehículos'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Center(
              child: Chip(
                avatar: const Icon(Icons.verified_user, size: 18),
                label: Text(rol),
              ),
            ),
          ),
        ],
      ),
      drawer: Drawer(
        child: SafeArea(
          child: ListView(
            children: [
              DrawerHeader(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.directions_car, size: 40),
                    const Text('Tienda de vehículos'),
                    Text('Rol: ' + rol),
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
                  navegador.push(MaterialPageRoute(
                    builder: (_) => const AcercaPage(),
                  ));
                },
              ),
              ListTile(
                leading: const Icon(Icons.help_outline),
                title: const Text('Ayuda'),
                onTap: () {
                  final navegador = Navigator.of(context);
                  navegador.pop();
                  navegador.push(MaterialPageRoute(
                    builder: (_) => const AyudaPage(),
                  ));
                },
              ),
              const Divider(),
              ListTile(
                leading: const Icon(Icons.logout),
                title: const Text('Cerrar sesión'),
                enabled: !estado.cargando && !estado.enviando,
                onTap: () {
                  Navigator.pop(context);
                  limpiarFormulario();
                  buscarController.clear();
                  _revisionVista = 0;
                  _idRestauradoProcesado = null;
                  _idFavoritoPendiente = null;
                  favoritos.clear();
                  filtroVista = FiltroVista.todos;
                  ordenVista = OrdenVista.recientes;
                  indicePestana = 0;
                  context.read<VehiculosBloc>().add(SesionCerrada());
                },
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: indicePestana,
        onDestinationSelected: (indice) {
          setState(() => indicePestana = indice);
        },
        destinations: const [
          NavigationDestination(icon: Icon(Icons.storefront), label: 'Tienda'),
          NavigationDestination(icon: Icon(Icons.bar_chart), label: 'Resumen'),
          NavigationDestination(icon: Icon(Icons.info_outline), label: 'Consejos'),
        ],
      ),
      body: IndexedStack(
        index: indicePestana,
        children: [
          SafeArea(
            child: ListView(
              padding: const EdgeInsets.all(16),
          children: [
            Text(
              'Bienvenido, ' + estado.sesion!.nombre,
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(estado.puedeEditar
                ? 'Administrador: puede crear, editar y eliminar.'
                : 'Lector: consulta los vehículos sin modificarlos.'),
            if (estado.puedeEditar) ...[
              const SizedBox(height: 16),
              _formularioVehiculo(estado),
            ],
            const SizedBox(height: 22),
            Text('Inventario', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: buscarController,
                    textInputAction: TextInputAction.search,
                    onSubmitted: (texto) => context
                        .read<VehiculosBloc>()
                        .add(BusquedaSolicitada(texto)),
                    decoration: const InputDecoration(
                      labelText: 'Buscar nombre',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.search),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  tooltip: 'Buscar vehículos',
                  onPressed: estado.cargando
                      ? null
                      : () => context.read<VehiculosBloc>().add(
                          BusquedaSolicitada(buscarController.text),
                        ),
                  icon: const Icon(Icons.search),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                ChoiceChip(
                  label: const Text('Todos'),
                  selected: filtroVista == FiltroVista.todos,
                  onSelected: (_) => setState(() => filtroVista = FiltroVista.todos),
                ),
                ChoiceChip(
                  label: const Text('Disponibles'),
                  selected: filtroVista == FiltroVista.disponibles,
                  onSelected: (_) => setState(() => filtroVista = FiltroVista.disponibles),
                ),
                ChoiceChip(
                  label: const Text('Favoritos'),
                  selected: filtroVista == FiltroVista.favoritos,
                  onSelected: (_) => setState(() => filtroVista = FiltroVista.favoritos),
                ),
              ],
            ),
            const SizedBox(height: 8),
            DropdownButtonFormField<OrdenVista>(
              initialValue: ordenVista,
              isExpanded: true,
              decoration: const InputDecoration(
                labelText: 'Orden visual de esta página',
                border: OutlineInputBorder(),
              ),
              items: const [
                DropdownMenuItem(value: OrdenVista.recientes, child: Text('Orden del servidor')),
                DropdownMenuItem(value: OrdenVista.nombre, child: Text('Nombre A–Z')),
                DropdownMenuItem(value: OrdenVista.precioMenor, child: Text('Precio menor')),
                DropdownMenuItem(value: OrdenVista.precioMayor, child: Text('Precio mayor')),
              ],
              onChanged: (valor) {
                if (valor != null) setState(() => ordenVista = valor);
              },
            ),
            const SizedBox(height: 9),
            const Text(
              'Los chips y el orden afectan solo la página recibida. '
              'Para buscar en todo el inventario usa el campo Buscar nombre.',
            ),
            const SizedBox(height: 12),
            if (estado.cargando) ...[
              const LinearProgressIndicator(),
              const SizedBox(height: 8),
              const Text('Consultando vehículos...'),
            ],
            if (estado.error != null) ...[
              Card(
                color: Theme.of(context).colorScheme.errorContainer,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    children: [
                      Text(estado.error!),
                      TextButton.icon(
                        onPressed: () => context.read<VehiculosBloc>().add(
                              BusquedaSolicitada(buscarController.text),
                            ),
                        icon: const Icon(Icons.refresh),
                        label: const Text('Reintentar'),
                      ),
                    ],
                  ),
                ),
              ),
            ],
            VistaVehiculos(
              vehiculos: visibles,
              esFavorito: (auto) => favoritos.contains(auto.id),
              alFavorito: alternarFavorito,
              alCambiarDisponibilidad: cambiarDisponibilidad,
              puedeEditar: estado.puedeEditar && !estado.enviando,
              alEditar: editarVehiculo,
              alEliminar: confirmarEliminar,
            ),
            const SizedBox(height: 14),
            ControlesPaginacion(
              pagina: estado.pagina,
              cargando: estado.cargando || estado.enviando,
              alCambiarPagina: (numero) =>
                  context.read<VehiculosBloc>().add(PaginaSolicitada(numero)),
              alCambiarTamano: (tamano) => context
                  .read<VehiculosBloc>()
                  .add(TamanoPaginaCambiado(tamano)),
            ),
            const SizedBox(height: 16),
            const Text(
              'La tabla muestra solo la página obtenida de FastAPI. '
              'Los IDs no cambian al buscar ni pasar de página.',
            ),
          ],
        ),
      ),
      _resumenPagina(estado),
      const Center(
        child: Padding(
          padding: EdgeInsets.all(22),
          child: Text(
            'Usa Tienda para buscar, filtrar, crear y actualizar vehículos. '
            'El rol lector puede consultar y guardar favoritos de esta sesión, '
            'pero no puede modificar datos del servidor.',
            textAlign: TextAlign.center,
          ),
        ),
      ),
    ],
  ),
);
  }

  Widget _resumenPagina(VehiculosEstado estado) {
    final lista = estado.pagina.datos;
    final disponibles=lista.where((v) => v.disponible).length;
    final favoritosPagina=lista.where((v)=>favoritos.contains(v.id)).length;
    final promedio=lista.isEmpty ? 0.0 :
        lista.fold<double>(0,(ac,v)=>ac+v.precio)/lista.length;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text('Resumen del inventario',style:
              TextStyle(fontSize:22,fontWeight:FontWeight.bold)),
          const SizedBox(height:8),
          const Text('El total proviene de FastAPI; las otras estadísticas describen '
              'la página descargada y los favoritos de esta sesión.'),
          const SizedBox(height:16),
          Wrap(spacing:10,runSpacing:10,children:[
            TarjetaIndicador(titulo:'Total en API',valor:'${estado.pagina.total}',
                icono:Icons.storage,color:Colors.indigo),
            TarjetaIndicador(titulo:'Disponibles en página',valor:'$disponibles',
                icono:Icons.check_circle_outline,color:Colors.teal),
            TarjetaIndicador(titulo:'Favoritos de esta página',valor:'$favoritosPagina',
                icono:Icons.star,color:Colors.orange),
            TarjetaIndicador(titulo:'Promedio de esta página',valor:promedio.toStringAsFixed(0),
                icono:Icons.payments_outlined,color:Colors.blueGrey),
          ]),
          const SizedBox(height:18),
          Text('Disponibilidad en página: $disponibles de ${lista.length}'),
          const SizedBox(height:8),
          LinearProgressIndicator(
            value: lista.isEmpty ? 0 : disponibles/lista.length,
            minHeight:10,
            borderRadius: BorderRadius.circular(8),
          ),
          const SizedBox(height:18),
          FilledButton.icon(
            onPressed: (){
              setState((){
                filtroVista=FiltroVista.favoritos;
                indicePestana=0;
              });
            },
            icon: const Icon(Icons.star),
            label: const Text('Explorar favoritos de esta página'),
          ),
        ],
      ),
    );
  }

  Widget _formularioVehiculo(VehiculosEstado estado) {
    return Form(
      key: formularioKey,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            estado.idEnEdicion == null
                ? 'Agregar vehículo'
                : 'Editar vehículo',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 10),
          TextFormField(
            controller: nombreController,
            decoration: const InputDecoration(
              labelText: 'Nombre',
              border: OutlineInputBorder(),
            ),
            validator: Validadores.nombre,
          ),
          const SizedBox(height: 10),
          TextFormField(
            controller: anioController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              labelText: 'Año',
              border: OutlineInputBorder(),
            ),
            validator: Validadores.anio,
          ),
          const SizedBox(height: 10),
          TextFormField(
            controller: precioController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(
              labelText: 'Precio',
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
              border: OutlineInputBorder(),
            ),
            validator: Validadores.correo,
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 10,
            children: [
              FilledButton.icon(
                onPressed: estado.enviando ? null : guardarVehiculo,
                icon: const Icon(Icons.save_outlined),
                label: Text(estado.enviando
                    ? 'Guardando...'
                    : estado.idEnEdicion == null
                        ? 'Agregar vehículo'
                        : 'Guardar cambios'),
              ),
              if (estado.idEnEdicion != null)
                OutlinedButton(
                  onPressed: estado.enviando
                      ? null
                      : () {
                          limpiarFormulario();
                          context.read<VehiculosBloc>().add(EdicionCancelada());
                        },
                  child: const Text('Cancelar edición'),
                ),
            ],
          ),
        ],
      ),
    );
  }
}
