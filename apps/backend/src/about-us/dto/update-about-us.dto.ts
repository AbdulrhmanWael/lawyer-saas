import { IsObject } from 'class-validator';

export class UpdateAboutDto {
  @IsObject()
  content: Record<string, string>;
}
