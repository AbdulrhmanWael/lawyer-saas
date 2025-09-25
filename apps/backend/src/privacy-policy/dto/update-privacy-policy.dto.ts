import { IsObject } from 'class-validator';

export class UpdatePrivacyPolicyDto {
  @IsObject()
  content: Record<string, string>;
}
