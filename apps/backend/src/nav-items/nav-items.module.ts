import { Module } from '@nestjs/common';
import { NavItemsService } from './nav-items.service';
import { NavItemsController } from './nav-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NavItem } from './nav-items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NavItem])],
  providers: [NavItemsService],
  controllers: [NavItemsController],
})
export class NavItemsModule {}
