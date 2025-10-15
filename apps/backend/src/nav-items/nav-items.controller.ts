// src/nav-items/nav-items.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { NavItemsService } from './nav-items.service';
import { NavItem } from './nav-items.entity';

@Controller('nav-items')
export class NavItemsController {
  constructor(private readonly navItemsService: NavItemsService) {}

  @Get()
  findAll(): Promise<NavItem[]> {
    return this.navItemsService.findAll();
  }

  @Post()
  create(@Body() data: Partial<NavItem>): Promise<NavItem> {
    return this.navItemsService.create(data);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: Partial<NavItem>,
  ): Promise<NavItem | null> {
    return this.navItemsService.update(id, data);
  }

  @Patch('/reorder')
  async reorder(@Body() items: { id: string; order: number }[]): Promise<void> {
    await this.navItemsService.reorder(items);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.navItemsService.delete(id);
  }
}
