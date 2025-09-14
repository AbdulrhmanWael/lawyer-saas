import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => Category, (category) => category.blogs, { eager: true })
  category: Category;

  @ManyToOne(() => User, (user) => user.blogs, { eager: true })
  author: User;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ type: 'json', default: {} })
  translations: Record<
    'EN' | 'AR' | 'DE' | 'RO' | 'RU' | 'ZH' | 'IT' | 'FR',
    string
  >;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  published: boolean;

  @Column({ default: true })
  draft: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
