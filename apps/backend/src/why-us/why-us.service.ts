import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhyUs } from './why-us.entity';
import { CreateWhyUsDto } from './dto/create-why-us.dto';
import { UpdateWhyUsDto } from './dto/update-why-us.dto';

@Injectable()
export class WhyUsService {
  constructor(
    @InjectRepository(WhyUs)
    private readonly whyUsRepo: Repository<WhyUs>,
  ) {}

  findAll(): Promise<WhyUs[]> {
    return this.whyUsRepo.find({ order: { createdAt: 'ASC' } });
  }

  async findOne(id: string): Promise<WhyUs> {
    const whyUs = await this.whyUsRepo.findOne({ where: { id } });
    if (!whyUs) throw new NotFoundException(`WhyUs with id ${id} not found`);
    return whyUs;
  }

  create(dto: CreateWhyUsDto): Promise<WhyUs> {
    const entity = this.whyUsRepo.create(dto);
    return this.whyUsRepo.save(entity);
  }

  async update(id: string, dto: UpdateWhyUsDto): Promise<WhyUs> {
    const whyUs = await this.findOne(id);
    Object.assign(whyUs, dto);
    return this.whyUsRepo.save(whyUs);
  }

  async remove(id: string): Promise<void> {
    const whyUs = await this.findOne(id);
    await this.whyUsRepo.remove(whyUs);
  }
}
