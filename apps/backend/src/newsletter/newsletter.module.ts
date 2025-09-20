import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { NewsletterSubscriber } from './newsletter-subscriber.entity';
import { MailSettings } from './mail-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NewsletterSubscriber, MailSettings])],
  controllers: [NewsletterController],
  providers: [NewsletterService],
})
export class NewsletterModule {}
