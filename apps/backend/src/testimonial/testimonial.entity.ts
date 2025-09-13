import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('testimonials')
export class Testimonial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  person: string;

  @Column({ type: 'text' })
  quote: string;

  @Column({ type: 'int', default: 5 })
  rating: number;

  @Column({ nullable: true })
  imageUrl: string;
}
