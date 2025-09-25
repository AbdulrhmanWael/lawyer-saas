import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { About } from './about-us.entity';
import { AboutService } from './about-us.service';
import { AboutController } from './about-us.controller';

@Module({
  imports: [TypeOrmModule.forFeature([About])],
  providers: [AboutService],
  controllers: [AboutController],
})
export class AboutUsModule {}
