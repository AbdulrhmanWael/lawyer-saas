import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Permission } from '../permissions/permission.entity';
import { User } from '../users/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    eager: true,
  })
  @JoinTable()
  permissions: Permission[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
