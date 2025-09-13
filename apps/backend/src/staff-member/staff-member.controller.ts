import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { StaffMemberService } from './staff-member.service';
import { StaffMember } from './staff-member.entity';

@Controller('staff-members')
export class StaffMemberController {
  constructor(private readonly staffService: StaffMemberService) {}

  @Get()
  findAll(): Promise<StaffMember[]> {
    return this.staffService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.staffService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<StaffMember>) {
    return this.staffService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<StaffMember>) {
    return this.staffService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.staffService.remove(id);
  }
}
