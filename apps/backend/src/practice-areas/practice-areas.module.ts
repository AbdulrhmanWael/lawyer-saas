import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeArea } from './practice-area.entity';
import { PracticeAreasService } from './practice-areas.service';
import { PracticeAreasController } from './practice-areas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PracticeArea])],
  providers: [PracticeAreasService],
  controllers: [PracticeAreasController],
})
export class PracticeAreasModule {}
