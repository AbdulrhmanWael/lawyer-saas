import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blog.entity';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, User, Category])],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
