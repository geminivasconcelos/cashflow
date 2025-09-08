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

create(userId: number, createFixedExpensesDto: CreateFixedExpensesDto) {
  this.logger.log(`Creating a new fixed expense for user ${userId}`);

  const newFixedExpense = this.fixedExpensesRepository.create({
    ...createFixedExpensesDto,
    userId,
  });
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

  update(
    userId: number,
    id: number,
    updateFixedExpensesDto: UpdateFixedExpensesDto,
  ) {
    this.logger.log(`Updating fixed expense with id ${id} for user ${userId}`);

    return this.fixedExpensesRepository
      .update({ id, userId }, updateFixedExpensesDto)
      .then((result) => {
        if (result.affected === 0) {
          return {
            message: 'Fixed expense not found or does not belong to user',
          };
        }
        return { message: 'Fixed expense updated successfully' };
      })
      .catch((error) => {
        this.logger.error('Error updating fixed expense', error);
        throw error;
      });
  }

  async remove(userId: number, id: number) {
    this.logger.log(`Removing fixed expense with id ${id} for user ${userId}`);

    try {
      const result = await this.fixedExpensesRepository.delete({ id, userId });
      if (result.affected === 0) {
        return {
          message: 'Fixed expense not found or does not belong to user',
        };
      }
      return { message: 'Fixed expense removed successfully' };
    } catch (error) {
      this.logger.error(
        `Error removing fixed expense ${id} for user ${userId}`,
        error,
      );
      throw error;
    }
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

  findOneByUser(userId: number, id: number) {
    this.logger.log(
      `Retrieving fixed expense with id ${id} for user with id ${userId}`,
    );
    return this.fixedExpensesRepository
      .findOne({ where: { userId, id } })
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

  findAllByUser(userId: number) {
    this.logger.log(`Retrieving all fixed expenses for user with id ${userId}`);

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
    this.logger.log(
      `Retrieving fixed expenses for user with id ${userId}, year ${year}`,
    );

    return this.fixedExpensesRepository
      .find({ where: { userId, referenceYear: String(year) } })
      .then((fixedExpenses) => ({
        message: 'Fixed expenses retrieved successfully',
        fixedExpenses,
      }))
      .catch((error) => {
        this.logger.error(
          'Error retrieving fixed expenses by user and year',
          error,
        );
        throw error;
      });
  }

  findByUserAndMonth(userId: number, month: string) {
    this.logger.log(
      `Retrieving fixed expenses for user with id ${userId}, month ${month}`,
    );

    return this.fixedExpensesRepository
      .find({ where: { userId, referenceMonth: String(month) } })
      .then((fixedExpenses) => ({
        message: 'Fixed expenses retrieved successfully',
        fixedExpenses,
      }))
      .catch((error) => {
        this.logger.error(
          'Error retrieving fixed expenses by user and month',
          error,
        );
        throw error;
      });
  }
}
