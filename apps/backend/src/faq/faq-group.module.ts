import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqGroupService } from './faq-group.service';
import { FaqGroupController } from './faq-group.controller';
import { FaqGroup } from './faq-group.entity';
import { Faq } from './faq.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FaqGroup, Faq])],
  controllers: [FaqGroupController],
  providers: [FaqGroupService],
  exports: [FaqGroupService],
})
export class FaqGroupModule {}
