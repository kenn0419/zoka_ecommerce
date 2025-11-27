import { Expose } from 'class-transformer';

export class CategoryResponse {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  description: string;

  @Expose()
  parentId: string;

  @Expose()
  status: string;

  @Expose()
  thumbnailUrl: string;

  @Expose()
  children: CategoryResponse;
}
