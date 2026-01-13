import { IsNotEmpty } from 'class-validator';

export class ResendDto {
  @IsNotEmpty()
  email: string;
}
