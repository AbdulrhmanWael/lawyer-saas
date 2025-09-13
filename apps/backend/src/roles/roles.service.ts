import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from '../permissions/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionsRepo: Repository<Permission>,
  ) {}

  async create(name: string, permissionIds: string[]): Promise<Role> {
    const permissions = await this.permissionsRepo.find({
      where: { id: In(permissionIds) },
    });
    const role = this.rolesRepo.create({ name, permissions });
    return this.rolesRepo.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.rolesRepo.find({ relations: ['permissions'] });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.rolesRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async updatePermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<Role> {
    const role = await this.findOne(roleId);
    const permissions = await this.permissionsRepo.find({
      where: { id: In(permissionIds) },
    });
    role.permissions = permissions;
    return this.rolesRepo.save(role);
  }

  async seedRoles(): Promise<void> {
    const allPermissions = await this.permissionsRepo.find();

    const roles = [
      { name: 'admin', permissions: allPermissions },
      { name: 'moderator', permissions: allPermissions },
      { name: 'guest', permissions: [] },
    ];

    for (const r of roles) {
      let role = await this.rolesRepo.findOne({
        where: { name: r.name },
        relations: ['permissions'],
      });

      if (!role) {
        role = this.rolesRepo.create({
          name: r.name,
          permissions: r.permissions,
        });
        await this.rolesRepo.save(role);
        console.log(`Seeded role: ${r.name}`);
      }
    }
  }
}
