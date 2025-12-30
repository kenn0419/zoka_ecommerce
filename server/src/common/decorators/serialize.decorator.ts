import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { TransformResponseInterceptor } from '../interceptors/transform-response.interceptor';
import { TransformPaginatedResponseInterceptor } from '../interceptors/transform-paginated-response.interceptor';

interface ClassConstructor<T = any> {
  new (...args: any[]): T;
}

export function Serialize<T>(dto: ClassConstructor<T> | null, message: string) {
  return applyDecorators(
    UseInterceptors(new TransformResponseInterceptor(dto, message)),
  );
}

export function SerializePaginated<T>(
  itemDto: ClassConstructor<T>,
  message: string,
) {
  return applyDecorators(
    UseInterceptors(
      new TransformPaginatedResponseInterceptor(itemDto, message),
    ),
  );
}
