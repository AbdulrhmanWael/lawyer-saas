import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { User } from '../users/user.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json', default: {} })
  title: Record<string, string>;

  @ManyToOne(() => Category, (category) => category.blogs, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => User, (user) => user.blogs, { eager: true })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ type: 'json', default: {} })
  content: Record<string, string>;

  @Column({ default: false })
  published: boolean;

  @Column({ default: true })
  draft: boolean;

  @Column({ default: false })
  inactive: boolean;

  @Column({ default: 0 })
  views: number;

  @CreateDateColumn()
  createdAt: Date;
}
