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

  @Column({ nullable: true })
  metaTitle: string;

  @Column({ nullable: true })
  metaDescription: string;

  @Column({ type: 'jsonb', default: {} })
  footer: {
    email?: string;
    phone?: string;
    social?: Record<string, string>;
    address?: string;
  };

  @Column({ type: 'jsonb', default: {} })
  colors: {
    light: {
      colorPrimary?: string;
      colorSecondary?: string;
      colorAccent?: string;
      colorBg?: string;
      colorText?: string;
    };
    dark?: {
      colorPrimary?: string;
      colorSecondary?: string;
      colorAccent?: string;
      colorBg?: string;
      colorText?: string;
    };
  };

  @UpdateDateColumn()
  updatedAt: Date;
}
