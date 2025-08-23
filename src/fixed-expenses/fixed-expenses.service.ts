import { Injectable, Logger } from '@nestjs/common';
import { FixedExpenses } from './fixed-expenses.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFixedExpensesDto } from './dto/create-fixed-expenses.dto';
import { UpdateFixedExpensesDto } from './dto/update-fixed-expenses.dto';

@Injectable()
export class FixedExpensesService {
  private readonly logger = new Logger(FixedExpensesService.name);
  constructor(
    @InjectRepository(FixedExpenses)
    private readonly fixedExpensesRepository: Repository<FixedExpenses>,
  ) {}

  create(createFixedExpensesDto: CreateFixedExpensesDto) {
    this.logger.log('Creating a new fixed expense');

    const newFixedExpense = this.fixedExpensesRepository.create(
      createFixedExpensesDto,
    );
    return this.fixedExpensesRepository
      .save(newFixedExpense)
      .then((fixedExpense) => ({
        message: 'Fixed expense created successfully',
        fixedExpense,
      }))
      .catch((error) => {
        this.logger.error('Error creating fixed expense', error);
        throw error;
      });
  }

  update(id: number, updateFixedExpensesDto: UpdateFixedExpensesDto) {
    this.logger.log(`Updating fixed expense with id ${id}`);

    return this.fixedExpensesRepository
      .update(id, updateFixedExpensesDto)
      .then(() => ({
        message: 'Fixed expense updated successfully',
      }))
      .catch((error) => {
        this.logger.error('Error updating fixed expense', error);
        throw error;
      });
  }

  remove(id: number) {
    this.logger.log(`Removing fixed expense with id ${id}`);

    return this.fixedExpensesRepository
      .delete(id)
      .then(() => ({
        message: 'Fixed expense removed successfully',
      }))
      .catch((error) => {
        this.logger.error('Error removing fixed expense', error);
        throw error;
      });
  }

  findAll() {
    this.logger.log('Retrieving all fixed expenses');

    return this.fixedExpensesRepository
      .find()
      .then((fixedExpenses) => ({
        message: 'Fixed expenses retrieved successfully',
        fixedExpenses,
      }))
      .catch((error) => {
        this.logger.error('Error retrieving fixed expenses', error);
        throw error;
      });
  }

  findOne(id: number) {
    this.logger.log(`Retrieving fixed expense with id ${id}`);

    return this.fixedExpensesRepository
      .findOne({ where: { id } })
      .then((fixedExpense) => {
        if (!fixedExpense) {
          return { message: 'Fixed expense not found' };
        }
        return {
          message: 'Fixed expense retrieved successfully',
          fixedExpense,
        };
      })
      .catch((error) => {
        this.logger.error('Error retrieving fixed expense', error);
        throw error;
      });
  }

  findByUser(userId: number) {
    this.logger.log(`Retrieving fixed expenses for user with id ${userId}`);

    return this.fixedExpensesRepository
      .find({ where: { userId } })
      .then((fixedExpenses) => ({
        message: 'Fixed expenses retrieved successfully',
        fixedExpenses,
      }))
      .catch((error) => {
        this.logger.error('Error retrieving fixed expenses by user', error);
        throw error;
      });
  }

  findByUserAndMonthAndYear(userId: number, month: string, year: string) {
    this.logger.log(
      `Retrieving fixed expenses for user with id ${userId}, month ${month}, year ${year}`,
    );

    return this.fixedExpensesRepository
      .find({
        where: {
          userId,
          referenceMonth: String(month),
          referenceYear: String(year),
        },
      })
      .then((fixedExpenses) => ({
        message: 'Fixed expenses retrieved successfully',
        fixedExpenses,
      }))
      .catch((error) => {
        this.logger.error(
          'Error retrieving fixed expenses by user and date',
          error,
        );
        throw error;
      });
  }

  findByUserAndMonthAndYearAndCategory(
    userId: number,
    month: string,
    year: string,
    category: string,
  ) {
    this.logger.log(
      `Retrieving fixed expenses for user with id ${userId}, month ${month}, year ${year}, category ${category}`,
    );

    return this.fixedExpensesRepository
      .find({
        where: {
          userId,
          referenceMonth: String(month),
          referenceYear: String(year),
          category,
        },
      })
      .then((fixedExpenses) => ({
        message: 'Fixed expenses retrieved successfully',
        fixedExpenses,
      }))
      .catch((error) => {
        this.logger.error(
          'Error retrieving fixed expenses by user and date and category',
          error,
        );
        throw error;
      });
  }

  findByCategory(userId: number, category: string) {
    this.logger.log(`Retrieving fixed expenses for category ${category}`);

    return this.fixedExpensesRepository
      .find({ where: { userId, category } })
      .then((fixedExpenses) => ({
        message: 'Fixed expenses retrieved successfully',
        fixedExpenses,
      }))
      .catch((error) => {
        this.logger.error('Error retrieving fixed expenses by category', error);
        throw error;
      });
  }

  findByUserAndYear(userId: number, year: string) {
    this.logger.log(`Retrieving fixed expenses for user with id ${userId}, year ${year}`);

    return this.fixedExpensesRepository
      .find({ where: { userId, referenceYear: String(year) } })
      .then((fixedExpenses) => ({
        message: 'Fixed expenses retrieved successfully',
        fixedExpenses,
      }))
      .catch((error) => {
        this.logger.error('Error retrieving fixed expenses by user and year', error);
        throw error;
      });
  }

  findByUserAndMonth(userId: number, month: string) {
    this.logger.log(`Retrieving fixed expenses for user with id ${userId}, month ${month}`);

    return this.fixedExpensesRepository
      .find({ where: { userId, referenceMonth: String(month) } })
      .then((fixedExpenses) => ({
        message: 'Fixed expenses retrieved successfully',
        fixedExpenses,
      }))
      .catch((error) => {
        this.logger.error('Error retrieving fixed expenses by user and month', error);
        throw error;
      });
  }
}
