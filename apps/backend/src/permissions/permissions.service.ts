import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';

export type PermissionName =
  | 'create_blog'
  | 'update_blog'
  | 'delete_blog'
  | 'create_user'
  | 'update_user'
  | 'delete_user';

const DEFAULT_PERMISSIONS: PermissionName[] = [
  'create_blog',
  'update_blog',
  'delete_blog',
  'create_user',
  'update_user',
  'delete_user',
];

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionsRepo: Repository<Permission>,
  ) {}

  async create(name: string): Promise<Permission> {
    const perm = this.permissionsRepo.create({ name });
    return this.permissionsRepo.save(perm);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionsRepo.find();
  }

  async findOne(id: string): Promise<Permission> {
    const perm = await this.permissionsRepo.findOne({ where: { id } });
    if (!perm) throw new NotFoundException('Permission not found');
    return perm;
  }

  async seedPermissions(): Promise<void> {
    for (const name of DEFAULT_PERMISSIONS) {
      const exists = await this.permissionsRepo.findOne({ where: { name } });
      if (!exists) {
        await this.create(name);
        console.log(`Seeded permission: ${name}`);
      }
    }
  }
}
