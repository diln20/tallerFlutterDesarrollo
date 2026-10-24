import 'package:flutter/material.dart';
import 'widgets/titulo_seccion.dart';
import 'widgets/contador_toques.dart';
import 'utils/colores_app.dart';
import 'models/vehiculo.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatefulWidget {
  const MainApp({super.key});

  @override
  State<MainApp> createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  final TextEditingController vehiculoController = TextEditingController();
  final GlobalKey<FormState> formularioKey = GlobalKey<FormState>();
  final List<Vehiculo> vehiculos = [];
  int? indiceEnEdicion;

  void guardarVehiculo() {
    if (formularioKey.currentState?.validate() != true) {
      return;
    }

    final nombre = vehiculoController.text.trim();
    setState(() {
      if (indiceEnEdicion == null) {
        vehiculos.add(Vehiculo(nombre: nombre));
      } else {
        final indice = indiceEnEdicion!;
        final anterior = vehiculos[indice];
        vehiculos[indice] = Vehiculo(
          nombre: nombre,
          disponible: anterior.disponible,
        );
        indiceEnEdicion = null;
      }
    });
    vehiculoController.clear();
  }

  void comenzarEdicion(int indice) {
    vehiculoController.text = vehiculos[indice].nombre;
    setState(() {
      indiceEnEdicion = indice;
    });
  }

  void borrarVehiculo(int indice) {
    setState(() {
      vehiculos.removeAt(indice);
      indiceEnEdicion = null;
      vehiculoController.clear();
    });
  }

  @override
  void dispose() {
    vehiculoController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        backgroundColor: ColoresApp.fondo,
        appBar: AppBar(
          title: const Text('Tienda'),
          backgroundColor: ColoresApp.primario,
          foregroundColor: Colors.white,
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const TituloSeccion(texto: 'Primer widget'),
              const SizedBox(height: 20),
              Icon(Icons.directions_car),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.directions_car),
                  const SizedBox(width: 8),
                  Text('Ingenieria de Sistemas'),
                  Expanded(
                    child: TextField(
                      decoration: const InputDecoration(
                        hintText: 'Buscar marca o modelo',
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              const TituloSeccion(texto: 'Agregar un vehículo'),
              const SizedBox(height: 10),
              Form(
                key: formularioKey,
                child: TextFormField(
                  controller: vehiculoController,
                  decoration: const InputDecoration(
                    hintText: 'Nombre del vehículo',
                    border: OutlineInputBorder(),
                  ),
                  validator: (valor) {
                    if (valor == null || valor.trim().isEmpty) {
                      return 'Escribe un nombre';
                    }
                    if (valor.trim().length < 3) {
                      return 'Mínimo 3 caracteres';
                    }
                    return null;
                  },
                ),
              ),
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: guardarVehiculo,
                style: ElevatedButton.styleFrom(
                  backgroundColor: ColoresApp.accion,
                  foregroundColor: Colors.white,
                ),
                child: Text(
                  indiceEnEdicion == null
                      ? 'Agregar vehículo'
                      : 'Guardar cambios',
                ),
              ),
              const SizedBox(height: 12),
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: vehiculos.length,
                itemBuilder: (context, indice) {
                  final vehiculo = vehiculos[indice];
                  return ListTile(
                    title: Text(vehiculo.nombre),
                    subtitle: Text(
                      vehiculo.disponible ? 'Disponible' : 'No disponible',
                    ),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          tooltip: 'Editar vehículo',
                          onPressed: () => comenzarEdicion(indice),
                          icon: const Icon(Icons.edit),
                        ),
                        IconButton(
                          tooltip: 'Eliminar vehículo',
                          onPressed: () => borrarVehiculo(indice),
                          icon: const Icon(Icons.delete),
                        ),
                      ],
                    ),
                  );
                },
              ),
              const SizedBox(height: 16),
              const ContadorToques(),
            ],
          ),
        ),
      ),
    );
  }
}
