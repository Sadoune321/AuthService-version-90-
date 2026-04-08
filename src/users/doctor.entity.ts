import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity('doctors')
export class Doctor {

  @PrimaryColumn('char', { length: 36 })
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

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
