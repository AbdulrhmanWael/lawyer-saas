import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarouselItem } from './carousel-item.entity';
import { CarouselItemService } from './carousel-item.service';
import { CarouselItemController } from './carousel-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CarouselItem])],
  providers: [CarouselItemService],
  controllers: [CarouselItemController],
})
export class CarouselItemModule {}
