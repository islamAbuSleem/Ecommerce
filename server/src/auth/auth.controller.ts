import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../auth-core/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

type AuthenticatedRequest = Request & { user: AuthenticatedUser };

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);
    res.cookie('token', result.token, result.cookie);
    return { success: true, data: result.user };
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    res.cookie('token', result.token, result.cookie);
    return { success: true, data: result.user };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return { success: true, data: await this.authService.me(user.userId) };
  }

  @Public()
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    return { success: true };
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    return;
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    const result = await this.authService.authenticateOAuth(user.userId, user.email);
    res.cookie('token', result.token, result.cookie);
    return res.redirect(process.env.CLIENT_URL ?? 'http://localhost:3000');
  }

  @Public()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {
    return;
  }

  @Public()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    const result = await this.authService.authenticateOAuth(user.userId, user.email);
    res.cookie('token', result.token, result.cookie);
    return res.redirect(process.env.CLIENT_URL ?? 'http://localhost:3000');
  }
}
