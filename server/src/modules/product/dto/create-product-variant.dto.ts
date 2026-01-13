import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsString } from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  name: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @Type(() => Number)
  @IsInt()
  stock: number;

  @Type(() => Number)
  @IsArray()
  images: number[];
}
