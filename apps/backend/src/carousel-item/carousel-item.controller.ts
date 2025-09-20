import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() data: Partial<CarouselItem>,
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    return this.carouselService.create({
      ...data,
      imageFile: imageFile?.buffer,
    });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: number,
    @Body() data: Partial<CarouselItem>,
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    return this.carouselService.update(id, {
      ...data,
      imageFile: imageFile?.buffer,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.carouselService.remove(id);
  }
}
