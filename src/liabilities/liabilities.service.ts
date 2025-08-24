import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, MoreThan } from 'typeorm';
import { Liabilities } from './liabilities.entity';
import { CreateLiabilityDto } from './dto/create-liabilities.dto';
import { UpdateLiabilityDto } from './dto/update-liabilities.dto';

@Injectable()
export class LiabilitiesService {
  constructor(
    @InjectRepository(Liabilities)
    private readonly liabilitiesRepository: Repository<Liabilities>,
  ) {}

  async create(createLiabilityDto: CreateLiabilityDto): Promise<Liabilities> {
    try {
      const liability = this.liabilitiesRepository.create(createLiabilityDto);
      return await this.liabilitiesRepository.save(liability);
    } catch (error) {
      throw new InternalServerErrorException('Error creating liability', error.message);
    }
  }

  async update(id: string, updateLiabilityDto: UpdateLiabilityDto): Promise<Liabilities> {
    try {
      const liability = await this.liabilitiesRepository.preload({
        id: +id,
        ...updateLiabilityDto,
      });

      if (!liability) {
        throw new NotFoundException(`Liability with id ${id} not found`);
      }

      return await this.liabilitiesRepository.save(liability);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating liability', error.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.liabilitiesRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Liability with id ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting liability', error.message);
    }
  }

  async findOneByUser(id: number, userId: number): Promise<Liabilities> {
    try {
      const liability = await this.liabilitiesRepository.findOne({ where: { id, userId } });
      if (!liability) {
        throw new NotFoundException(`Liability with id ${id} not found for this user`);
      }
      return liability;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching liability', error.message);
    }
  }

  async findByUser(userId: number): Promise<Liabilities[]> {
    try {
      return await this.liabilitiesRepository.find({ where: { userId } });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user liabilities', error.message);
    }
  }

  async findByUserAndStatus(userId: number, status: string): Promise<Liabilities[]> {
    try {
      if (status === 'paid') {
        return await this.liabilitiesRepository.find({ where: { userId, totalDue: 0 } });
      } else if (status === 'pending') {
        return await this.liabilitiesRepository.find({ where: { userId, totalDue: MoreThan(0) } });
      } else {
        return [];
      }
    } catch (error) {
      throw new InternalServerErrorException('Error fetching liabilities by status', error.message);
    }
  }

  async findUserSummary(userId: number) {
    try {
      const liabilities = await this.findByUser(userId);

      return {
        totalLiabilities: liabilities.length,
        totalAmount: liabilities.reduce((acc, l) => acc + Number(l.amount), 0),
        totalPaid: liabilities.reduce((acc, l) => acc + Number(l.totalPaid), 0),
        totalDue: liabilities.reduce((acc, l) => acc + Number(l.totalDue), 0),
        installmentsPaid: liabilities.reduce((acc, l) => acc + l.installmentsPaid, 0),
        installmentsDue: liabilities.reduce((acc, l) => acc + l.installmentsDue, 0),
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user summary', error.message);
    }
  }

  async findByKeyword(userId: number, keyword: string): Promise<Liabilities[]> {
    try {
      return await this.liabilitiesRepository.find({
        where: { userId, description: Like(`%${keyword}%`) },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error searching liabilities', error.message);
    }
  }

  async findByAmountRange(userId: number, min: number, max: number): Promise<Liabilities[]> {
    try {
      return await this.liabilitiesRepository.find({
        where: { userId, amount: Between(min, max) },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching liabilities by amount range', error.message);
    }
  }

  async findByInstallmentsDue(userId: number, min: number, max: number): Promise<Liabilities[]> {
    try {
      return await this.liabilitiesRepository.find({
        where: { userId, installmentsDue: Between(min, max) },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching liabilities by installments due', error.message);
    }
  }

  async findByDateRange(userId: number, start: string, end: string): Promise<Liabilities[]> {
    try {
      return await this.liabilitiesRepository.find({
        where: { userId, createdAt: Between(new Date(start), new Date(end)) },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching liabilities by date range', error.message);
    }
  }
}
