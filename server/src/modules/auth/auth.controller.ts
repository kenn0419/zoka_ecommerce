import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { AuthResponseDto } from '../user/dto/auth-response.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtSessionGuard } from '../../common/guards/jwt-session.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @Serialize(null, 'Register successfully. Please verify email to access!')
  signup(@Body() data: SignupDto) {
    this.authService.signup(data);
  }

  @Post('/verify-email')
  @Serialize(UserResponseDto, 'Verify account successfully!')
  verifyAccount(@Body() data: VerifyEmailDto) {
    return this.authService.verifyAccount(data);
  }

  @Post('/signin')
  @Serialize(AuthResponseDto, 'Signin successfully!')
  signin(@Body() data: SigninDto, @Req() req) {
    const device = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip;
    return this.authService.signin(data.email, data.password, device, ip);
  }

  @Post('/logout')
  @UseGuards(JwtSessionGuard)
  @Serialize(null, 'Logout successfully!')
  logout(@Req() req) {
    return this.authService.logout(req.user.sessionId);
  }

  @Post('/refresh')
  @Serialize(AuthResponseDto, 'Refresh token successfully!')
  refresh(@Body() data: RefreshTokenDto) {
    return this.authService.refresh(data.token);
  }

  @Post('logout-all')
  @UseGuards(JwtSessionGuard)
  @Serialize(null, 'Logout all device successfully!')
  logoutAll(@Req() req) {
    return this.authService.logoutAll(req.user.userId);
  }
}
