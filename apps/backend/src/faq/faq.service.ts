import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './faq.entity';
import { FaqGroup } from './faq-group.entity';
import { FaqDto } from './dto/FaqDto';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepo: Repository<Faq>,
    @InjectRepository(FaqGroup)
    private readonly faqGroupRepo: Repository<FaqGroup>,
  ) {}

  async create(
    groupId: string,
    question: Record<string, string>,
    answer: Record<string, string>,
  ): Promise<FaqDto> {
    const group = await this.faqGroupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('FaqGroup not found');

    const faq = this.faqRepo.create({ group, question, answer });
    return this.faqRepo.save(faq);
  }

  async findAll(): Promise<FaqDto[]> {
    const faqs = await this.faqRepo.find({ relations: ['group'] });
    return faqs.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
    }));
  }
  async search(query: string): Promise<FaqDto[]> {
    const faqs = await this.faqRepo
      .createQueryBuilder('faq')
      .where(`faq.question::text ILIKE :q`, { q: `%${query}%` })
      .orWhere(`faq.answer::text ILIKE :q`, { q: `%${query}%` })
      .getMany();

    return faqs.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
    }));
  }

  async update(
    id: string,
    question: Record<string, string>,
    answer: Record<string, string>,
  ) {
    const faq = await this.faqRepo.findOne({ where: { id } });
    if (!faq) throw new NotFoundException('Faq not found');
    faq.question = question;
    faq.answer = answer;
    return this.faqRepo.save(faq);
  }

  async remove(id: string) {
    const faq = await this.faqRepo.findOne({ where: { id } });
    if (!faq) throw new NotFoundException('Faq not found');
    return this.faqRepo.remove(faq);
  }
}
