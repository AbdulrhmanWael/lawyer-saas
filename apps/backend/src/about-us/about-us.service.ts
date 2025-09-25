// src/about/about.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { About } from './about-us.entity';
import { UpdateAboutDto } from './dto/update-about-us.dto';

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(About)
    private readonly aboutRepo: Repository<About>,
  ) {}

  async get(): Promise<About> {
    let about = await this.aboutRepo.findOne({ where: { id: 1 } });
    if (!about) {
      about = this.aboutRepo.create({ id: 1, content: {} });
      await this.aboutRepo.save(about);
    }
    return about;
  }

  async update(dto: UpdateAboutDto): Promise<About> {
    const about = await this.get();
    about.content = dto.content;
    return this.aboutRepo.save(about);
  }
}
