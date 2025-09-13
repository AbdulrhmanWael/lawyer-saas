import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const role = await this.rolesRepo.findOne({
      where: { name: dto.roleName },
    });
    if (!role) throw new NotFoundException('Role not found');

    const user = this.usersRepo.create({
      ...dto,
      password: hashedPassword,
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

  async update(id: string, dto: UpdateUserDto): Promise<User> {
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
    Object.assign(user, dto);
    return this.usersRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
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
