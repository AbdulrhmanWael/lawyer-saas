// src/site-settings/site-settings.controller.ts
import { Controller, Get, Patch, Body } from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';
import { SiteSettings } from './site-settings.entity';

@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly service: SiteSettingsService) {}

  @Get()
  getSettings(): Promise<SiteSettings> {
    return this.service.getSettings();
  }

  @Patch()
  updateSettings(@Body() data: Partial<SiteSettings>): Promise<SiteSettings> {
    return this.service.updateSettings(data);
  }
}
