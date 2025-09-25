import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('privacy_policy')
export class PrivacyPolicy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb', default: {} })
  content: Record<string, string>;
}
