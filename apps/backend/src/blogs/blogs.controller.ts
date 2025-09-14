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
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { User } from 'src/users/user.entity';

@Controller('blogs')
@UseGuards(JwtAuthGuard)
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.blogsService.findAll(page, limit, categoryId, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBlogDto, @Request() req: { user: User }) {
    return this.blogsService.create(dto, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @Request() req: { user: User },
  ) {
    return this.blogsService.update(id, dto, req.user.id);
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
