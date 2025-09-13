import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from './testimonial.entity';

@Injectable()
export class TestimonialService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly repo: Repository<Testimonial>,
  ) {}

  findAll(): Promise<Testimonial[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Testimonial> {
    const testimonial = await this.repo.findOne({ where: { id } });
    if (!testimonial) throw new NotFoundException('Testimonial not found');
    return testimonial;
  }

  create(data: Partial<Testimonial>): Promise<Testimonial> {
    const testimonial = this.repo.create(data);
    return this.repo.save(testimonial);
  }

  async update(id: number, data: Partial<Testimonial>): Promise<Testimonial> {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
