import 'package:flutter/material.dart';

void main() {
  runApp(const CatalogoListViewApp());
}

class CatalogoListViewApp extends StatelessWidget {
  const CatalogoListViewApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Inventario de vehículos',
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: Colors.indigo,
      ),
      home: const InventarioPage(),
    );
  }
}

class InventarioPage extends StatefulWidget {
  const InventarioPage({super.key});

  @override
  State<InventarioPage> createState() => _InventarioPageState();
}

class _InventarioPageState extends State<InventarioPage> {
  final nombreController = TextEditingController();
  final buscarController = TextEditingController();
  final List<String> vehiculos = ['Renault 9', 'Mazda 3', 'Renault 21'];

  void agregarVehiculo() {
    final nombre = nombreController.text.trim();
    if (nombre.isEmpty) return;

    setState(() {
      vehiculos.add(nombre);
    });
    nombreController.clear();
  }

  void eliminarVehiculo(int indiceReal) {
    setState(() {
      vehiculos.removeAt(indiceReal);
    });
  }

  @override
  void dispose() {
    nombreController.dispose();
    buscarController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final filtro = buscarController.text.trim().toLowerCase();

    // Conservamos el índice REAL para eliminar el objeto correcto tras filtrar.
    final visibles = vehiculos.asMap().entries.where((fila) {
      return fila.value.toLowerCase().contains(filtro);
    }).toList();

    return Scaffold(
      appBar: AppBar(title: const Text('ListView de vehículos')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: nombreController,
              textInputAction: TextInputAction.done,
              onSubmitted: (_) => agregarVehiculo(),
              decoration: const InputDecoration(
                labelText: 'Nombre del vehículo',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 10),
            FilledButton.icon(
              onPressed: agregarVehiculo,
              icon: const Icon(Icons.add),
              label: const Text('Agregar vehículo'),
            ),
            const SizedBox(height: 18),
            TextField(
              controller: buscarController,
              onChanged: (_) => setState(() {}),
              decoration: const InputDecoration(
                labelText: 'Buscar en la lista',
                prefixIcon: Icon(Icons.search),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Registrados: ${vehiculos.length} · Visibles: ${visibles.length}',
            ),
            const SizedBox(height: 10),

            // Expanded otorga una altura limitada a la lista dentro de Column.
            Expanded(
              child: visibles.isEmpty
                  ? const Center(child: Text('No hay vehículos para mostrar'))
                  : ListView.builder(
                      itemCount: visibles.length,
                      itemBuilder: (context, indiceVisible) {
                        final fila = visibles[indiceVisible];
                        return Card(
                          child: ListTile(
                            leading: const CircleAvatar(
                              child: Icon(Icons.directions_car),
                            ),
                            title: Text(fila.value),
                            subtitle: const Text('Disponible'),
                            trailing: IconButton(
                              tooltip: 'Eliminar vehículo',
                              icon: const Icon(Icons.delete_outline),
                              onPressed: () => eliminarVehiculo(fila.key),
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
