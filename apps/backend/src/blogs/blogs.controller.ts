import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { User } from 'src/users/user.entity';
import { BlogResponse } from './dto/blog-response.dto';

@Controller('blogs')
@UseGuards(JwtAuthGuard)
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  findAll(
    @Query('page') page: number | string,
    @Query('limit') limit: number | string,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.blogsService.findAll(+page, +limit, categoryId, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BlogResponse> {
    return this.blogsService.findOne(id);
  }

  @Post()
  create(
    @Body() body: CreateBlogDto,
    @Request() req: { user: User },
  ): Promise<BlogResponse> {
    return this.blogsService.create(body, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateBlogDto,
    @Request() req: { user: User },
  ): Promise<BlogResponse> {
    return this.blogsService.update(id, body, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
