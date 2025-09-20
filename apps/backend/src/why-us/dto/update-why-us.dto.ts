import { PartialType } from '@nestjs/mapped-types';
import { CreateWhyUsDto } from './create-why-us.dto';

export class UpdateWhyUsDto extends PartialType(CreateWhyUsDto) {}
