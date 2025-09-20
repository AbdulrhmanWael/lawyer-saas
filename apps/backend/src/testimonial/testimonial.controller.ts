import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestimonialService } from './testimonial.service';
import { ImageService } from 'src/utils/image.service';
import { Testimonial } from './testimonial.entity';

@Controller('testimonials')
export class TestimonialController {
  constructor(
    private readonly testimonialService: TestimonialService,
    private readonly imageService: ImageService,
  ) {}

  @Get()
  findAll(): Promise<Testimonial[]> {
    return this.testimonialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testimonialService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() data: Partial<Testimonial>,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    try {
      if (image) {
        data.imageUrl = await this.imageService.saveImage(
          image.buffer,
          'uploads/testimonials',
        );
      }
      return this.testimonialService.create(data);
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Failed to create testimonial');
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Testimonial>,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    try {
      if (image) {
        // delete old image if exists
        const existing = await this.testimonialService.findOne(id);
        if (existing.imageUrl)
          await this.imageService.deleteImage(existing.imageUrl);
        data.imageUrl = await this.imageService.saveImage(
          image.buffer,
          'uploads/testimonials',
        );
      }
      return this.testimonialService.update(id, data);
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Failed to update testimonial');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const existing = await this.testimonialService.findOne(id);
      if (existing.imageUrl)
        await this.imageService.deleteImage(existing.imageUrl);
      await this.testimonialService.remove(id);
      return { success: true };
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Failed to delete testimonial');
    }
  }
}
