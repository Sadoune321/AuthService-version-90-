import { IsString, IsOptional } from 'class-validator';

export class DoctorProfileDto {
  @IsString()
  speciality: string;

  @IsString()
  establishment: string;
}