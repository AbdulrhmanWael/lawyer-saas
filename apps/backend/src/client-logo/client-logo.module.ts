import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientLogo } from './client-logo.entity';
import { ClientLogoService } from './client-logo.service';
import { ClientLogoController } from './client-logo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClientLogo])],
  providers: [ClientLogoService],
  controllers: [ClientLogoController],
})
export class ClientLogoModule {}
