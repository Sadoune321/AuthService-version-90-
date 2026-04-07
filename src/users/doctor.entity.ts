import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('doctors')
export class Doctor {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, nullable: false })
  serialNumber!: string;

  @Column()
  speciality!: string;

  @Column()
  establishment!: string;

  @OneToOne(() => User, (user) => user.doctor)
  @JoinColumn()
  user!: User;
}