import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactMessage } from './contact-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactMessage])],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
