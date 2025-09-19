import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import type AuthRequest from 'src/auth/auth.request';
import { PageViewService } from './page-view.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { map } from 'rxjs/operators';

@Controller('page-view')
export class PageViewController {
  constructor(private readonly pageViewService: PageViewService) {}
  @Post('track-view')
  async trackView(@Body() body: { page?: string }, @Req() req: AuthRequest) {
    return this.pageViewService.trackView(body, req);
  }
  @Get('summary')
  @UseGuards(JwtAuthGuard)
  getTrafficSummary(@Query('period') period: string) {
    return this.pageViewService.getTrafficSummary(period);
  }

  @Sse('stream')
  @UseGuards(JwtAuthGuard)
  streamTraffic(@Query('period') period: string) {
    return this.pageViewService
      .getTrafficStream(period)
      .pipe(map((data) => ({ data }) as MessageEvent));
  }
}
