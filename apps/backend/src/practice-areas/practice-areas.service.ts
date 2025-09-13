import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeArea } from './practice-area.entity';
import { CreatePracticeAreaDto } from './dto/create-practice-area.dto';
import { UpdatePracticeAreaDto } from './dto/update-practice-area.dto';

@Injectable()
export class PracticeAreasService {
  constructor(
    @InjectRepository(PracticeArea)
    private readonly repo: Repository<PracticeArea>,
  ) {}

  async create(dto: CreatePracticeAreaDto): Promise<PracticeArea> {
    const pa = this.repo.create(dto);
    return this.repo.save(pa);
  }

  async findAll(): Promise<PracticeArea[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<PracticeArea> {
    const pa = await this.repo.findOne({ where: { id } });
    if (!pa) throw new NotFoundException('PracticeArea not found');
    return pa;
  }

  async update(id: string, dto: UpdatePracticeAreaDto): Promise<PracticeArea> {
    const pa = await this.findOne(id);
    Object.assign(pa, dto);
    return this.repo.save(pa);
  }

  async remove(id: string): Promise<void> {
    const pa = await this.findOne(id);
    await this.repo.remove(pa);
  }
}
