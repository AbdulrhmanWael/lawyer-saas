import { Category } from '../../categories/category.entity';
export class BlogResponse {
  id: string;

  title: string | Record<string, string>;

  category: string | Category;

  draft: boolean;

  published: boolean;

  inactive: boolean;

  content: string | Record<string, string>;

  author: string;

  views: number;

  coverImage?: string;

  createdAt: Date;
}
