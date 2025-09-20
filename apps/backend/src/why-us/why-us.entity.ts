import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('why_us')
export class WhyUs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb', default: {} })
  title: Record<string, string>;

  @Column({ type: 'jsonb', default: {} })
  paragraph: Record<string, string>;

  @Column({ type: 'jsonb', default: {} })
  buttonText: Record<string, string>;

  @CreateDateColumn()
  createdAt: Date;
}
