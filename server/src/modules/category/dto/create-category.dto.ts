import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @MinLength(5, { message: `Name must be greater than 5 characters` })
  name: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  parentId?: string;
}
