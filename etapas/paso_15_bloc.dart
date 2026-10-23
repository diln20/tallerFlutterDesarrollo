import 'package:flutter_bloc/flutter_bloc.dart';
import 'busqueda_evento.dart';
import 'busqueda_estado.dart';

class BusquedaBloc extends Bloc<BusquedaEvento, BusquedaEstado> {
  static const List<String> vehiculos = [
    'Renault 9',
    'Renault 21',
    'Mazda 3',
    'Chevrolet Spark',
  ];

  BusquedaBloc()
      : super(
          const BusquedaEstado(
            texto: '',
            resultados: vehiculos,
          ),
        ) {
    on<BusquedaTextoCambiado>((evento, emit) {
      final textoNormalizado = evento.texto.trim().toLowerCase();

      final coincidencias = vehiculos.where((vehiculo) {
        return vehiculo.toLowerCase().contains(textoNormalizado);
      }).toList();

      emit(
        BusquedaEstado(
          texto: evento.texto,
          resultados: coincidencias,
        ),
      );
    });
  }
}
