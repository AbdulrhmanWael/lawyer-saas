import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import type AuthRequest from 'src/auth/auth.request';
import { PageViewService } from './page-view.service';

@Controller('page-view')
export class PageViewController {
  constructor(private readonly pageViewService: PageViewService) {}
  @Post('track-view')
  async trackView(@Body() body: { page?: string }, @Req() req: AuthRequest) {
    return this.pageViewService.trackView(body, req);
  }
  @Get('summary')
  getTrafficSummary(@Query('period') period: string) {
    return this.pageViewService.getTrafficSummary(period);
  }
}
