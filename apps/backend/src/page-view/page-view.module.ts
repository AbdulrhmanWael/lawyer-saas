import { Module } from '@nestjs/common';
import { PageViewController } from './page-view.controller';
import { PageViewService } from './page-view.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageView } from './page-view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PageView])],
  controllers: [PageViewController],
  providers: [PageViewService],
})
export class PageViewModule {}
