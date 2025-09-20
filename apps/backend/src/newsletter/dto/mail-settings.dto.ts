import { IsString, IsInt } from 'class-validator';

export class MailSettingsDto {
  @IsString()
  host: string;

  @IsInt()
  port: number;

  @IsString()
  user: string;

  @IsString()
  pass: string;

  @IsString()
  from: string;
}
