import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { TransformResponseInterceptor } from '../interceptors/transform-response.interceptor';

interface ClassConstructor<T = any> {
  new (...args: any[]): T;
}

export function Serialize<T>(dto: ClassConstructor<T> | null, message: string) {
  return applyDecorators(
    UseInterceptors(new TransformResponseInterceptor(dto, message)),
  );
}
