import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from './page.entity';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page) private readonly repo: Repository<Page>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOneBySlug(slug: string) {
    return this.repo.findOne({ where: { slug } });
  }

  create(data: Partial<Page>) {
    return this.repo.save(this.repo.create(data));
  }

  update(id: number, data: Partial<Page>) {
    return this.repo.update(id, data);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return true;
  }
}
