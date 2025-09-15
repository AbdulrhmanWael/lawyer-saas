import { Category } from '../../categories/category.entity';
export class BlogResponse {
  id: string;

  title: string | Record<string, string>;

  category: string | Category;

  draft: boolean;

  published: boolean;

  content: string | Record<string, string>;

  author: string;

  coverImage?: string;

  createdAt: Date;
}
