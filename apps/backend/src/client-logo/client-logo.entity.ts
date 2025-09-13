import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('client_logos')
export class ClientLogo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;
}
