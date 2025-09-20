import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhyUs } from './why-us.entity';
import { WhyUsService } from './why-us.service';
import { WhyUsController } from './why-us.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WhyUs])],
  providers: [WhyUsService],
  controllers: [WhyUsController],
  exports: [WhyUsService],
})
export class WhyUsModule {}
