import { Injectable } from '@nestjs/common';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';
import { SiteSettingsService } from 'src/site-settings/site-settings.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly siteSettingsService: SiteSettingsService,
  ) {}

  async run() {
    await this.permissionsService.seedPermissions();
    await this.rolesService.seedRoles();
    await this.usersService.seedAdmin();
    await this.siteSettingsService.seedDefaults();
  }
}
