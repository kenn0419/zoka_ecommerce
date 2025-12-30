import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';
import convertDecimalDeep from 'src/common/utils/convert-decimal-deep.util';

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor {
  constructor(
    private readonly dto: Type<T> | null,
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

        if (data == null) {
          return {
            statusCode,
            message: this.message,
            data: null,
          };
        }

        const decimalConvertedData = convertDecimalDeep(data);

        if (!this.dto) {
          return {
            statusCode,
            message: this.message,
            data: decimalConvertedData,
          };
        }

        const transformedData = plainToInstance(
          this.dto,
          decimalConvertedData,
          {
            excludeExtraneousValues: true,
          },
        );

        return {
          statusCode,
          message: this.message,
          data: transformedData,
        };
      }),
    );
  }
}
