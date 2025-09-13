// src/roles/roles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Permission } from '../permissions/permission.entity';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission]), PermissionsModule],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
