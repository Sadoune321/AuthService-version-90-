import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Minister } from './minister.entity';

@Injectable()
export class MinisterService {

  constructor(
    @InjectRepository(Minister)
    private readonly ministerRepository: Repository<Minister>,
  ) {}

  // ─── Vérifier si matricule existe ─────────────────────
  async isValidSerialNumber(serialNumber: string): Promise<boolean> {
    const entry = await this.ministerRepository.findOne({
      where: { serialNumber },
    });
    return !!entry;
  }

  // ─── Vérifier si matricule déjà utilisé ───────────────
  async isAlreadyUsed(serialNumber: string): Promise<boolean> {
    const entry = await this.ministerRepository.findOne({
      where: { serialNumber, isUsed: true },
    });
    return !!entry;
  }

  // ─── Marquer matricule comme utilisé ──────────────────
  async markAsUsed(serialNumber: string): Promise<void> {
    await this.ministerRepository.update(
      { serialNumber },
      { isUsed: true },
    );
  }
}