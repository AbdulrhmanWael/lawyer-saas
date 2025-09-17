/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSettings } from './site-settings.entity';
import { ImageService } from 'src/utils/image.service';

@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectRepository(SiteSettings)
    private readonly repo: Repository<SiteSettings>,
    private readonly imageService: ImageService,
  ) {}

  async getSettings(): Promise<SiteSettings> {
    let settings = await this.repo.findOne({ where: {} });
    if (!settings) {
      settings = this.repo.create({
        logoUrl: '',
        footer: {},
        colors: {},
      });
      settings = await this.repo.save(settings);
    }
    return settings;
  }

  async updateSettings(data: any, fileBuffer?: Buffer): Promise<SiteSettings> {
    let settings = await this.repo.findOne({ where: {} });
    settings ??= this.repo.create();

    let parsedData: Partial<SiteSettings>;
    if (typeof data?.data === 'string') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
        parsedData = JSON.parse(data.data);
      } catch (err) {
        console.error('Failed to parse settings data:', err);
        parsedData = {};
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      parsedData = data;
    }
    if (parsedData.footer) {
      settings.footer = { ...parsedData.footer };
    }

    if (parsedData.colors) {
      settings.colors = { ...parsedData.colors };
    }

    if (parsedData.logoUrl) {
      settings.logoUrl = parsedData.logoUrl;
    }

    if (fileBuffer) {
      if (settings.logoUrl) {
        await this.imageService.deleteImage(settings.logoUrl);
      }
      settings.logoUrl = await this.imageService.saveImage(fileBuffer);
    }

    settings.updatedAt = new Date();
    return this.repo.save(settings);
  }

  async seedDefaults(): Promise<void> {
    let settings = await this.repo.findOne({ where: {} });
    if (settings) return;

    const defaultColors = {
      light: {
        colorPrimary: '#2563eb',
        colorSecondary: '#222222',
        colorAccent: '#3b82f6',
        colorBg: '#ffffff',
        colorText: '#1a1a1a',
      },
      dark: {
        colorPrimary: '#60a5fa',
        colorSecondary: '#dddddd',
        colorAccent: '#93c5fd',
        colorBg: '#121212',
        colorText: '#e5e7eb',
      },
    };

    settings = this.repo.create({
      logoUrl: '',
      footer: {},
      colors: defaultColors,
    });

    await this.repo.save(settings);
    console.log('✅ Seeded default SiteSettings with colors');
  }
}
