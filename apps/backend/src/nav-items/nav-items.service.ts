import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NavItem } from './nav-items.entity';

@Injectable()
export class NavItemsService {
  constructor(
    @InjectRepository(NavItem)
    private readonly repo: Repository<NavItem>,
  ) {}

  findAll() {
    return this.repo.find({
      where: { visible: true },
      order: { order: 'ASC' },
    });
  }

  async create(data: Partial<NavItem>) {
    const item = this.repo.create(data);
    return this.repo.save(item);
  }

  async update(id: string, data: Partial<NavItem>) {
    await this.repo.update(id, data);
    return this.repo.findOneBy({ id });
  }

  async reorder(items: { id: string; order: number }[]) {
    for (const { id, order } of items) {
      await this.repo.update(id, { order });
    }
  }

  async delete(id: string) {
    await this.repo.delete(id);
  }
}
