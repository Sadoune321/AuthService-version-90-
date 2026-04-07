import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { MinisterService } from './minister.service';
import { User } from './user.entity';
import { Patient } from './patient.entity';
import { Doctor } from './doctor.entity';
import { Minister } from './minister.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Patient, Doctor, Minister]),
  ],
  providers: [UsersService, MinisterService],
  exports: [UsersService, MinisterService],
})
export class UsersModule {}