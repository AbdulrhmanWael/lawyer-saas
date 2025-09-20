// practice-area.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { StaffMember } from '../staff-member/staff-member.entity';
import { Exclude } from 'class-transformer';

@Entity('practice_areas')
export class PracticeArea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'jsonb', default: {} })
  title: Record<string, string>;

  @Column({ type: 'jsonb', default: {} })
  excerpt: Record<string, string>;

  @Column({ type: 'jsonb', default: {} })
  contentHtml: Record<string, string>;

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

  @OneToMany(() => StaffMember, (staff) => staff.practiceArea)
  @Exclude()
  staffMembers: StaffMember[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
