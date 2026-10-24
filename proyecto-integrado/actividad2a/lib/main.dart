import 'package:flutter/material.dart';

import 'models/usuario.dart';
import 'pages/catalogo_page.dart';
import 'pages/login_page.dart';
import 'pages/perfil_page.dart';
import 'pages/usuarios_page.dart';
import 'services/api_service.dart';

void main() => runApp(const MainApp());

class MainApp extends StatefulWidget {
  const MainApp({super.key});

  @override
  State<MainApp> createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  final ApiService _api = ApiService();
  Usuario? _usuario;

  @override
  void dispose() {
    _api.dispose();
    super.dispose();
  }

  void _cerrarSesion() {
    _api.cerrarSesion();
    setState(() => _usuario = null);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mi concesionario',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2556B7)),
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF2F5FA),
        cardTheme: const CardThemeData(
          color: Colors.white,
          margin: EdgeInsets.zero,
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 12,
            vertical: 14,
          ),
        ),
      ),
      home: _usuario == null
          ? LoginPage(
              api: _api,
              onSesion: (usuario) => setState(() => _usuario = usuario),
            )
          : InicioPage(
              key: ValueKey(_usuario!.id),
              api: _api,
              usuario: _usuario!,
              onSalir: _cerrarSesion,
            ),
    );
  }
}

class InicioPage extends StatefulWidget {
  const InicioPage({
    super.key,
    required this.api,
    required this.usuario,
    required this.onSalir,
  });

  final ApiService api;
  final Usuario usuario;
  final VoidCallback onSalir;

  @override
  State<InicioPage> createState() => _InicioPageState();
}

class _InicioPageState extends State<InicioPage> {
  int _indice = 0;
  late final List<Widget> _paginas;

  @override
  void initState() {
    super.initState();
    _paginas = [
      CatalogoPage(api: widget.api, usuario: widget.usuario),
      if (widget.usuario.esAdministrador)
        UsuariosPage(api: widget.api, actual: widget.usuario),
      PerfilPage(usuario: widget.usuario),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final destinos = [
      const NavigationDestination(
        icon: Icon(Icons.directions_car_outlined),
        selectedIcon: Icon(Icons.directions_car),
        label: 'Catálogo',
      ),
      if (widget.usuario.esAdministrador)
        const NavigationDestination(
          icon: Icon(Icons.manage_accounts_outlined),
          selectedIcon: Icon(Icons.manage_accounts),
          label: 'Usuarios',
        ),
      const NavigationDestination(
        icon: Icon(Icons.person_outline),
        selectedIcon: Icon(Icons.person),
        label: 'Mi perfil',
      ),
    ];
    return LayoutBuilder(
      builder: (context, constraints) {
        final pantallaAmplia = constraints.maxWidth >= 820;
        return Scaffold(
          appBar: AppBar(
            backgroundColor: Theme.of(context).colorScheme.primary,
            foregroundColor: Theme.of(context).colorScheme.onPrimary,
            title: const Text('Mi concesionario'),
            actions: [
              if (pantallaAmplia)
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: Center(child: Text(widget.usuario.rol.etiqueta)),
                ),
              IconButton(
                tooltip: 'Cerrar sesión',
                onPressed: widget.onSalir,
                icon: const Icon(Icons.logout),
              ),
            ],
          ),
          body: pantallaAmplia
              ? Row(
                  children: [
                    NavigationRail(
                      selectedIndex: _indice,
                      onDestinationSelected: (i) => setState(() => _indice = i),
                      labelType: NavigationRailLabelType.all,
                      destinations: [
                        const NavigationRailDestination(
                          icon: Icon(Icons.directions_car_outlined),
                          selectedIcon: Icon(Icons.directions_car),
                          label: Text('Catálogo'),
                        ),
                        if (widget.usuario.esAdministrador)
                          const NavigationRailDestination(
                            icon: Icon(Icons.manage_accounts_outlined),
                            selectedIcon: Icon(Icons.manage_accounts),
                            label: Text('Usuarios'),
                          ),
                        const NavigationRailDestination(
                          icon: Icon(Icons.person_outline),
                          selectedIcon: Icon(Icons.person),
                          label: Text('Mi perfil'),
                        ),
                      ],
                    ),
                    const VerticalDivider(width: 1),
                    Expanded(
                      child: IndexedStack(index: _indice, children: _paginas),
                    ),
                  ],
                )
              : IndexedStack(index: _indice, children: _paginas),
          bottomNavigationBar: pantallaAmplia
              ? null
              : NavigationBar(
                  selectedIndex: _indice,
                  onDestinationSelected: (i) => setState(() => _indice = i),
                  destinations: destinos,
                ),
        );
      },
    );
  }
}
