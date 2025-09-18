import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  title: string;

  @Column('text')
  details: string;

  @Column({ default: true })
  unread: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
