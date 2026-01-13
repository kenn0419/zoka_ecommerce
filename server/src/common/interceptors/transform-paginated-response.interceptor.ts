import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';
import convertDecimalDeep from 'src/common/utils/convert-decimal-deep.util';

@Injectable()
export class TransformPaginatedResponseInterceptor<T>
  implements NestInterceptor
{
  constructor(
    private readonly itemDto: Type<T>,
    private readonly message: string,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode ?? 200;

        if (!data?.items || !Array.isArray(data.items)) {
          return {
            statusCode,
            message: this.message,
            data,
          };
        }

        const decimalConvertedData = convertDecimalDeep(data);

        return {
          statusCode,
          message: this.message,
          data: {
            ...(decimalConvertedData.meta ?? {}),
            items: plainToInstance(this.itemDto, decimalConvertedData.items, {
              excludeExtraneousValues: true,
            }),
          },
        };
      }),
    );
  }
}
