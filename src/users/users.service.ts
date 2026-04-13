import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Patient } from './patient.entity';
import { Doctor } from './doctor.entity';
import { Role } from '../common/role.enum';
import { hashPassword } from '../common/hash.util';
import { BloodType } from '../common/BloodGroup.enum';

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
    bloodType?: BloodType;
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

    const bloodType: BloodType | undefined =
      data.bloodType &&
      Object.values(BloodType).includes(data.bloodType as BloodType)
        ? (data.bloodType as BloodType)
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
    serialNumber: string;
    speciality: string;
    establishment: string;
  }): Promise<User> {
    const hashedPassword = await hashPassword(data.password);

    const user = this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      role: Role.DOCTOR,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    await this.userRepository.save(user);

    const doctor = this.doctorRepository.create({
      serialNumber: data.serialNumber,
      speciality: data.speciality,
      establishment: data.establishment,
      user,
    });
    await this.doctorRepository.save(doctor);

    return user;
  }

  async createGoogleUser(data: {
    email: string;
    googleId: string;
    role: Role;
    firstName?: string;
    lastName?: string;
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
      password?: string;
      phoneNumber?: string;
      bloodType?: BloodType;
      gender?: string;
    },
  ): Promise<void> {
    const user = await this.findById(userId);
    if (!user || !user.patient) {
      throw new NotFoundException('Patient not found');
    }

    const userUpdate: Partial<User> = {};
    if (data.firstName) userUpdate.firstName = data.firstName;
    if (data.lastName) userUpdate.lastName = data.lastName;
    if (data.password) userUpdate.password = await hashPassword(data.password);

    if (Object.keys(userUpdate).length > 0) {
      await this.userRepository.update({ id: userId }, userUpdate);
    }

    const patientUpdate: Partial<Patient> = {};
    if (data.phoneNumber !== undefined) patientUpdate.phoneNumber = data.phoneNumber;
    if (data.gender !== undefined) patientUpdate.gender = data.gender;
    if (data.bloodType && Object.values(BloodType).includes(data.bloodType)) {
      patientUpdate.bloodType = data.bloodType;
    }

    if (Object.keys(patientUpdate).length > 0) {
      await this.patientRepository.update({ id: user.patient.id }, patientUpdate);
    }
  }

  async updateDoctorProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      password?: string;
      speciality?: string;
      establishment?: string;
    },
  ): Promise<void> {
    const user = await this.findById(userId);
    if (!user || !user.doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const userUpdate: Partial<User> = {};
    if (data.firstName) userUpdate.firstName = data.firstName;
    if (data.lastName) userUpdate.lastName = data.lastName;
    if (data.password) userUpdate.password = await hashPassword(data.password);

    if (Object.keys(userUpdate).length > 0) {
      await this.userRepository.update({ id: userId }, userUpdate);
    }

    const doctorUpdate: Partial<Doctor> = {};
    if (data.speciality !== undefined) doctorUpdate.speciality = data.speciality;
    if (data.establishment !== undefined) doctorUpdate.establishment = data.establishment;

    if (Object.keys(doctorUpdate).length > 0) {
      await this.doctorRepository.update({ id: user.doctor.id }, doctorUpdate);
    }
  }

 

  async findAllIdsByRole(role: Role): Promise<{ ids: string[] }> {
    const users = await this.userRepository.find({
      where: { role },
      select: ['id'],
    });
    return { ids: users.map((u) => u.id) };
  }
}
