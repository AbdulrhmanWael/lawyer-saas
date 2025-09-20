import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('carousel_items')
export class CarouselItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb', nullable: true })
  paragraph: Record<string, string>;

  @Column()
  imageUrl: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  isActive: boolean;
}
