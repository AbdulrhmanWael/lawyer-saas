import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Blog } from 'src/blogs/blog.entity';
import { Role } from '../roles/role.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn()
  role: Role;

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];
}
