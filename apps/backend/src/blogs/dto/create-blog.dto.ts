import { IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class CreateBlogDto {
  title: Record<string, string>;
  content: Record<string, string>;
  @IsUUID()
  categoryId: string;
  @IsOptional()
  @IsBoolean()
  published?: boolean;
  @IsOptional()
  @IsBoolean()
  draft?: boolean;
}
