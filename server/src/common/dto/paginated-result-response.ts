import { Expose, Type } from 'class-transformer';
import { PaginationMetaResponse } from './pagination-meta-response';

export class PaginatedResultResponse<T> {
  @Expose()
  @Type(() => PaginationMetaResponse)
  meta: PaginationMetaResponse;

  @Expose()
  items: T[];
}
