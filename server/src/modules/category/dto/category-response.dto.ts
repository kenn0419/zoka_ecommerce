import { Expose, Type } from 'class-transformer';

export class CategoryResponseDto {
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
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => CategoryResponseDto)
  children: CategoryResponseDto[];
}
