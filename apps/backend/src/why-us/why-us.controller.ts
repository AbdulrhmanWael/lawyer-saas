import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { WhyUsService } from './why-us.service';
import { CreateWhyUsDto } from './dto/create-why-us.dto';
import { UpdateWhyUsDto } from './dto/update-why-us.dto';

@Controller('why-us')
export class WhyUsController {
  constructor(private readonly whyUsService: WhyUsService) {}

  @Get()
  findAll() {
    return this.whyUsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.whyUsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateWhyUsDto) {
    return this.whyUsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWhyUsDto) {
    return this.whyUsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.whyUsService.remove(id);
  }
}
