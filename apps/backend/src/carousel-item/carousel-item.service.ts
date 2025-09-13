import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarouselItem } from './carousel-item.entity';

@Injectable()
export class CarouselItemService {
  constructor(
    @InjectRepository(CarouselItem)
    private readonly repo: Repository<CarouselItem>,
  ) {}

  findAll() {
    return this.repo.find({ order: { order: 'ASC' } });
  }

  create(data: Partial<CarouselItem>) {
    return this.repo.save(this.repo.create(data));
  }

  update(id: number, data: Partial<CarouselItem>) {
    return this.repo.update(id, data);
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return true;
  }
}
