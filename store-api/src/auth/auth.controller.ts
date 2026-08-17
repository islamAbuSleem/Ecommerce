import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import {
  AUTH_COOKIE_NAME,
  resolveAuthCookieMaxAge,
} from '../common/config/auth-cookie.config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('/register')
  @ApiOperation({ summary: 'Register a new user and set auth cookie' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register(dto);
    const token = await this.authService.signToken(user);
    this.setTokenCookie(res, token);
    return user;
  }

  @Public()
  @Post('/login')
  @ApiOperation({ summary: 'Login and set auth cookie' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(dto);
    const token = await this.authService.signToken(user);
    this.setTokenCookie(res, token);
    return user;
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get the currently authenticated user' })
  @ApiCookieAuth()
  async me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.me(user.userId);
  }

  @Public()
  @Post('/logout')
  @ApiOperation({ summary: 'Clear the auth cookie' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(AUTH_COOKIE_NAME);
    return { message: 'Logged out' };
  }

  private setTokenCookie(res: Response, token: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    const maxAge = resolveAuthCookieMaxAge(
      this.configService.getOrThrow<string>('JWT_EXPIRES_IN'),
    );
    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge,
    });
  }
}
