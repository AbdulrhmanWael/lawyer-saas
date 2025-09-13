import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimonial } from './testimonial.entity';
import { TestimonialService } from './testimonial.service';
import { TestimonialController } from './testimonial.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Testimonial])],
  providers: [TestimonialService],
  controllers: [TestimonialController],
})
export class TestimonialModule {}
