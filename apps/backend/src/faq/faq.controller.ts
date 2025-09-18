import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { FaqService } from './faq.service';

@Controller('faqs')
export class FaqController {
  constructor(private readonly service: FaqService) {}

  @Post()
  create(
    @Body('groupId') groupId: string,
    @Body('question') question: Record<string, string>,
    @Body('answer') answer: Record<string, string>,
  ) {
    return this.service.create(groupId, question, answer);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.service.search(query);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body('question') question: Record<string, string>,
    @Body('answer') answer: Record<string, string>,
  ) {
    return this.service.update(id, question, answer);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
