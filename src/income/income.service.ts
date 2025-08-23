import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Income } from './income.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomeService {
  private readonly logger = new Logger(IncomeService.name);

  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  create(createIncomeDto: CreateIncomeDto) {
    this.logger.log('Creating a new income');

    const newIncome = this.incomeRepository.create(createIncomeDto);
    return this.incomeRepository
      .save(newIncome)
      .then((income) => ({
        message: 'Income created successfully',
        income,
      }))
      .catch((error) => {
        this.logger.error('Error creating income', error);
        throw error;
      });
  }

  update(id: number, updateIncomeDto: UpdateIncomeDto) {
    this.logger.log('Updating income');

    return this.incomeRepository
      .update(id, updateIncomeDto)
      .then(() => ({
        message: 'Income updated successfully',
      }))
      .catch((error) => {
        this.logger.error('Error updating income', error);
        throw error;
      });
  }

  delete(id: number) {
    this.logger.log('Deleting income');

    return this.incomeRepository
      .delete(id)
      .then(() => ({
        message: 'Income deleted successfully',
      }))
      .catch((error) => {
        this.logger.error('Error deleting income', error);
        throw error;
      });
  }

  findAll() {
    this.logger.log('Finding all incomes');

    return this.incomeRepository
      .find()
      .then((incomes) => ({
        message: 'Incomes retrieved successfully',
        incomes,
      }))
      .catch((error) => {
        this.logger.error('Error finding incomes', error);
        throw error;
      });
  }

  async findById(id: number) {
    this.logger.log(`Finding income with id ${id}`);

    try {
      const income = await this.incomeRepository.findOne({ where: { id } });
      if (!income) {
        throw new Error('Income not found');
      }
      return {
        message: 'Income retrieved successfully',
        income,
      };
    } catch (error) {
      this.logger.error('Error finding income', error);
      throw error;
    }
  }

  findOne(id: number) {
    this.logger.log(`Finding income with id ${id}`);
    return this.incomeRepository.findOne({ where: { id } });
  }

  findByUser(id: number) {
    this.logger.log(`Finding incomes for user with id ${id}`);
    return this.incomeRepository.find({ where: { userId: id } });
  }

  findByCategory(category: string) {
    this.logger.log(`Finding incomes for category ${category}`);
    return this.incomeRepository.find({ where: { category } });
  }

  async findByUserAndMonth(userId: number, month: string) {
    this.logger.log(`Finding incomes for user ${userId} and month ${month}`);
    try {
      const incomes = await this.incomeRepository.find({
        where: { userId, referenceMonth: month },
      });
      return {
        message: 'Incomes retrieved successfully',
        incomes,
      };
    } catch (error) {
      this.logger.error(
        `Error finding incomes for user ${userId} and month ${month}`,
        error,
      );
      throw new Error('Failed to retrieve incomes');
    }
  }

  async findByUserAndYear(userId: number, year: string) {
    this.logger.log(`Finding incomes for user ${userId} and year ${year}`);
    try {
      const incomes = await this.incomeRepository.find({
        where: { userId, referenceYear: year },
      });
      return {
        message: 'Incomes retrieved successfully',
        incomes,
      };
    } catch (error) {
      this.logger.error(
        `Error finding incomes for user ${userId} and year ${year}`,
        error,
      );
      throw new Error('Failed to retrieve incomes');
    }
  }

  async findByUserAndMonthAndYear(userId: number, month: string, year: string) {
    try {
      this.logger.log(
        `Finding incomes for userId=${userId}, month=${month}, year=${year}`,
      );

      const results = await this.incomeRepository.find({
        where: {
          userId,
          referenceMonth: month,
          referenceYear: year,
        },
      });

      if (!results.length) {
        throw new NotFoundException(
          `No incomes found for userId=${userId}, month=${month}, year=${year}`,
        );
      }

      return results;
    } catch (error) {
      this.logger.error(`Error finding incomes: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve incomes');
    }
  }

  async findByUserAndMonthAndCategory(
    userId: number,
    month: string,
    category: string,
  ) {
    try {
      this.logger.log(
        `Finding incomes for userId=${userId}, month=${month}, category=${category}`,
      );

      const results = await this.incomeRepository.find({
        where: {
          userId,
          referenceMonth: month,
          category,
        },
      });

      if (!results.length) {
        throw new NotFoundException(
          `No incomes found for userId=${userId}, month=${month}, category=${category}`,
        );
      }

      return results;
    } catch (error) {
      this.logger.error(`Error finding incomes: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve incomes');
    }
  }

  //   findByUserAndMonthAndYear(userId: number, month: string, year: string) {
  //     this.logger.log(`Finding incomes for user ${userId}, month ${month}, and year ${year}`);
  //     return this.incomeRepository.find({
  //       where: { userId, referenceMonth: month, referenceYear: year },
  //     });
  //   }

  //   findByUserAndMonthAndCategory(
  //     userId: number,
  //     month: string,
  //     category: string,
  //   ) {
  //     this.logger.log(`Finding incomes for user ${userId}, month ${month}, and category ${category}`);
  //     return this.incomeRepository.find({
  //       where: { userId, referenceMonth: month, category },
  //     });
  //   }
}
