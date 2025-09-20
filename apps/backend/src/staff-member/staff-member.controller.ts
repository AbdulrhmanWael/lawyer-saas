// staff-member.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StaffMemberService } from './staff-member.service';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';
import { StaffMemberResponseDto } from './dto/staff-member-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('staff-members')
export class StaffMemberController {
  constructor(private readonly staffService: StaffMemberService) {}

  @Get()
  async findAll() {
    const data = await this.staffService.findAll();
    return plainToInstance(StaffMemberResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.staffService.findOne(id);
    return plainToInstance(StaffMemberResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() dto: CreateStaffMemberDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const data = await this.staffService.create(dto, file);
    return plainToInstance(StaffMemberResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateStaffMemberDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const data = await this.staffService.update(id, dto, file);
    return plainToInstance(StaffMemberResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @Patch('reorder')
  async reorder(@Body() body: { orders: { id: number; order: number }[] }) {
    const data = await this.staffService.reorder(body.orders);
    return plainToInstance(StaffMemberResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.staffService.remove(id);
  }
}
