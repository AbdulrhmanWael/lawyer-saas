import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateFaqDto {
  @IsNotEmpty()
  @IsString()
  groupId: string;

  @IsNotEmpty()
  @IsObject()
  question: Record<string, string>;

  @IsNotEmpty()
  @IsObject()
  answer: Record<string, string>;
}
