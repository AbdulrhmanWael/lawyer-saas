import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../blogs/blog.entity';
import { User } from '../users/user.entity';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async globalSearch(query: string, locale: string = 'en') {
    const cacheKey = `search:${locale}:${query}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const blogs = await this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.author', 'author')
      .where(`blog.title ->> :locale ILIKE :q`, { locale, q: `%${query}%` })
      .orWhere(`blog.content ->> :locale ILIKE :q`, { locale, q: `%${query}%` })
      .getMany();

    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.name ILIKE :q OR user.email ILIKE :q', { q: `%${query}%` })
      .getMany();

    const result = { blogs, users };
    await this.cacheManager.set(cacheKey, result, 120);
    return result;
  }
}
