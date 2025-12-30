import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddCartDto {
  @IsString()
  @IsNotEmpty({ message: 'variant ID is required' })
  variantId: string;

  @IsNumber()
  @IsNotEmpty({ message: 'quantity is required' })
  quantity: number;
}
