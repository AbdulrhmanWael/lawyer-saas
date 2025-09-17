import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from '../blogs/blog.entity';
import { User } from '../users/user.entity';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, User])],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
