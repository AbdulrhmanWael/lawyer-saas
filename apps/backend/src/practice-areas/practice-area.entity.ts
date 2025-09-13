import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PracticeArea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'jsonb', default: {} })
  title: Record<string, string>;

  @Column({ type: 'jsonb', default: {} })
  excerpt: Record<string, string>;

  @Column({ type: 'text', nullable: true })
  contentHtml: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  coverImageUrl: string;

  @Column({ type: 'jsonb', default: {} })
  seoMeta: {
    title?: Record<string, string>;
    description?: Record<string, string>;
    canonical?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
