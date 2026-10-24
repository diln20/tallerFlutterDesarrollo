import 'package:flutter/material.dart';

import '../models/usuario.dart';
import '../repositories/usuario_repository.dart';
import '../services/api_service.dart';

class UsuariosPage extends StatefulWidget {
  const UsuariosPage({super.key, required this.api, required this.actual});

  final ApiService api;
  final Usuario actual;

  @override
  State<UsuariosPage> createState() => _UsuariosPageState();
}

class _UsuariosPageState extends State<UsuariosPage> {
  late final UsuarioRepository _repositorio;
  List<Usuario> _usuarios = [];
  bool _cargando = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _repositorio = UsuarioRepository(widget.api);
    _cargar();
  }

  Future<void> _cargar() async {
    setState(() {
      _cargando = true;
      _error = null;
    });
    try {
      final lista = await _repositorio.listar();
      if (mounted) {
        setState(() {
          _usuarios = lista;
          _cargando = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _cargando = false;
        });
      }
    }
  }

  Future<void> _nuevo() async {
    final resultado = await showDialog<bool>(
      context: context,
      builder: (_) => _CrearUsuarioDialog(repositorio: _repositorio),
    );
    if (resultado == true && mounted) _cargar();
  }

  Future<void> _cambiarRol(Usuario usuario, RolUsuario rol) async {
    if (rol == usuario.rol) return;
    try {
      await _repositorio.cambiarRol(usuario, rol);
      if (mounted) _cargar();
    } catch (e) {
      _avisar(e.toString());
    }
  }

  Future<void> _eliminar(Usuario usuario) async {
    final confirmar = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar usuario'),
        content: Text(
          '¿Eliminar la cuenta ${usuario.correo}? Esta acción no se puede deshacer.',
        ),
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
      await _repositorio.eliminar(usuario);
      if (mounted) _cargar();
    } catch (e) {
      _avisar(e.toString());
    }
  }

  void _avisar(String mensaje) {
    if (mounted) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(mensaje)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _cargar,
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        children: [
          Wrap(
            alignment: WrapAlignment.spaceBetween,
            crossAxisAlignment: WrapCrossAlignment.center,
            runSpacing: 10,
            spacing: 16,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Administración de usuarios',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const Text(
                    'Crear cuentas y asignar administrador, vendedor o cliente.',
                  ),
                ],
              ),
              FilledButton.icon(
                onPressed: _nuevo,
                icon: const Icon(Icons.person_add_alt_1),
                label: const Text('Crear usuario'),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Card(
            child: Padding(
              padding: EdgeInsets.all(14),
              child: Text(
                'Los permisos se comprueban también en el servidor. '
                'Un vendedor no puede eliminar vehículos y un cliente solo consulta '
                'el catálogo y guarda favoritos.',
              ),
            ),
          ),
          if (_cargando) const LinearProgressIndicator(),
          if (_error != null)
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Text(
                      _error!,
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.error,
                      ),
                    ),
                    TextButton(
                      onPressed: _cargar,
                      child: const Text('Reintentar'),
                    ),
                  ],
                ),
              ),
            ),
          if (!_cargando && _error == null && _usuarios.isEmpty)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(25),
                child: Text('Sin cuentas registradas'),
              ),
            ),
          if (!_cargando && _error == null)
            ..._usuarios.map(
              (usuario) => Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Wrap(
                    crossAxisAlignment: WrapCrossAlignment.center,
                    alignment: WrapAlignment.spaceBetween,
                    runSpacing: 10,
                    spacing: 16,
                    children: [
                      SizedBox(
                        width: 250,
                        child: Row(
                          children: [
                            CircleAvatar(
                              child: Text(
                                usuario.nombre.isNotEmpty
                                    ? usuario.nombre.characters.first
                                          .toUpperCase()
                                    : '?',
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    usuario.nombre,
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                    style: Theme.of(
                                      context,
                                    ).textTheme.titleMedium,
                                  ),
                                  Text(
                                    usuario.correo,
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      DropdownButton<RolUsuario>(
                        value: usuario.rol,
                        onChanged: usuario.id == widget.actual.id
                            ? null
                            : (nuevo) {
                                if (nuevo != null) _cambiarRol(usuario, nuevo);
                              },
                        items: RolUsuario.values
                            .map(
                              (rol) => DropdownMenuItem(
                                value: rol,
                                child: Text(rol.etiqueta),
                              ),
                            )
                            .toList(),
                      ),
                      if (usuario.id == widget.actual.id)
                        const Chip(label: Text('Tu cuenta'))
                      else
                        IconButton(
                          tooltip: 'Eliminar usuario',
                          onPressed: () => _eliminar(usuario),
                          icon: const Icon(Icons.delete_outline),
                        ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _CrearUsuarioDialog extends StatefulWidget {
  const _CrearUsuarioDialog({required this.repositorio});

  final UsuarioRepository repositorio;

  @override
  State<_CrearUsuarioDialog> createState() => _CrearUsuarioDialogState();
}

class _CrearUsuarioDialogState extends State<_CrearUsuarioDialog> {
  final _clave = GlobalKey<FormState>();
  final _nombre = TextEditingController();
  final _correo = TextEditingController();
  final _contrasena = TextEditingController();
  RolUsuario _rol = RolUsuario.cliente;
  bool _guardando = false;
  String? _error;

  @override
  void dispose() {
    _nombre.dispose();
    _correo.dispose();
    _contrasena.dispose();
    super.dispose();
  }

  Future<void> _guardar() async {
    if (_clave.currentState?.validate() != true) return;
    setState(() {
      _guardando = true;
      _error = null;
    });
    try {
      await widget.repositorio.crear(
        nombre: _nombre.text.trim(),
        correo: _correo.text.trim(),
        contrasena: _contrasena.text,
        rol: _rol,
      );
      if (mounted) Navigator.pop(context, true);
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _guardando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Nuevo usuario'),
      content: SizedBox(
        width: 460,
        child: SingleChildScrollView(
          child: Form(
            key: _clave,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: _nombre,
                  decoration: const InputDecoration(labelText: 'Nombre'),
                  validator: (v) => (v?.trim().length ?? 0) < 2
                      ? 'Mínimo dos caracteres'
                      : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _correo,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(labelText: 'Correo'),
                  validator: (v) =>
                      v == null || !v.contains('@') || !v.contains('.')
                      ? 'Correo inválido'
                      : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _contrasena,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'Contraseña',
                    helperText: 'Mínimo 8 caracteres',
                  ),
                  validator: (v) =>
                      (v?.length ?? 0) < 8 ? 'Mínimo ocho caracteres' : null,
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<RolUsuario>(
                  initialValue: _rol,
                  decoration: const InputDecoration(
                    labelText: 'Rol de la cuenta',
                  ),
                  items: RolUsuario.values
                      .map(
                        (r) =>
                            DropdownMenuItem(value: r, child: Text(r.etiqueta)),
                      )
                      .toList(),
                  onChanged: (r) {
                    if (r != null) setState(() => _rol = r);
                  },
                ),
                if (_error != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 12),
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
          onPressed: _guardando ? null : () => Navigator.pop(context, false),
          child: const Text('Cancelar'),
        ),
        FilledButton(
          onPressed: _guardando ? null : _guardar,
          child: Text(_guardando ? 'Guardando...' : 'Crear cuenta'),
        ),
      ],
    );
  }
}
