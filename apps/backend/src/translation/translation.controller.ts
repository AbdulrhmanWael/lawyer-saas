import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TranslationService } from './translation.service';

@Controller('translations')
export class TranslationController {
  constructor(private readonly service: TranslationService) {}

  @Get(':type/:id/:lang')
  getTranslations(
    @Param('type') type: string,
    @Param('id') id: number,
    @Param('lang') lang: string,
  ) {
    return this.service.getTranslations(type, id, lang);
  }

  @Post()
  setTranslation(
    @Body()
    body: {
      type: string;
      id: number;
      lang: string;
      field: string;
      value: string;
    },
  ) {
    return this.service.setTranslation(
      body.type,
      body.id,
      body.lang,
      body.field,
      body.value,
    );
  }
}
