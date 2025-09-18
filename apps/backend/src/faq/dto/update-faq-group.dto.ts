import { PartialType } from '@nestjs/mapped-types';
import { CreateFaqGroupDto } from './create-faq-group.dto';

export class UpdateFaqGroupDto extends PartialType(CreateFaqGroupDto) {}
