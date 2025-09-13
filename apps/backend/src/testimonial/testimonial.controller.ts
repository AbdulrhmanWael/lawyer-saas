import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { Testimonial } from './testimonial.entity';

@Controller('testimonials')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Get()
  findAll(): Promise<Testimonial[]> {
    return this.testimonialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.testimonialService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Testimonial>) {
    return this.testimonialService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Testimonial>) {
    return this.testimonialService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.testimonialService.remove(id);
  }
}
