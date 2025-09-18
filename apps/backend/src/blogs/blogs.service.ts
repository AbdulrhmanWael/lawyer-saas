import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere, ILike } from 'typeorm';
import { Blog } from './blog.entity';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ImageService } from 'src/utils/image.service';
import { BlogResponse } from './dto/blog-response.dto';
import { BlogView } from './blog-view.entity';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import AuthRequest from 'src/auth/auth.request';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private readonly blogsRepo: Repository<Blog>,
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(BlogView)
    private readonly blogViewRepo: Repository<BlogView>,
    private readonly imageService: ImageService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(
    page?: number,
    limit?: number,
    categoryId?: string,
    search?: string,
    locale: string = 'EN',
  ): Promise<{
    response: BlogResponse[];
    total: number;
    page?: number;
    limit?: number;
  }> {
    const where: FindOptionsWhere<Blog> = {};

    if (categoryId) where.category = { id: categoryId };

    if (search) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where.title = { [locale]: ILike(`%${search}%`) } as any;
    }

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
    return {
      response: data.map((blog) => ({
        ...blog,
        author: blog.author.name,
        category: blog.category.name[locale] ?? blog.category.name['EN'],
        title: blog.title[locale] ?? blog.title['EN'],
        content: blog.content[locale] ?? blog.content['EN'],
      })),
      total,
      ...(page && { page }),
      ...(limit && { limit }),
    };
  }

  async findOne(id: string, locale?: string): Promise<BlogResponse> {
    const blog = await this.blogsRepo.findOne({
      where: { id },
      relations: ['author', 'category'],
    });
    if (!blog) throw new NotFoundException(`Blog with ID ${id} not found`);
    if (locale) return this.localizeBlog(blog, locale);
    else
      return {
        ...blog,
        author: blog.author.name,
        category: blog.category,
        title: blog.title,
        content: blog.content,
      };
  }

  async findOneWithViews(
    id: string,
    req: AuthRequest,
    res: Response,
    locale?: string,
  ) {
    const blog = await this.blogsRepo.findOne({
      where: { id },
      relations: ['author', 'category'],
    });
    if (!blog) throw new NotFoundException(`Blog not found`);

    const user =
      req.user ?? (await this.usersService.getOrCreateGuest(req, res));

    const existing = await this.blogViewRepo.findOne({
      where: { blog: { id: blog.id }, viewer: { id: user.id } },
    });

    if (!existing) {
      const blogView = this.blogViewRepo.create({ blog, viewer: user });
      await this.blogViewRepo.save(blogView);

      blog.views++;
      await this.blogsRepo.save(blog);
    }

    if (locale) return this.localizeBlog(blog, locale);
    else
      return {
        ...blog,
        author: blog.author.name,
        category: blog.category,
        title: blog.title,
        content: blog.content,
      };
  }

  async create(
    dto: CreateBlogDto,
    authorId: string,
    locale?: string,
    fileBuffer?: Buffer,
  ): Promise<BlogResponse> {
    const category = await this.categoriesRepo.findOneBy({
      id: dto.categoryId,
    });
    const author = await this.usersRepo.findOneBy({ id: authorId });
    if (!category) throw new NotFoundException('Category not found');
    if (!author) throw new NotFoundException('Author not found');

    let coverImage: string | undefined;
    if (fileBuffer) coverImage = await this.imageService.saveImage(fileBuffer);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsedTitle: Record<string, string> =
      typeof dto.title === 'string' ? JSON.parse(dto.title) : dto.title;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsedContent: Record<string, string> =
      typeof dto.content === 'string' ? JSON.parse(dto.content) : dto.content;

    const blog = this.blogsRepo.create({
      ...dto,
      title: parsedTitle,
      content: parsedContent,
      coverImage,
      author,
      category,
      draft: dto.draft ?? true,
      published: dto.published ?? false,
    });
    author.blogs.push(blog);
    await this.usersRepo.save(author);
    await this.blogsRepo.save(blog);

    if (locale) return this.localizeBlog(blog, locale);
    else
      return {
        ...blog,
        author: blog.author.name,
        category: blog.category,
        title: blog.title,
        content: blog.content,
      };
  }

  async update(
    id: string,
    dto: UpdateBlogDto,
    locale?: string,
    fileBuffer?: Buffer,
  ): Promise<BlogResponse> {
    const existingBlog = await this.blogsRepo.findOne({
      where: { id },
      relations: ['author', 'category'],
    });
    if (!existingBlog) throw new NotFoundException('Blog not found');
    const blog = await this.blogsRepo.preload({
      id,
      ...dto,
      author: existingBlog.author,
      category: existingBlog.category,
    });
    if (!blog) throw new NotFoundException(`Blog with ID ${id} not found`);

    if (dto.categoryId) {
      const category = await this.categoriesRepo.findOneBy({
        id: dto.categoryId,
      });
      if (!category) throw new NotFoundException('Category not found');
      blog.category = category;
    }
    if (fileBuffer) {
      if (blog.coverImage) await this.imageService.deleteImage(blog.coverImage);
      blog.coverImage = await this.imageService.saveImage(fileBuffer);
    }

    if (dto.title) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      blog.title =
        typeof dto.title === 'string' ? JSON.parse(dto.title) : dto.title;
    }

    if (dto.content) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      blog.content =
        typeof dto.content === 'string' ? JSON.parse(dto.content) : dto.content;
    }
    function parseBoolean(value: boolean | string | undefined): boolean {
      if (value === undefined) return false; // or preserve existing value
      return value === true || value === 'true';
    }

    if (dto.published !== undefined)
      blog.published = parseBoolean(dto.published);
    if (dto.draft !== undefined) blog.draft = parseBoolean(dto.draft);
    if (dto.inactive !== undefined) blog.inactive = parseBoolean(dto.inactive);

    await this.blogsRepo.save(blog);

    if (locale) return this.localizeBlog(blog, locale);
    else
      return {
        ...blog,
        author: blog.author.name,
        category: blog.category,
        title: blog.title,
        content: blog.content,
      };
  }

  async remove(id: string) {
    const blog = await this.blogsRepo.findOneBy({ id });
    if (!blog) return;
    if (blog.coverImage) await this.imageService.deleteImage(blog.coverImage);
    await this.blogsRepo.remove(blog);
  }

  async setPublishStatus(id: string, status: boolean) {
    const blog = await this.blogsRepo.findOneBy({ id });
    if (!blog) throw new NotFoundException('Blog not found');

    blog.published = status;
    blog.draft = !status;

    return this.blogsRepo.save(blog);
  }

  private localizeBlog(blog: Blog, locale?: string) {
    if (!locale)
      return {
        ...blog,
        author: blog.author.name,
        category: blog.category,
        title: blog.title,
        content: blog.content,
      };

    return {
      ...blog,
      author: blog.author.name,
      category: blog.category.name[locale] ?? blog.category.name['EN'],
      title: blog.title[locale] ?? blog.title['EN'],
      content: blog.content[locale] ?? blog.content['EN'],
    };
  }
}
