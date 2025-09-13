import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { PracticeAreasService } from './practice-areas.service';
import { CreatePracticeAreaDto } from './dto/create-practice-area.dto';
import { UpdatePracticeAreaDto } from './dto/update-practice-area.dto';
import { PracticeArea } from './practice-area.entity';

@Controller('practice-areas')
export class PracticeAreasController {
  constructor(private readonly service: PracticeAreasService) {}

  @Post()
  create(@Body() dto: CreatePracticeAreaDto): Promise<PracticeArea> {
    return this.service.create(dto);
  }

  @Get()
  findAll(): Promise<PracticeArea[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PracticeArea> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePracticeAreaDto,
  ): Promise<PracticeArea> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
