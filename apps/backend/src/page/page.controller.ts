import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { PageService } from './page.service';
import { Page } from './page.entity';

@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get()
  findAll(): Promise<Page[]> {
    return this.pageService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string): Promise<Page | null> {
    return this.pageService.findOneBySlug(slug);
  }

  @Post()
  create(@Body() data: Partial<Page>) {
    return this.pageService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Page>) {
    return this.pageService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.pageService.remove(id);
  }
}
