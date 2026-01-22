import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    // Si la respuesta es una promesa el 'data' es el resultado final.
    return next.handle().pipe(
      map((data: unknown) => {
        // Solo envuelve la respuesta si no es null/undefined y si no es ya un objeto de error
        // (los errores son manejados por el Exception Filter de Nest)
        if (data === undefined || data === null) {
          return { data: null };
        }

        //Si es un array, lo envolvemos en un objeto con la clave 'data'.
        if (Array.isArray(data)) {
          return { data: data };
        }

        // Verifica si la respuesta ya tiene una estructura específica (ej: para paginación)
        // Si es un array o un objeto simple, lo envolvemos:
        return data;
      }),
    );
  }
}
