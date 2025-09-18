import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) return user;
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: user.role.permissions,
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' },
    );

    const hashed = await bcrypt.hash(refresh_token, 10);
    await this.usersService.updateRefreshToken(user.email, hashed);

    return { user, access_token, refresh_token };
  }

  async refreshFromToken(refreshToken: string) {
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify<{ sub: string }>(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findOne(payload.sub);
    if (!user?.refreshTokenHash)
      throw new UnauthorizedException('No refresh token found');

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    return this.login(user);
  }

  async logout(email: string) {
    await this.usersService.updateRefreshToken(email, null);
  }
}
