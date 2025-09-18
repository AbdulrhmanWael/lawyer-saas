import { Transform } from 'class-transformer';
import { IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class CreateBlogDto {
  title: Record<string, string>;
  content: Record<string, string>;
  @IsUUID()
  categoryId: string;
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  published?: boolean;
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  draft?: boolean;
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  inactive?: boolean;
}
