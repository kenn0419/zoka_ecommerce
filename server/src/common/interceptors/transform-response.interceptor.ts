import * as common from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@common.Injectable()
export class TransformResponseInterceptor<T> implements common.NestInterceptor {
  constructor(
    private readonly dto: common.Type<T> | null,
    private readonly message: string,
  ) {}

  intercept(
    context: common.ExecutionContext,
    next: common.CallHandler<any>,
  ): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode ?? 200;

        // ✅ Nếu không có data
        if (data == null) {
          return {
            statusCode,
            message: this.message,
            data: null,
          };
        }

        if (!this.dto) {
          return {
            statusCode,
            message: this.message,
            data,
          };
        }

        let transformedData: any;
        if (Array.isArray(data?.items)) {
          const transformItems = plainToInstance(this.dto, data.items, {
            excludeExtraneousValues: true,
          });
          transformedData = { ...data, items: transformItems };
        } else {
          transformedData = plainToInstance(this.dto, data, {
            excludeExtraneousValues: true,
          });
        }

        return {
          statusCode,
          message: this.message,
          data: transformedData,
        };
      }),
    );
  }
}
