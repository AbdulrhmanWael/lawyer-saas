import { Controller, Post, Get, Param, Body, Patch } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() body: { name: string; permissionIds: string[] }) {
    return this.rolesService.create(body.name, body.permissionIds);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id/permissions')
  updatePermissions(
    @Param('id') id: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    return this.rolesService.updatePermissions(id, permissionIds);
  }
}
