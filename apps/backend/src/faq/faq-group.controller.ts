import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { FaqGroupService } from './faq-group.service';

@Controller('faq-groups')
export class FaqGroupController {
  constructor(private readonly service: FaqGroupService) {}

  @Post()
  create(@Body('title') title: Record<string, string>) {
    return this.service.create(title);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body('title') title: Record<string, string>,
  ) {
    return this.service.update(id, title);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
