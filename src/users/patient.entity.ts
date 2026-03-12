import {
  Entity,
  OneToOne,
  JoinColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BloodGroup } from '../common/BloodGroup.enum';
import { User } from './user.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.patient, { cascade: true })
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ name: 'phone', nullable: true })
  phoneNumber: string;

  @Column({ name: 'bloodGroup', type: 'varchar', nullable: true })
  bloodType: BloodGroup;

  @Column({ nullable: true })
  gender: string;
}