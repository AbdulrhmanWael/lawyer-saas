import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('carousel_items')
export class CarouselItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  subtitle: string;

  @Column()
  imageUrl: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;
}
