import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePracticeAreaDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  title: Record<string, string>;

  @IsOptional()
  excerpt?: Record<string, string>;

  @IsOptional()
  contentHtml?: Record<string, string>;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @IsOptional()
  seoMeta?: any;
}
