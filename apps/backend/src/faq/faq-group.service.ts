import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FaqGroup } from './faq-group.entity';
import { FaqGroupDto } from './dto/FaqGroupDto';

@Injectable()
export class FaqGroupService {
  constructor(
    @InjectRepository(FaqGroup)
    private readonly faqGroupRepo: Repository<FaqGroup>,
  ) {}

  async create(title: Record<string, string>): Promise<FaqGroupDto> {
    const group = this.faqGroupRepo.create({ title });
    return this.faqGroupRepo.save(group);
  }

  async findAll(): Promise<FaqGroupDto[]> {
    const groups = await this.faqGroupRepo.find({ relations: ['faqs'] });
    return groups.map((g) => ({
      id: g.id,
      title: g.title,
      faqs: g.faqs.map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
      })),
    }));
  }

  async findOne(id: string): Promise<FaqGroupDto> {
    const group = await this.faqGroupRepo.findOne({
      where: { id },
      relations: ['faqs'],
    });
    if (!group) throw new NotFoundException('FaqGroup not found');
    return {
      id: group.id,
      title: group.title,
      faqs: group.faqs.map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
      })),
    };
  }

  async update(id: string, title: Record<string, string>) {
    const group = await this.faqGroupRepo.findOne({ where: { id } });
    if (!group) throw new NotFoundException('FaqGroup not found');
    group.title = title;
    return this.faqGroupRepo.save(group);
  }

  async remove(id: string) {
    const group = await this.faqGroupRepo.findOne({ where: { id } });
    if (!group) throw new NotFoundException('FaqGroup not found');
    return this.faqGroupRepo.remove(group);
  }
}
