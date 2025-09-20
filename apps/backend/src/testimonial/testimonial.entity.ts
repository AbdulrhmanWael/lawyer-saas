import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('testimonials')
export class Testimonial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  person: string;

  @Column({ type: 'text' })
  quote: Record<string, string>;

  @Column({ type: 'int', default: 5 })
  rating: number;

  @Column({ nullable: true })
  imageUrl: string;
}
