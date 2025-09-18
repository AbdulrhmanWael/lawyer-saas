import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blog.entity';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';
import { ImageService } from 'src/utils/image.service';
import { UsersService } from 'src/users/users.service';
import { BlogView } from './blog-view.entity';
import { Role } from 'src/roles/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, User, Category, BlogView, Role])],
  controllers: [BlogsController],
  providers: [BlogsService, ImageService, UsersService],
  exports: [BlogsService],
})
export class BlogsModule {}
