import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Translation } from './translation.entity';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(Translation)
    private readonly repo: Repository<Translation>,
  ) {}

  async getTranslations(
    referenceType: string,
    referenceId: number,
    language: string,
  ) {
    return this.repo.find({
      where: { referenceType, referenceId, language },
    });
  }

  async setTranslation(
    referenceType: string,
    referenceId: number,
    language: string,
    field: string,
    value: string,
  ) {
    let translation = await this.repo.findOne({
      where: { referenceType, referenceId, language, field },
    });

    if (!translation) {
      translation = this.repo.create({
        referenceType,
        referenceId,
        language,
        field,
        value,
      });
    } else {
      translation.value = value;
    }
    return this.repo.save(translation);
  }

  async deleteTranslations(referenceType: string, referenceId: number) {
    await this.repo.delete({ referenceType, referenceId });
  }
}
