import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimonial } from './testimonial.entity';
import { TestimonialService } from './testimonial.service';
import { TestimonialController } from './testimonial.controller';
import { ImageService } from 'src/utils/image.service';

@Module({
  imports: [TypeOrmModule.forFeature([Testimonial])],
  providers: [TestimonialService, ImageService],
  controllers: [TestimonialController],
})
export class TestimonialModule {}
