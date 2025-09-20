import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
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

  @Column({ nullable: true })
  avatarUrl: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn()
  role: Role;

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  refreshTokenHash: string | null;

  @Column({ default: false })
  isGuest: boolean;
}
