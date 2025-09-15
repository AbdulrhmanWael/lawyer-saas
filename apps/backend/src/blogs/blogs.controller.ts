import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
  //UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { User } from 'src/users/user.entity';
import type { Express } from 'express'; // 👈 important
//import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@Controller('blogs')
//@UseGuards(JwtAuthGuard)
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  findAll(
    @Query('locale') locale?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.blogsService.findAll(page, limit, categoryId, search, locale);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('locale') locale?: string) {
    return this.blogsService.findOne(id, locale);
  }

  @Post()
  @UseInterceptors(FileInterceptor('coverImage'))
  create(
    @Body() dto: CreateBlogDto,
    @Request() req: { user: User },
    @Query('locale') locale?: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.blogsService.create(
      dto,
      req.user.id,
      locale,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      file?.buffer ?? undefined,
    );
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('coverImage'))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @Request() req: { user: User },
    @Query('locale') locale?: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.blogsService.update(
      id,
      dto,
      req.user.id,
      locale,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      file?.buffer ?? undefined,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }

  @Patch(':id/publish')
  publish(@Param('id') id: string) {
    return this.blogsService.setPublishStatus(id, true);
  }

  @Patch(':id/unpublish')
  unpublish(@Param('id') id: string) {
    return this.blogsService.setPublishStatus(id, false);
  }
}
