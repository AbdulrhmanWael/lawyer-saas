import { Injectable } from '@nestjs/common';
import { PageView } from './page-view.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AuthRequest from 'src/auth/auth.request';

@Injectable()
export class PageViewService {
  constructor(
    @InjectRepository(PageView)
    private readonly pageViewRepo: Repository<PageView>,
  ) {}

  async trackView(body: { page?: string }, req: AuthRequest) {
    const ip = req.ip;
    await this.pageViewRepo.save({
      page: body.page ?? req.url,
      ip,
      userId: req.user?.id,
    });
    return { success: true };
  }

  async getTrafficSummary(period: string) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case '3days':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 2);
        startDate.setHours(0, 0, 0, 0);
        break;
      case '7days':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0);
    }

    return this.pageViewRepo
      .createQueryBuilder('view')
      .select("DATE_TRUNC('day', view.createdAt)", 'day')
      .addSelect('COUNT(*)', 'count')
      .where('view.createdAt >= :startDate', { startDate })
      .groupBy('day')
      .orderBy('day', 'ASC')
      .getRawMany();
  }
}
