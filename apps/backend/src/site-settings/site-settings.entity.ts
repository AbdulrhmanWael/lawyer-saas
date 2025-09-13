import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SiteSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ type: 'jsonb', default: {} })
  footer: {
    email?: string;
    phone?: string;
    social?: Record<string, string>;
  };

  @UpdateDateColumn()
  updatedAt: Date;
}
