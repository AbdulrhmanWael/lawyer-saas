import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('staff_members')
export class StaffMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  position: string;

  @Column({ nullable: true })
  practiceArea: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'text', nullable: true })
  bio: string;
}
