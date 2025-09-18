import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class PageView {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  page?: string;

  @Column({ nullable: true })
  userId?: string;

  @Column()
  ip: string;

  @CreateDateColumn()
  createdAt: Date;
}
