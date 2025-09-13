import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('translations')
export class Translation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  language: string;

  @Column()
  field: string;

  @Column('text')
  value: string;

  @Column()
  referenceId: number;

  @Column()
  referenceType: string;
}
