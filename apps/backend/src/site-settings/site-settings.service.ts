import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSettings } from './site-settings.entity';

@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectRepository(SiteSettings)
    private readonly repo: Repository<SiteSettings>,
  ) {}

  async getSettings(): Promise<SiteSettings> {
    const settings = await this.repo.findOne({});
    if (!settings) {
      throw new NotFoundException('Site settings not found');
    }
    return settings;
  }

  async updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    let settings = await this.repo.findOne({});
    settings ??= this.repo.create();

    Object.assign(settings, data);
    return this.repo.save(settings);
  }
}
