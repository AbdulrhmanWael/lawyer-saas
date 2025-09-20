// staff-member.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PracticeArea } from 'src/practice-areas/practice-area.entity';

@Entity('staff_members')
export class StaffMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  position: string;

  @ManyToOne(() => PracticeArea, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'practiceAreaId' })
  practiceArea: PracticeArea | null;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  bio: Record<string, string>;

  @Column({ default: 0 })
  order: number;
}
