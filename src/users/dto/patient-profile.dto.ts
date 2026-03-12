import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum Gender {
  MALE   = 'male',
  FEMALE = 'female',
}

export enum BloodGroup {
  A_POS  = 'A+',
  A_NEG  = 'A-',
  B_POS  = 'B+',
  B_NEG  = 'B-',
  AB_POS = 'AB+',
  AB_NEG = 'AB-',
  O_POS  = 'O+',
  O_NEG  = 'O-',
}

export class PatientProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsEnum(BloodGroup)
  bloodGroup?: BloodGroup;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}