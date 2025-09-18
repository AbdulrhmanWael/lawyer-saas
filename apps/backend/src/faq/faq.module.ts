import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { Faq } from './faq.entity';
import { FaqGroup } from './faq-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Faq, FaqGroup])],
  controllers: [FaqController],
  providers: [FaqService],
  exports: [FaqService],
})
export class FaqModule {}
