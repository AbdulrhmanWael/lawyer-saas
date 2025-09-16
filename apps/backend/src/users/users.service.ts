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
    });
    if (!role) throw new NotFoundException('Role not found');
    let avatarUrl: string | undefined;
    if (fileBuffer) avatarUrl = await this.imageService.saveImage(fileBuffer);

    const user = this.usersRepo.create({
      ...dto,
      password: hashedPassword,
      avatarUrl,
      role,
    });
    return this.usersRepo.save(user);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
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
      });
      if (!role) throw new NotFoundException('Role not found');
      user.role = role;
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
    await this.usersRepo.update({ email }, { refreshTokenHash: tokenHash });
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

  async seedAdmin(): Promise<void> {
    const existing = await this.findByEmail(process.env.ADMIN_EMAIL!);
    if (!existing) {
      const role = await this.rolesRepo.findOne({ where: { name: 'admin' } });
      if (!role) throw new NotFoundException('Admin role not found');

      await this.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL!,
        password: process.env.ADMIN_PASSWORD!,
        roleName: role.name,
      });

      console.log('Seeded admin user successfully');
    }
  }
}
