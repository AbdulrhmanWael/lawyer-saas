import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesModule } from '../roles/roles.module';
import { Role } from 'src/roles/role.entity';
import { ImageService } from 'src/utils/image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    PermissionsModule,
    RolesModule,
  ],
  providers: [UsersService, ImageService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
