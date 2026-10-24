import 'package:flutter/material.dart';

import '../models/usuario.dart';
import '../services/api_service.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key, required this.api, required this.onSesion});

  final ApiService api;
  final ValueChanged<Usuario> onSesion;

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _correo = TextEditingController();
  final _contrasena = TextEditingController();
  bool _cargando = false;
  bool _mostrarClave = false;
  String? _error;

  @override
  void dispose() {
    _correo.dispose();
    _contrasena.dispose();
    super.dispose();
  }

  void _elegir(String correo, String clave) {
    _correo.text = correo;
    _contrasena.text = clave;
    setState(() => _error = null);
  }

  Future<void> _entrar() async {
    if (_formKey.currentState?.validate() != true) return;
    setState(() {
      _cargando = true;
      _error = null;
    });
    try {
      final usuario = await widget.api.iniciarSesion(
        _correo.text.trim(),
        _contrasena.text,
      );
      if (mounted) widget.onSesion(usuario);
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _cargando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colores = Theme.of(context).colorScheme;
    return Scaffold(
      backgroundColor: colores.surfaceContainerLow,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 460),
              child: Card(
                elevation: 0,
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Center(
                          child: CircleAvatar(
                            radius: 34,
                            backgroundColor: colores.primaryContainer,
                            child: Icon(
                              Icons.directions_car_filled,
                              size: 34,
                              color: colores.onPrimaryContainer,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Mi concesionario',
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.headlineMedium,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Iniciar sesión en el laboratorio',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: colores.onSurfaceVariant),
                        ),
                        const SizedBox(height: 28),
                        TextFormField(
                          controller: _correo,
                          keyboardType: TextInputType.emailAddress,
                          textInputAction: TextInputAction.next,
                          decoration: const InputDecoration(
                            labelText: 'Correo electrónico',
                            prefixIcon: Icon(Icons.alternate_email),
                          ),
                          validator: (texto) =>
                              texto == null || !texto.contains('@')
                              ? 'Escribe un correo válido'
                              : null,
                        ),
                        const SizedBox(height: 14),
                        TextFormField(
                          controller: _contrasena,
                          obscureText: !_mostrarClave,
                          onFieldSubmitted: (_) => _entrar(),
                          decoration: InputDecoration(
                            labelText: 'Contraseña',
                            prefixIcon: const Icon(Icons.lock_outline),
                            suffixIcon: IconButton(
                              tooltip: _mostrarClave
                                  ? 'Ocultar contraseña'
                                  : 'Mostrar contraseña',
                              icon: Icon(
                                _mostrarClave
                                    ? Icons.visibility_off
                                    : Icons.visibility,
                              ),
                              onPressed: () => setState(
                                () => _mostrarClave = !_mostrarClave,
                              ),
                            ),
                          ),
                          validator: (texto) => texto == null || texto.isEmpty
                              ? 'Ingresa la contraseña'
                              : null,
                        ),
                        if (_error != null) ...[
                          const SizedBox(height: 12),
                          Text(_error!, style: TextStyle(color: colores.error)),
                        ],
                        const SizedBox(height: 20),
                        FilledButton.icon(
                          onPressed: _cargando ? null : _entrar,
                          icon: _cargando
                              ? const SizedBox(
                                  width: 18,
                                  height: 18,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                  ),
                                )
                              : const Icon(Icons.login),
                          label: const Text('Ingresar'),
                        ),
                        const SizedBox(height: 22),
                        Text(
                          'Cuentas de ejemplo',
                          style: Theme.of(context).textTheme.titleSmall,
                        ),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 8,
                          runSpacing: 4,
                          children: [
                            ActionChip(
                              label: const Text('Administrador'),
                              onPressed: () =>
                                  _elegir('admin@demo.local', 'admin12345'),
                            ),
                            ActionChip(
                              label: const Text('Vendedor'),
                              onPressed: () => _elegir(
                                'vendedor@demo.local',
                                'vendedor12345',
                              ),
                            ),
                            ActionChip(
                              label: const Text('Cliente'),
                              onPressed: () =>
                                  _elegir('cliente@demo.local', 'cliente12345'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'Solo para clases en el computador local. '
                          'No utilices estas claves en producción. '
                          'API: ${widget.api.urlBase}',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
