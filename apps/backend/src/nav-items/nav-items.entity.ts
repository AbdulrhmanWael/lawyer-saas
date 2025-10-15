import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('nav_items')
export class NavItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'jsonb' })
  label: Record<string, string>;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'uuid', nullable: true })
  parentId: string | null;

  @Column({ type: 'boolean', default: true })
  visible: boolean;
}
