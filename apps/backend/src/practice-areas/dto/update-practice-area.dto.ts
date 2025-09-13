import { PartialType } from '@nestjs/mapped-types';
import { CreatePracticeAreaDto } from './create-practice-area.dto';

export class UpdatePracticeAreaDto extends PartialType(CreatePracticeAreaDto) {}
