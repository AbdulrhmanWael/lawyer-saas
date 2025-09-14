import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOptionsWhere, ILike } from 'typeorm';
import { Blog } from './blog.entity';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ImageService } from 'src/utils/image.service';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private readonly blogsRepo: Repository<Blog>,
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly imageService: ImageService,
  ) {}

  async findAll(
    page?: number,
    limit?: number,
    categoryId?: string,
    search?: string,
  ): Promise<{
    response: Blog[];
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
    return {
      response: data,
      total,
      ...(page && { page }),
      ...(limit && { limit }),
    };
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogsRepo.findOne({
      where: { id },
      relations: ['author', 'category'],
    });
    if (!blog) throw new NotFoundException(`Blog with ID ${id} not found`);
    return blog;
  }

  async create(
    dto: CreateBlogDto,
    authorId: string,
    fileBuffer?: Buffer,
  ): Promise<Blog> {
    const category = await this.categoriesRepo.findOneBy({
      id: dto.categoryId,
    });
    const author = await this.usersRepo.findOneBy({ id: authorId });
    if (!category) throw new NotFoundException('Category not found');
    if (!author) throw new NotFoundException('Author not found');

    let coverImage: string | undefined;
    if (fileBuffer) coverImage = await this.imageService.saveImage(fileBuffer);

    const blog = this.blogsRepo.create({
      ...dto,
      coverImage,
      author,
      category,
      draft: dto.draft ?? true,
      published: dto.published ?? false,
    });

    return await this.blogsRepo.save(blog);
  }

  async update(
    id: string,
    dto: UpdateBlogDto,
    authorId?: string,
    fileBuffer?: Buffer,
  ): Promise<Blog> {
    const blog = await this.blogsRepo.preload({ id, ...dto });
    if (!blog) throw new NotFoundException(`Blog with ID ${id} not found`);

    if (dto.categoryId) {
      const category = await this.categoriesRepo.findOneBy({
        id: dto.categoryId,
      });
      if (!category) throw new NotFoundException('Category not found');
      blog.category = category;
    }

    if (authorId) {
      const author = await this.usersRepo.findOneBy({ id: authorId });
      if (!author) throw new NotFoundException('Author not found');
      blog.author = author;
    }

    if (fileBuffer) {
      if (blog.coverImage) await this.imageService.deleteImage(blog.coverImage);
      blog.coverImage = await this.imageService.saveImage(fileBuffer);
    }

    return await this.blogsRepo.save(blog);
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
}
