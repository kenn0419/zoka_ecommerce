import { IsNotEmpty, MinLength } from 'class-validator';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class SignupDto extends CreateUserDto {
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Confirm password must be greater than or equals to 8 characters',
  })
  confirmPassword: string;
}
