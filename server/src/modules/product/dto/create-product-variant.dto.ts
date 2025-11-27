import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  additionalPrice?: number;

  @IsInt()
  stock: number;

  @IsArray()
  images: number[];
}
