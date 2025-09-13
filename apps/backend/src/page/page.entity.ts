import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  content: string;

  @Column({ default: true })
  isActive: boolean;
}
