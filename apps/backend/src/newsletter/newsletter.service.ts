import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsletterSubscriber } from './newsletter-subscriber.entity';
import { MailSettings } from './mail-settings.entity';
import { SubscribeDto } from './dto/subscribe.dto';
import { SendNewsletterDto } from './dto/send-newsletter.dto';
import nodemailer, { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { MailSettingsDto } from './dto/mail-settings.dto';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(NewsletterSubscriber)
    private readonly subscriberRepo: Repository<NewsletterSubscriber>,
    @InjectRepository(MailSettings)
    private readonly settingsRepo: Repository<MailSettings>,
  ) {}

  async subscribe(dto: SubscribeDto) {
    const existing = await this.subscriberRepo.findOne({
      where: { email: dto.email },
    });
    if (existing?.active) return existing;

    const subscriber = this.subscriberRepo.create({
      email: dto.email,
      active: true,
    });
    return this.subscriberRepo.save(subscriber);
  }

  async subscribers() {
    return this.subscriberRepo.find();
  }

  async unsubscribe(email: string) {
    const sub = await this.subscriberRepo.findOne({ where: { email } });
    if (!sub) return { success: false, message: 'Email not found' };

    sub.active = false;
    await this.subscriberRepo.save(sub);
    return { success: true, message: 'Unsubscribed successfully' };
  }

  async updateSettings(dto: Partial<MailSettingsDto>) {
    let settings = await this.settingsRepo.findOne({ where: {} });
    if (!settings) {
      settings = this.settingsRepo.create(dto);
    } else {
      Object.assign(settings, dto);
    }
    return this.settingsRepo.save(settings);
  }

  async getSettings(): Promise<MailSettings> {
    const settings = await this.settingsRepo.findOne({ where: {} });
    if (!settings) {
      throw new Error('Mail settings not configured');
    }
    return settings;
  }

  private async getTransporter(): Promise<
    Transporter<SMTPTransport.SentMessageInfo>
  > {
    const settings = await this.getSettings();

    const transporter: Transporter<SMTPTransport.SentMessageInfo> =
      nodemailer.createTransport({
        host: settings.host,
        port: settings.port,
        secure: settings.port === 465,
        auth: {
          user: settings.user,
          pass: settings.pass,
        },
      });

    return transporter;
  }

  async sendNewsletter(dto: SendNewsletterDto) {
    const subs = await this.subscriberRepo.find({ where: { active: true } });
    if (!subs.length) {
      return { success: false, message: 'No subscribers' };
    }

    const settings = await this.getSettings();
    const transporter = await this.getTransporter();
    await Promise.all(
      subs.map(async (s) => {
        const result: SMTPTransport.SentMessageInfo =
          await transporter.sendMail({
            from: settings.from,
            to: s.email,
            subject: dto.subject,
            html: `${dto.content}<br><br><a href="${process.env.FRONTEND_URL}/unsubscribe?email=${s.email}">Unsubscribe</a>`,
          });

        return result;
      }),
    );

    return { success: true, count: subs.length };
  }
}
