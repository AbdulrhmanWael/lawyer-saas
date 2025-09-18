import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FaqGroup } from './faq-group.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Faq {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  question: Record<string, string>;

  @Column({ type: 'jsonb' })
  answer: Record<string, string>;

  @ManyToOne(() => FaqGroup, (group) => group.faqs, { onDelete: 'CASCADE' })
  @Exclude()
  group: FaqGroup;

  @Index({ fulltext: true })
  @Column({ type: 'tsvector', select: false, nullable: true })
  searchVector: string;
}
