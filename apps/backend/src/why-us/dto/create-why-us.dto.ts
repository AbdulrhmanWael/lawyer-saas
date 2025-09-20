import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateWhyUsDto {
  @IsNotEmpty()
  @IsObject()
  title: Record<string, string>;

  @IsNotEmpty()
  @IsObject()
  paragraph: Record<string, string>;

  @IsNotEmpty()
  @IsObject()
  buttonText: Record<string, string>;
}
