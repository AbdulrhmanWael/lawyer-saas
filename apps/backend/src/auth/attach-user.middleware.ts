// attach-user.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import AuthRequest from './auth.request';

@Injectable()
export class AttachUserMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: AuthRequest, res: any, next: () => void) {
    const token = req.cookies['token'] as string;
    if (!token) return next();

    try {
      const payload: { sub: string; role: { name: string } } =
        this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });
      const user = await this.usersService.findOne(payload.sub);
      req.user = { id: user.id, role: user.role };
    } catch {
      /* will be handled by permission guard */
    }

    next();
  }
}
