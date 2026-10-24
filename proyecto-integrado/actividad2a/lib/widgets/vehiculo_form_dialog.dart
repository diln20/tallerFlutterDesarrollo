import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import '../models/vehiculo.dart';
import '../services/api_service.dart';
import '../services/imagen_service.dart';

class DatosFormularioVehiculo {
  const DatosFormularioVehiculo({
    required this.datos,
    this.imagen,
    this.quitarImagen = false,
  });

  final DatosVehiculo datos;
  final ImagenSeleccionada? imagen;
  final bool quitarImagen;
}

class VehiculoFormDialog extends StatefulWidget {
  const VehiculoFormDialog({
    super.key,
    required this.api,
    required this.imagenService,
    required this.onGuardar,
    this.vehiculo,
  });

  final ApiService api;
  final ImagenService imagenService;
  final Vehiculo? vehiculo;
  final Future<void> Function(DatosFormularioVehiculo) onGuardar;

  @override
  State<VehiculoFormDialog> createState() => _VehiculoFormDialogState();
}

class _VehiculoFormDialogState extends State<VehiculoFormDialog> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nombre;
  late final TextEditingController _marca;
  late final TextEditingController _precio;
  late bool _disponible;
  ImagenSeleccionada? _imagen;
  bool _quitarImagen = false;
  bool _procesando = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    final actual = widget.vehiculo;
    _nombre = TextEditingController(text: actual?.nombre ?? '');
    _marca = TextEditingController(text: actual?.marca ?? '');
    _precio = TextEditingController(
      text: actual == null ? '' : actual.precio.toStringAsFixed(0),
    );
    _disponible = actual?.disponible ?? true;
  }

  @override
  void dispose() {
    _nombre.dispose();
    _marca.dispose();
    _precio.dispose();
    super.dispose();
  }

  Future<void> _seleccionar({bool camara = false}) async {
    setState(() {
      _procesando = true;
      _error = null;
    });
    try {
      final seleccion = await widget.imagenService.seleccionar(camara: camara);
      if (mounted && seleccion != null) {
        setState(() {
          _imagen = seleccion;
          _quitarImagen = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _procesando = false);
    }
  }

  Future<void> _guardar() async {
    if (_formKey.currentState?.validate() != true) return;
    setState(() {
      _procesando = true;
      _error = null;
    });
    try {
      await widget.onGuardar(
        DatosFormularioVehiculo(
          datos: DatosVehiculo(
            nombre: _nombre.text.trim(),
            marca: _marca.text.trim(),
            precio: double.parse(_precio.text.trim()),
            disponible: _disponible,
          ),
          imagen: _imagen,
          quitarImagen: _quitarImagen,
        ),
      );
      if (mounted) Navigator.of(context).pop(true);
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _procesando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final esEdicion = widget.vehiculo != null;
    final rutaImagen = widget.vehiculo?.imagenUrl;
    final hayImagenActual = !_quitarImagen && rutaImagen != null;
    final puedeCamara =
        !kIsWeb &&
        {
          TargetPlatform.android,
          TargetPlatform.iOS,
        }.contains(defaultTargetPlatform);
    return AlertDialog(
      title: Text(esEdicion ? 'Editar vehículo' : 'Nuevo vehículo'),
      content: SizedBox(
        width: 520,
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                TextFormField(
                  controller: _nombre,
                  textCapitalization: TextCapitalization.words,
                  decoration: const InputDecoration(
                    labelText: 'Nombre o modelo',
                    prefixIcon: Icon(Icons.directions_car_outlined),
                  ),
                  validator: (v) => v == null || v.trim().length < 2
                      ? 'Mínimo dos caracteres'
                      : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _marca,
                  textCapitalization: TextCapitalization.words,
                  decoration: const InputDecoration(
                    labelText: 'Marca',
                    prefixIcon: Icon(Icons.sell_outlined),
                  ),
                  validator: (v) => v == null || v.trim().length < 2
                      ? 'Escribe la marca'
                      : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _precio,
                  keyboardType: const TextInputType.numberWithOptions(
                    decimal: false,
                  ),
                  decoration: const InputDecoration(
                    labelText: 'Precio en pesos colombianos',
                    prefixIcon: Icon(Icons.attach_money),
                    helperText: 'Solo números, sin puntos de miles',
                  ),
                  validator: (v) {
                    final texto = v?.trim() ?? '';
                    final numero = double.tryParse(texto);
                    if (!RegExp(r'^\d+$').hasMatch(texto) ||
                        numero == null ||
                        numero <= 0 ||
                        numero > 2000000000) {
                      return 'Precio entre 1 y 2.000.000.000';
                    }
                    return null;
                  },
                ),
                SwitchListTile.adaptive(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Disponible para la venta'),
                  value: _disponible,
                  onChanged: _procesando
                      ? null
                      : (v) => setState(() => _disponible = v),
                ),
                const SizedBox(height: 4),
                Text(
                  'Fotografía (JPEG, PNG o WebP, máximo 5 MB)',
                  style: Theme.of(context).textTheme.labelLarge,
                ),
                const SizedBox(height: 10),
                if (_imagen != null)
                  Image.memory(
                    _imagen!.bytes,
                    height: 155,
                    fit: BoxFit.contain,
                    errorBuilder: (_, _, _) =>
                        const Text('Imagen no compatible'),
                  )
                else if (hayImagenActual)
                  Image.network(
                    widget.api.urlImagen(rutaImagen),
                    height: 155,
                    fit: BoxFit.contain,
                    errorBuilder: (_, _, _) =>
                        const Text('No se pudo cargar la foto'),
                  )
                else
                  Container(
                    height: 100,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      border: Border.all(color: Theme.of(context).dividerColor),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(
                      Icons.add_photo_alternate_outlined,
                      size: 44,
                    ),
                  ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: [
                    OutlinedButton.icon(
                      onPressed: _procesando ? null : _seleccionar,
                      icon: const Icon(Icons.image_outlined),
                      label: const Text('Galería / archivos'),
                    ),
                    if (puedeCamara)
                      OutlinedButton.icon(
                        onPressed: _procesando
                            ? null
                            : () => _seleccionar(camara: true),
                        icon: const Icon(Icons.camera_alt_outlined),
                        label: const Text('Cámara'),
                      ),
                    if (_imagen != null || hayImagenActual)
                      TextButton.icon(
                        onPressed: _procesando
                            ? null
                            : () => setState(() {
                                _imagen = null;
                                _quitarImagen = true;
                              }),
                        icon: const Icon(Icons.delete_outline),
                        label: const Text('Quitar foto'),
                      ),
                  ],
                ),
                if (_error != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 10),
                    child: Text(
                      _error!,
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.error,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: _procesando ? null : () => Navigator.pop(context, false),
          child: const Text('Cancelar'),
        ),
        FilledButton.icon(
          onPressed: _procesando ? null : _guardar,
          icon: _procesando
              ? const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Icon(Icons.save_outlined),
          label: Text(esEdicion ? 'Guardar cambios' : 'Registrar'),
        ),
      ],
    );
  }
}
