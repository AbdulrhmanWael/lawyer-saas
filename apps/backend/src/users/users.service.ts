import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ImageService } from 'src/utils/image.service';
import { Request, Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,
    private readonly imageService: ImageService,
  ) {}

  async create(dto: CreateUserDto, fileBuffer?: Buffer): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const role = await this.rolesRepo.findOne({
      where: { name: dto.roleName },
      relations: ['users'],
    });
    if (!role) throw new NotFoundException('Role not found');
    let avatarUrl: string | undefined;
    if (fileBuffer) avatarUrl = await this.imageService.saveImage(fileBuffer);

    const user = this.usersRepo.create({
      ...dto,
      email: dto.email.toLowerCase().trim(),
      password: hashedPassword,
      avatarUrl,
      role,
    });
    role.users.push(user);
    await this.rolesRepo.save(role);
    return this.usersRepo.save(user);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepo.findOne({
      where: { email: email.trim().toLowerCase() },
    });
    return user;
  }

  async update(
    id: string,
    dto: UpdateUserDto = {},
    fileBuffer?: Buffer,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.roleName) {
      const role = await this.rolesRepo.findOne({
        where: { name: dto.roleName },
        relations: ['users'],
      });
      if (!role) throw new NotFoundException('Role not found');
      user.role = role;
      role.users.push(user);
      await this.rolesRepo.save(role);
    }

    if (fileBuffer) {
      if (user.avatarUrl) await this.imageService.deleteImage(user.avatarUrl);
      user.avatarUrl = await this.imageService.saveImage(fileBuffer);
    }

    Object.assign(user, dto);

    return this.usersRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
  }

  async updateRefreshToken(email: string, tokenHash: string | null) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    user.refreshTokenHash = tokenHash;
    await this.usersRepo.save(user);
  }

  async updatePassword(
    email: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    await this.usersRepo.save(user);
  }

  async createGuest(): Promise<User> {
    const role = await this.rolesRepo.findOne({
      where: { name: 'guest' },
      relations: ['users'],
    });
    if (!role) throw new NotFoundException('Guest role not found');
    const guest = this.usersRepo.create({
      name: `Guest_${Date.now()}`,
      email: `guest_${Date.now()}@example.com`.trim().toLowerCase(),
      password: '',
      isGuest: true,
      role: role,
    });
    role.users.push(guest);
    await this.rolesRepo.save(role);
    return this.usersRepo.save(guest);
  }

  async getOrCreateGuest(req: Request, res: Response): Promise<User> {
    let guestId = req.cookies['guestId'] as string | undefined;

    if (!guestId) {
      const guest = await this.createGuest();
      guestId = guest.id;
      res.cookie('guestId', guestId, { maxAge: 365 * 24 * 60 * 60 * 1000 });
      return guest;
    }

    const existingUser = await this.usersRepo.findOne({
      where: { id: guestId },
    });
    if (!existingUser) {
      return this.createGuest();
    }

    return existingUser;
  }

  async seedAdmin(): Promise<void> {
    const existing = await this.findByEmail(process.env.ADMIN_EMAIL!);
    if (!existing) {
      const role = await this.rolesRepo.findOne({
        where: { name: 'admin' },
        relations: ['users'],
      });
      if (!role) throw new NotFoundException('Admin role not found');
      role.users.push(
        await this.create({
          name: 'Admin',
          email: process.env.ADMIN_EMAIL!,
          password: process.env.ADMIN_PASSWORD!,
          roleName: role.name,
        }),
      );
      await this.rolesRepo.save(role);
      console.log('Seeded admin user successfully');
    }
  }
}
