import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Patient } from './patient.entity';
import { Doctor } from './doctor.entity';
import { Role } from '../common/role.enum';
import { hashPassword } from '../common/hash.util';
import { BloodGroup } from '../common/BloodGroup.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,

    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['patient', 'doctor'],
    });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { googleId },
      relations: ['patient', 'doctor'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });
  }

  async createPatient(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    bloodType?: BloodGroup;
    gender?: string;
  }): Promise<User> {
    const hashedPassword = await hashPassword(data.password);

    const user = this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: Role.PATIENT,
    });

    await this.userRepository.save(user);

    const bloodType: BloodGroup | undefined =
      data.bloodType &&
      Object.values(BloodGroup).includes(data.bloodType as BloodGroup)
        ? (data.bloodType as BloodGroup)
        : undefined;

    const patient = this.patientRepository.create({
      phoneNumber: data.phoneNumber,
      bloodType: bloodType,
      gender: data.gender,
      user: user,
    });

    await this.patientRepository.save(patient);
    return user;
  }

  async createDoctor(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    speciality: string;
    establishment?: string;
  }): Promise<User> {
    const hashedPassword = await hashPassword(data.password);

    const user = this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: Role.DOCTOR,
    });

    await this.userRepository.save(user);

    const doctor = this.doctorRepository.create({
      speciality: data.speciality,
      establishment: data.establishment,
      user: user,
    });

    await this.doctorRepository.save(doctor);
    return user;
  }

  async createGoogleUser(data: {
    email: string;
    googleId: string;
    role: Role;
    firstName?: string;  // ← ajouté
    lastName?: string;   // ← ajouté
  }): Promise<User> {
    const user = this.userRepository.create({
      email: data.email,
      googleId: data.googleId,
      role: data.role,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      password: '',
    });
    await this.userRepository.save(user);
    return user;
  }

  async updatePatientProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      bloodType?: BloodGroup;
      gender?: string;
    },
  ): Promise<void> {
    const user = await this.findById(userId);
    if (!user || !user.patient) {
      throw new NotFoundException('Patient not found');
    }

    if (data.firstName || data.lastName) {
      await this.userRepository.update(
        { id: userId },
        {
          ...(data.firstName && { firstName: data.firstName }),
          ...(data.lastName && { lastName: data.lastName }),
        },
      );
    }

    const patientUpdate: Partial<Patient> = {
      ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber }),
      ...(data.gender !== undefined && { gender: data.gender }),
      ...(data.bloodType &&
        Object.values(BloodGroup).includes(data.bloodType) && {
          bloodType: data.bloodType,
        }),
    };

    if (Object.keys(patientUpdate).length > 0) {
      await this.patientRepository.update(
        { id: user.patient.id },
        patientUpdate,
      );
    }
  }

  async updateDoctorProfile(
    userId: string,
    data: {
      speciality?: string;
      establishment?: string;
    },
  ): Promise<void> {
    const user = await this.findById(userId);
    if (!user || !user.doctor) {
      throw new NotFoundException('Doctor not found');
    }

    await this.doctorRepository.update({ id: user.doctor.id }, data);
  }
}