import { Expose } from 'class-transformer';

export class PaginationMetaResponse {
  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  totalItems: number;

  @Expose()
  totalPages: number;
}
