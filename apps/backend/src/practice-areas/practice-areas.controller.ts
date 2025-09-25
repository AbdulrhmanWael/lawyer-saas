import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { PracticeAreasService } from './practice-areas.service';
import { CreatePracticeAreaDto } from './dto/create-practice-area.dto';
import { UpdatePracticeAreaDto } from './dto/update-practice-area.dto';
import { PracticeArea } from './practice-area.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { Public } from 'src/auth/permissions.decorator';

@Controller('practice-areas')
@UseGuards(JwtAuthGuard)
export class PracticeAreasController {
  constructor(private readonly service: PracticeAreasService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 2))
  async create(
    @Body() dto: CreatePracticeAreaDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<PracticeArea> {
    try {
      const logoFile = files?.find((f) => f.fieldname === 'logo');
      const coverFile = files?.find((f) => f.fieldname === 'coverImage');
      return await this.service.create(
        dto,
        logoFile?.buffer,
        coverFile?.buffer,
      );
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get(':slug')
  @Public()
  async findBySlug(@Param('slug') slug: string): Promise<PracticeArea> {
    return this.service.findBySlug(slug);
  }

  @Get()
  @Public()
  findAll(): Promise<PracticeArea[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string): Promise<PracticeArea> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'coverImage', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePracticeAreaDto,
    @UploadedFiles()
    files?: {
      logo?: Express.Multer.File[];
      coverImage?: Express.Multer.File[];
    },
  ): Promise<PracticeArea> {
    const logoFile = files?.logo?.[0];
    const coverFile = files?.coverImage?.[0];
    console.log(files);
    return this.service.update(id, dto, logoFile?.buffer, coverFile?.buffer);
  }
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.service.remove(id);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
