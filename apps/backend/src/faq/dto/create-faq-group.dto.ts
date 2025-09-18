import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateFaqGroupDto {
  @IsNotEmpty()
  @IsObject()
  title: Record<string, string>;
}
