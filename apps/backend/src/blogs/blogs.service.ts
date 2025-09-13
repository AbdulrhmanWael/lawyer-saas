import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere, FindManyOptions } from 'typeorm';
import { Blog } from './blog.entity';
import { Category } from '../categories/category.entity';
import { User } from '../users/user.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogResponse } from './dto/blog-response.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogsRepo: Repository<Blog>,
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findAll(
    page?: number,
    limit?: number,
    categoryId?: string,
    search?: string,
  ): Promise<{
    response: BlogResponse[];
    total: number;
    page?: number;
    limit?: number;
  }> {
    const where: FindOptionsWhere<Blog> = {};

    if (categoryId) where.category = { id: categoryId };
    if (search) where.title = ILike(`%${search}%`);

    const options: FindManyOptions<Blog> = {
      where,
      order: { createdAt: 'DESC' },
      relations: ['author', 'category'],
    };

    if (page && limit) {
      options.skip = (page - 1) * limit;
      options.take = limit;
    }

    const [data, total] = await this.blogsRepo.findAndCount(options);
    const response: BlogResponse[] = data.map((blog) => ({
      ...blog,
      author: blog.author.name,
      category: blog.category.name,
    }));

    return {
      response,
      total,
      ...(page !== undefined && { page }),
      ...(limit !== undefined && { limit }),
    };
  }

  async findOne(id: string): Promise<BlogResponse> {
    const blog = await this.blogsRepo.findOne({
      where: { id },
      relations: ['author', 'category'],
    });
    if (!blog) throw new NotFoundException(`Blog with ID ${id} not found`);
    return { ...blog, author: blog.author.name, category: blog.category.name };
  }

  async create(
    createDto: CreateBlogDto,
    authorId: string,
  ): Promise<BlogResponse> {
    const category = await this.categoriesRepo.findOneBy({
      id: createDto.categoryId,
    });
    const author = await this.usersRepo.findOneBy({ id: authorId });

    if (!category) throw new NotFoundException('Category not found');
    if (!author) throw new NotFoundException('Author not found');

    const blog = this.blogsRepo.create({
      title: createDto.title,
      content: createDto.content,
      coverImage: createDto.coverImage,
      category,
      author,
    });
    await this.blogsRepo.save(blog);
    return { ...blog, author: blog.author.name, category: blog.category.name };
  }

  async update(
    id: string,
    updateDto: UpdateBlogDto,
    authorId: string,
  ): Promise<BlogResponse> {
    const category = updateDto.categoryId
      ? await this.categoriesRepo.findOneBy({ id: updateDto.categoryId })
      : undefined;

    const author = authorId
      ? await this.usersRepo.findOneBy({ id: authorId })
      : undefined;

    if (updateDto.categoryId && !category)
      throw new NotFoundException('Category not found');
    if (authorId && !author) throw new NotFoundException('Author not found');

    const blog = await this.blogsRepo.preload({
      id,
      ...updateDto,
      ...(category ? { category } : {}),
      ...(author ? { author } : {}),
    });

    if (!blog) throw new NotFoundException(`Blog with ID ${id} not found`);

    await this.blogsRepo.save(blog);
    return { ...blog, author: blog.author.name, category: blog.category.name };
  }

  async remove(id: string): Promise<void> {
    const blog = await this.blogsRepo.findOne({
      where: { id },
      relations: ['author', 'category'],
    });
    if (!blog) return;
    await this.blogsRepo.remove(blog);
  }
}
