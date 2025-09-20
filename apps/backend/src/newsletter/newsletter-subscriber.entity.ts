import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('newsletter_subscribers')
@Unique(['email'])
export class NewsletterSubscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: true })
  active: boolean;
}
