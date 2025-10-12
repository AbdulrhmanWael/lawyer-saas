import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

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

    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Set-Cookie', [
        `token=${access_token}; Path=/; Domain=.lex-virtus.com; Secure; HttpOnly; SameSite=None; Partitioned; Max-Age=900`,
        `refresh_token=${refresh_token}; Path=/; Domain=.lex-virtus.com; Secure; HttpOnly; SameSite=None; Partitioned; Max-Age=${7 * 24 * 60 * 60}`,
      ]);
    } else {
      res.cookie('token', access_token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/',
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    return {
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatarUrl: userData.avatarUrl,
        role: userData.role.name,
      },
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

    const { access_token, refresh_token: newRefreshToken } =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.authService.refreshFromToken(refreshToken);

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      domain:
        process.env.NODE_ENV === 'production' ? '.lex-virtus.com' : undefined,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('token', access_token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      domain:
        process.env.NODE_ENV === 'production' ? '.lex-virtus.com' : undefined,
      maxAge: 15 * 60 * 1000,
    });
    if (process.env.NODE_ENV === 'production') {
      res.header('Set-Cookie', [
        `token=${access_token}; Path=/; Domain=.lex-virtus.com; Secure; HttpOnly; SameSite=None; Partitioned; Max-Age=900`,
        `refresh_token=${newRefreshToken}; Path=/; Domain=.lex-virtus.com; Secure; HttpOnly; SameSite=None; Partitioned; Max-Age=${7 * 24 * 60 * 60}`,
      ]);
    }

    return { success: true };
  }

  @Post('logout')
  async logout(
    @Body() body: { email: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(body.email);
    res.clearCookie('refresh_token', { path: '/' });
    res.clearCookie('token', { path: '/' });
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  async me(@Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token = req.cookies['token'];
    if (!token) throw new UnauthorizedException('Not logged in');

    let payload: { sub: string; email: string; role: any };
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.authService.usersService.findOne(payload.sub);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role.name,
    };
  }
}
