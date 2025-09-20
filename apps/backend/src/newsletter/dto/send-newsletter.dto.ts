import { IsString } from 'class-validator';

export class SendNewsletterDto {
  @IsString()
  subject: string;

  @IsString()
  content: string;
}
