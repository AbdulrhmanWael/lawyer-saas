import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mail_settings')
export class MailSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  host: string;

  @Column()
  port: number;

  @Column()
  user: string;

  @Column()
  pass: string;

  @Column()
  from: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
