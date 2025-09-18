import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Blog } from './blog.entity';
import { User } from '../users/user.entity';

@Entity()
export class BlogView {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Blog, (blog) => blog.views, { eager: true })
  blog: Blog;

  @ManyToOne(() => User, { eager: true })
  viewer: User;

  @CreateDateColumn()
  createdAt: Date;
}
