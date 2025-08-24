import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Savings } from './savings.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateSavingsDto } from './dto/create-savings.dto';
import { UpdateFixedExpensesDto } from 'src/fixed-expenses/dto/update-fixed-expenses.dto';
import { UpdateSavingsDto } from './dto/update-savings.dto';

@Injectable()
export class SavingsService {
  private readonly logger = new Logger(SavingsService.name);
  constructor(
    @InjectRepository(Savings)
    private readonly savingsRepository: Repository<Savings>,
  ) {}

  async create(userId: number, createSavingsDto: CreateSavingsDto) {
    this.logger.log(`Creating a new savings entry for user ${userId}`);

    try {
      const newSavingsEntry = this.savingsRepository.create({
        ...createSavingsDto,
        userId,
      });
      const savingsEntry = await this.savingsRepository.save(newSavingsEntry);

      return {
        message: 'Savings entry created successfully',
        savingsEntry,
      };
    } catch (error) {
      this.logger.error(
        `Error creating savings entry for user ${userId}`,
        error,
      );
      throw new InternalServerErrorException('Failed to create savings entry');
    }
  }

  async update(userId: number, id: number, updateSavingsDto: UpdateSavingsDto) {
    this.logger.log(`Updating savings entry ${id} for user ${userId}`);

    try {
      const savingsEntry = await this.savingsRepository.findOne({
        where: { id, userId },
      });

      if (!savingsEntry) {
        throw new NotFoundException(
          `Savings entry with id ${id} not found for this user`,
        );
      }

      await this.savingsRepository.update(id, updateSavingsDto);

      return { message: 'Savings entry updated successfully' };
    } catch (error) {
      this.logger.error(
        `Error updating savings entry ${id} for user ${userId}`,
        error,
      );
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update savings entry');
    }
  }

  async remove(userId: number, id: number) {
    this.logger.log(`Removing savings entry ${id} for user ${userId}`);

    try {
      const savingsEntry = await this.savingsRepository.findOne({
        where: { id, userId },
      });

      if (!savingsEntry) {
        throw new NotFoundException(
          `Savings entry with id ${id} not found for this user`,
        );
      }

      await this.savingsRepository.delete(id);

      return { message: 'Savings entry removed successfully' };
    } catch (error) {
      this.logger.error(
        `Error removing savings entry ${id} for user ${userId}`,
        error,
      );
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to remove savings entry');
    }
  }

  findAll() {
    this.logger.log('Retrieving all savings entries');

    return this.savingsRepository
      .find()
      .then((savingsEntries) => ({
        message: 'Savings entries retrieved successfully',
        savingsEntries,
      }))
      .catch((error) => {
        this.logger.error('Error retrieving savings entries', error);
        throw error;
      });
  }

  findOne(id: number) {
    this.logger.log(`Retrieving savings entry with id ${id}`);

    return this.savingsRepository
      .findOne({ where: { id } })
      .then((savingsEntry) => {
        if (!savingsEntry) {
          throw new Error('Savings entry not found');
        }
        return {
          message: 'Savings entry retrieved successfully',
          savingsEntry,
        };
      })
      .catch((error) => {
        this.logger.error('Error retrieving savings entry', error);
        throw error;
      });
  }

  findByUser(userId: number) {
    this.logger.log(`Retrieving savings entries for user with id ${userId}`);

    return this.savingsRepository
      .find({ where: { userId } })
      .then((savingsEntries) => ({
        message: 'Savings entries retrieved successfully',
        savingsEntries,
      }))
      .catch((error) => {
        this.logger.error('Error retrieving savings entries', error);
        throw error;
      });
  }

  findTotalByUser(userId: number) {
    this.logger.log(`Retrieving total savings for user with id ${userId}`);

    return this.savingsRepository
      .createQueryBuilder('savings')
      .select('SUM(savings.amount)', 'total')
      .where('savings.userId = :userId', { userId })
      .getRawOne()
      .then((result) => ({
        message: 'Total savings retrieved successfully',
        total: result.total,
      }))
      .catch((error) => {
        this.logger.error('Error retrieving total savings', error);
        throw error;
      });
  }

  findByUserAndYear(userId: number, year: number) {
    this.logger.log(
      `Retrieving savings entries for user with id ${userId} and year ${year}`,
    );

    return this.savingsRepository
      .find({
        where: {
          userId,
          createdIn: Between(
            `${year}-01-01T00:00:00.000Z`,
            `${year + 1}-01-01T00:00:00.000Z`,
          ),
        },
      })
      .then((savingsEntries) => ({
        message: 'Savings entries retrieved successfully',
        savingsEntries,
      }))
      .catch((error) => {
        this.logger.error('Error retrieving savings entries', error);
        throw error;
      });
  }

  findByUserAndMonthAndYear(userId: number, month: string, year: string) {
    this.logger.log(
      `Retrieving savings entries for user with id ${userId}, month ${month}, and year ${year}`,
    );

    return this.savingsRepository
      .find({
        where: {
          userId,
          createdIn: Between(
            `${year}-${month}-01T00:00:00.000Z`,
            `${year}-${month}-31T23:59:59.999Z`,
          ),
        },
      })
      .then((savingsEntries) => ({
        message: 'Savings entries retrieved successfully',
        savingsEntries,
      }))
      .catch((error) => {
        this.logger.error('Error retrieving savings entries', error);
        throw error;
      });
  }

  findTotalByUserAndMonth(userId: number, month: string) {
    this.logger.log(
      `Retrieving total savings for user with id ${userId} and month ${month}`,
    );

    return this.savingsRepository
      .createQueryBuilder('savings')
      .select('SUM(savings.amount)', 'total')
      .where('savings.userId = :userId', { userId })
      .andWhere('EXTRACT(MONTH FROM savings.createdIn) = :month', { month })
      .getRawOne()
      .then((result) => ({
        message: 'Total savings retrieved successfully',
        total: result.total,
      }))
      .catch((error) => {
        this.logger.error('Error retrieving total savings', error);
        throw error;
      });
  }

  findTotalByUserAndYear(userId: number, year: string) {
    this.logger.log(
      `Retrieving total savings for user with id ${userId} and year ${year}`,
    );

    return this.savingsRepository
      .createQueryBuilder('savings')
      .select('SUM(savings.amount)', 'total')
      .where('savings.userId = :userId', { userId })
      .andWhere('EXTRACT(YEAR FROM savings.createdIn) = :year', { year })
      .getRawOne()
      .then((result) => ({
        message: 'Total savings retrieved successfully',
        total: result.total,
      }))
      .catch((error) => {
        this.logger.error('Error retrieving total savings', error);
        throw error;
      });
  }

  findTotalByUserAndMonthAndYear(userId: number, month: string, year: string) {
    this.logger.log(
      `Retrieving total savings for user with id ${userId}, month ${month}, and year ${year}`,
    );

    return this.savingsRepository
      .createQueryBuilder('savings')
      .select('SUM(savings.amount)', 'total')
      .where('savings.userId = :userId', { userId })
      .andWhere('EXTRACT(MONTH FROM savings.createdIn) = :month', { month })
      .andWhere('EXTRACT(YEAR FROM savings.createdIn) = :year', { year })
      .getRawOne()
      .then((result) => ({
        message: 'Total savings retrieved successfully',
        total: result.total,
      }))
      .catch((error) => {
        this.logger.error('Error retrieving total savings', error);
        throw error;
      });
  }
}
