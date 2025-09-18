import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Faq } from './faq.entity';

@Entity()
export class FaqGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  title: Record<string, string>;

  @OneToMany(() => Faq, (faq) => faq.group, { cascade: true })
  faqs: Faq[];
}
