import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeArea } from './practice-area.entity';
import { PracticeAreasService } from './practice-areas.service';
import { PracticeAreasController } from './practice-areas.controller';
import { ImageService } from 'src/utils/image.service';

@Module({
  imports: [TypeOrmModule.forFeature([PracticeArea])],
  providers: [PracticeAreasService, ImageService],
  controllers: [PracticeAreasController],
  exports: [PracticeAreasService],
})
export class PracticeAreasModule {}
