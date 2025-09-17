import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('q') q: string, @Query('locale') locale?: string) {
    if (!q) return { blogs: [], users: [] };
    return this.searchService.globalSearch(q, locale);
  }
}
