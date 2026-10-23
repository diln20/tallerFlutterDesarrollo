import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'bloc/busqueda_bloc.dart';
import 'bloc/busqueda_evento.dart';
import 'bloc/busqueda_estado.dart';

void main() {
  runApp(
    BlocProvider(
      create: (_) => BusquedaBloc(),
      child: const MainApp(),
    ),
  );
}

class MainApp extends StatefulWidget {
  const MainApp({super.key});

  @override
  State<MainApp> createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Tienda')),
        body: Padding(
          padding: const EdgeInsets.all(16),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text('Primer widget'),
                const SizedBox(height: 20),
                const Icon(Icons.directions_car),
                const SizedBox(height: 8),
                const Row(
                  children: [
                    Icon(Icons.directions_car),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Ingenieria de Sistemas',
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                TextField(
                  onChanged: (valor) {
                    context.read<BusquedaBloc>().add(
                      BusquedaTextoCambiado(valor),
                    );
                  },
                  decoration: const InputDecoration(
                    hintText: 'Buscar marca o modelo',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                BlocBuilder<BusquedaBloc, BusquedaEstado>(
                  builder: (context, estado) {
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text('Estás buscando: ${estado.texto}'),
                        const SizedBox(height: 16),
                        const Text('Vehículos encontrados:'),
                        if (estado.resultados.isEmpty)
                          const Text('No se encontraron vehículos.'),
                        for (final vehiculo in estado.resultados)
                          ListTile(
                            leading: const Icon(Icons.directions_car),
                            title: Text(vehiculo),
                          ),
                      ],
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
