import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtSessionGuard } from '../../common/guards/jwt-session.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import type { Request, Response } from 'express';
import { sendTokenToCookie } from 'src/common/utils/send-token-to-cookie.util';
import ms from 'ms';
import { ResendDto } from './dto/resend.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @Serialize(null, 'Register successfully. Please verify email to access!')
  signup(@Body() data: SignupDto) {
    return this.authService.signup(data);
  }

  @Post('/verify-email')
  @HttpCode(HttpStatus.OK)
  @Serialize(UserResponseDto, 'Verify account successfully!')
  verifyAccount(@Body() data: VerifyEmailDto) {
    return this.authService.verifyAccount(data);
  }

  @Post('/resend-email')
  @HttpCode(HttpStatus.OK)
  @Serialize(null, 'Resend verify email successfully!')
  resendVerifyEmail(@Body() data: ResendDto) {
    return this.authService.resendVerificationEmail(data.email);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @Serialize(AuthResponseDto, 'Signin successfully!')
  async signin(
    @Body() data: SigninDto,
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const device = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip;

    const result = await this.authService.signin(
      data.email,
      data.password,
      device,
      ip,
    );
    const accessTokenExpire = (process.env.JWT_ACCESS_EXPIRE_IN ??
      '30d') as ms.StringValue;
    sendTokenToCookie(
      res,
      'accessToken',
      result.accessToken,
      '/',
      accessTokenExpire,
      true,
    );

    const refreshTokenExpire = process.env
      .JWT_REFRESH_EXPIRE_IN as ms.StringValue;
    sendTokenToCookie(
      res,
      'refreshToken',
      result.refreshToken,
      '/api/v1/auth/refresh',
      refreshTokenExpire,
      true,
    );
    return result;
  }

  @Get('/me')
  @UseGuards(JwtSessionGuard)
  @HttpCode(HttpStatus.OK)
  @Serialize(UserResponseDto, 'Get current user successfully!')
  getCurrent(@Req() req) {
    return this.authService.getCurrent(req.user.userId);
  }

  @Post('/logout')
  @UseGuards(JwtSessionGuard)
  @HttpCode(HttpStatus.OK)
  @Serialize(null, 'Logout successfully!')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user.sessionId);
    res.clearCookie('accessToken', {
      secure: true,
      sameSite: 'strict',
    });

    res.clearCookie('refreshToken', {
      secure: true,
      sameSite: 'strict',
      path: '/api/v1/auth/refresh',
    });

    return null;
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @Serialize(AuthResponseDto, 'Refresh token successfully!')
  async refresh(
    @Req() req: Request,
    @Body() data: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refreshToken || data.token;

    const result = await this.authService.refresh(refreshToken);

    const accessTokenExpire = (process.env.JWT_ACCESS_EXPIRE_IN ??
      '30d') as ms.StringValue;
    sendTokenToCookie(
      res,
      'accessToken',
      result.accessToken,
      '/',
      accessTokenExpire,
      true,
    );

    const refreshTokenExpire = process.env
      .JWT_REFRESH_EXPIRE_IN as ms.StringValue;
    sendTokenToCookie(
      res,
      'refreshToken',
      result.refreshToken,
      '/api/v1/auth/refresh',
      refreshTokenExpire,
      true,
    );

    return result;
  }

  @Post('logout-all')
  @UseGuards(JwtSessionGuard)
  @HttpCode(HttpStatus.OK)
  @Serialize(null, 'Logout all device successfully!')
  async logoutAll(@Req() req, @Res() res: Response) {
    await this.authService.logoutAll(req.user.userId);

    res.clearCookie('accessToken', {
      secure: true,
      sameSite: 'strict',
    });

    res.clearCookie('refreshToken', {
      secure: true,
      sameSite: 'strict',
      path: '/api/v1/auth/refresh',
    });

    return res.json(null);
  }
}
