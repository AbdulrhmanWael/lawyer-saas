import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './page.entity';
import { PageService } from './page.service';
import { PageController } from './page.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Page])],
  providers: [PageService],
  controllers: [PageController],
})
export class PageModule {}
