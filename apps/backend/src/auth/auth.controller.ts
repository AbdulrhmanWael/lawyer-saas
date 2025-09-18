import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    const {
      user: userData,
      access_token,
      refresh_token,
    } = await this.authService.login(user);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatarUrl: userData.avatarUrl,
        role: userData.role.name,
      },
      access_token,
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken)
      throw new UnauthorizedException('No refresh token provided');

    const {
      user,
      access_token,
      refresh_token: newRefreshToken,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    } = await this.authService.refreshFromToken(refreshToken);

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role.name,
      },
      access_token,
    };
  }

  @Post('logout')
  async logout(
    @Body() body: { email: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(body.email);
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { message: 'Logged out successfully' };
  }
}
