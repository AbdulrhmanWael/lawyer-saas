import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientLogo } from './client-logo.entity';
import { ClientLogoService } from './client-logo.service';
import { ClientLogoController } from './client-logo.controller';
import { ImageService } from 'src/utils/image.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientLogo])],
  providers: [ClientLogoService, ImageService],
  controllers: [ClientLogoController],
})
export class ClientLogoModule {}
