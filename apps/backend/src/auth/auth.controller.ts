import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

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
      path: '/auth/refresh',
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
  async refresh(@Body() body: { userId: string; refresh_token: string }) {
    return this.authService.refresh(body.userId, body.refresh_token);
  }

  @Post('logout')
  async logout(@Body() email: string) {
    return this.authService.logout(email);
  }
}
