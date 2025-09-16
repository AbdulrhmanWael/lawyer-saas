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
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: User) {
    const role = user.role;
    const permissions = role.permissions;

    const payload = {
      sub: user.id,
      email: user.email,
      role,
      permissions,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' },
    );

    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashed);

    return {
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException('No refresh token found');
    }
    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    return this.login(user);
  }

  async logout(email: string) {
    await this.usersService.updateRefreshToken(email, null);
  }
}
