import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { CarouselItemService } from './carousel-item.service';
import { CarouselItem } from './carousel-item.entity';

@Controller('carousel-items')
export class CarouselItemController {
  constructor(private readonly carouselService: CarouselItemService) {}

  @Get()
  findAll(): Promise<CarouselItem[]> {
    return this.carouselService.findAll();
  }

  @Post()
  create(@Body() data: Partial<CarouselItem>) {
    return this.carouselService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<CarouselItem>) {
    return this.carouselService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.carouselService.remove(id);
  }
}
