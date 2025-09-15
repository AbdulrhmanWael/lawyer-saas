import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Blog } from '../blogs/blog.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json', default: {} })
  name: Record<string, string>;

  @OneToMany(() => Blog, (blog) => blog.category)
  blogs: Blog[];
}
