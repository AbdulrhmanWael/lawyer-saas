import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateStaffMemberDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  position: string;

  @IsOptional()
  @IsString()
  practiceAreaId?: string;

  @IsOptional()
  bio?: Record<string, string>;

  @IsOptional()
  @IsNumber()
  order?: number;
}
