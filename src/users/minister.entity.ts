import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('minister')
export class Minister {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  serialNumber!: string;

  @Column({ nullable: true })
  fullName!: string;

  @Column({ nullable: true })
  speciality!: string;

  @Column({ default: false })
  isUsed!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}