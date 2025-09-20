import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { SendNewsletterDto } from './dto/send-newsletter.dto';
import { MailSettingsDto } from './dto/mail-settings.dto';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  subscribe(@Body() dto: SubscribeDto) {
    return this.newsletterService.subscribe(dto);
  }

  @Get('subscribers')
  subscribers() {
    return this.newsletterService.subscribers();
  }

  @Get('unsubscribe')
  unsubscribe(@Query('email') email: string) {
    return this.newsletterService.unsubscribe(email);
  }

  @Post('send')
  send(@Body() dto: SendNewsletterDto) {
    return this.newsletterService.sendNewsletter(dto);
  }

  @Post('settings')
  updateSettings(@Body() dto: MailSettingsDto) {
    return this.newsletterService.updateSettings(dto);
  }

  @Get('settings')
  getSettings() {
    return this.newsletterService.getSettings();
  }
}
