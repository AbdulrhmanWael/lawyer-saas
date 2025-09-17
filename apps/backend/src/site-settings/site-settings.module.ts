import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteSettings } from './site-settings.entity';
import { SiteSettingsService } from './site-settings.service';
import { SiteSettingsController } from './site-settings.controller';
import { ImageService } from 'src/utils/image.service';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSettings])],
  providers: [SiteSettingsService, ImageService],
  controllers: [SiteSettingsController],
  exports: [SiteSettingsService],
})
export class SiteSettingsModule {}
