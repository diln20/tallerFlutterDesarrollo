import 'package:flutter/material.dart';

class TarjetaIndicador extends StatelessWidget {
  const TarjetaIndicador({
    super.key,
    required this.titulo,
    required this.valor,
    required this.icono,
    required this.color,
  });

  final String titulo;
  final String valor;
  final IconData icono;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 170,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icono, color: color, size: 28),
              const SizedBox(height: 12),
              Text(titulo, maxLines: 2, overflow: TextOverflow.ellipsis),
              const SizedBox(height: 6),
              Text(
                valor,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 23,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
