import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivacyPolicy } from './privacy-policy.entity';
import { UpdatePrivacyPolicyDto } from './dto/update-privacy-policy.dto';

@Injectable()
export class PrivacyPolicyService {
  constructor(
    @InjectRepository(PrivacyPolicy)
    private readonly repo: Repository<PrivacyPolicy>,
  ) {}

  async get(): Promise<PrivacyPolicy> {
    let record = await this.repo.findOne({ where: { id: 1 } });
    if (!record) {
      record = this.repo.create({ id: 1, content: {} });
      await this.repo.save(record);
    }
    return record;
  }

  async update(dto: UpdatePrivacyPolicyDto): Promise<PrivacyPolicy> {
    const record = await this.get();
    record.content = dto.content;
    return this.repo.save(record);
  }
}
