import {
  Controller,
  Get,
  Patch,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';
import { SiteSettings } from './site-settings.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly service: SiteSettingsService) {}

  @Get()
  getSettings(): Promise<SiteSettings> {
    return this.service.getSettings();
  }

  @Patch()
  @UseInterceptors(FileInterceptor('logo'))
  async updateSettings(
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<SiteSettings> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.service.updateSettings(body, file?.buffer);
  }
}
