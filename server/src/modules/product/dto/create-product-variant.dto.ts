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

  @IsNumber()
  price: number;

  @IsInt()
  stock: number;

  @IsArray()
  images: number[];
}
