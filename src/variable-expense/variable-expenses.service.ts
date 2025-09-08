/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VariableExpenses } from './variable-expenses.entity';
import { Repository } from 'typeorm';
import { CreateVariableExpensesDto } from './dto/create-variable-expenses.dto';
import { UpdateFixedExpensesDto } from 'src/fixed-expenses/dto/update-fixed-expenses.dto';
import { UpdateVariableExpensesDto } from './dto/update-variable-expenses.dto';

@Injectable()
export class VariableExpensesService {
  private readonly logger = new Logger(VariableExpensesService.name);
  constructor(
    @InjectRepository(VariableExpenses)
    private readonly variableExpensesRepository: Repository<VariableExpenses>,
  ) {}

  create(userId: number, createVariableExpensesDto: CreateVariableExpensesDto) {
    this.logger.log(`Creating a new variable expense for user ${userId}`);

    const newVariableExpense = this.variableExpensesRepository.create({
      ...createVariableExpensesDto,
      userId,
    });
    return this.variableExpensesRepository
      .save(newVariableExpense)
      .then((variableExpense) => ({
        message: 'Variable expense created successfully',
        variableExpense,
      }))
      .catch((error) => {
        this.logger.error('Error creating variable expense', error);
        throw error;
      });
  }

  update(
    userId: number,
    id: number,
    updateVariableExpensesDto: UpdateVariableExpensesDto,
  ) {
    this.logger.log(
      `Updating variable expense with id ${id} for user ${userId}`,
    );

    return this.variableExpensesRepository
      .update({ id, userId }, updateVariableExpensesDto)
      .then(() => ({
        message: 'Variable expense updated successfully',
      }))
      .catch((error) => {
        this.logger.error('Error updating variable expense', error);
        throw error;
      });
  }

  remove(userId: number, id: number) {
    this.logger.log(
      `Removing variable expense with id ${id} for user ${userId}`,
    );

    return this.variableExpensesRepository
      .delete({ id, userId })
      .then((result) => {
        if (result.affected === 0) {
          return {
            message: 'Variable expense not found or does not belong to user',
          };
        }
        return { message: 'Variable expense removed successfully' };
      })
      .catch((error) => {
        this.logger.error('Error removing variable expense', error);
        throw error;
      });
  }

  findAll() {
    this.logger.log('Retrieving all variable expenses');

    return this.variableExpensesRepository
      .find()
      .then((variableExpenses) => ({
        message: 'Variable expenses retrieved successfully',
        variableExpenses,
      }))
      .catch((error) => {
        this.logger.error('Error retrieving variable expenses', error);
        throw error;
      });
  }

  findOne(id: number) {
    this.logger.log(`Retrieving variable expense with id ${id}`);

    return this.variableExpensesRepository
      .findOne({ where: { id } })
      .then((variableExpense) => {
        if (!variableExpense) {
          return { message: 'Variable expense not found' };
        }
        return {
          message: 'Variable expense retrieved successfully',
          variableExpense,
        };
      })
      .catch((error) => {
        this.logger.error('Error retrieving variable expense', error);
        throw error;
      });
  }

  findByUser(userId: number) {
    this.logger.log(`Retrieving variable expenses for user with id ${userId}`);

    return this.variableExpensesRepository
      .find({ where: { userId } })
      .then((variableExpenses) => ({
        message: 'Variable expenses retrieved successfully',
        variableExpenses,
      }))
      .catch((error) => {
        this.logger.error('Error retrieving variable expenses by user', error);
        throw error;
      });
  }

  findAllByUser(userId: number) {
    this.logger.log(
      `Retrieving all variable expenses for user with id ${userId}`,
    );

    return this.variableExpensesRepository
      .find({ where: { userId } })
      .then((variableExpenses) => ({
        message: 'Variable expenses retrieved successfully',
        variableExpenses,
      }))
      .catch((error) => {
        this.logger.error('Error retrieving variable expenses by user', error);
        throw error;
      });
  }

  findOneByUser(userId: number, id: number) {
    this.logger.log(
      `Retrieving variable expense with id ${id} for user with id ${userId}`,
    );

    return this.variableExpensesRepository
      .findOne({ where: { id, userId } })
      .then((variableExpense) => {
        if (!variableExpense) {
          return {
            message: 'Variable expense not found or does not belong to user',
          };
        }
        return {
          message: 'Variable expense retrieved successfully',
          variableExpense,
        };
      })
      .catch((error) => {
        this.logger.error('Error retrieving variable expense by user', error);
        throw error;
      });
  }

  findByUserAndMonthAndYear(userId: number, month: string, year: string) {
    this.logger.log(
      `Retrieving variable expenses for user with id ${userId}, month ${month}, year ${year}`,
    );

    return this.variableExpensesRepository
      .find({
        where: {
          userId,
          referenceMonth: String(month),
          referenceYear: String(year),
        },
      })
      .then((variableExpenses) => ({
        message: 'Variable expenses retrieved successfully',
        variableExpenses,
      }))
      .catch((error) => {
        this.logger.error(
          'Error retrieving variable expenses by user and date',
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
      `Retrieving variable expenses for user with id ${userId}, month ${month}, year ${year}, category ${category}`,
    );

    return this.variableExpensesRepository
      .find({
        where: {
          userId,
          referenceMonth: String(month),
          referenceYear: String(year),
          category,
        },
      })
      .then((variableExpenses) => ({
        message: 'Variable expenses retrieved successfully',
        variableExpenses,
      }))
      .catch((error) => {
        this.logger.error(
          'Error retrieving variable expenses by user and date and category',
          error,
        );
        throw error;
      });
  }

  findByCategory(userId: number, category: string) {
    this.logger.log(`Retrieving variable expenses for category ${category}`);

    return this.variableExpensesRepository
      .find({ where: { userId, category } })
      .then((variableExpenses) => ({
        message: 'Variable expenses retrieved successfully',
        variableExpenses,
      }))
      .catch((error) => {
        this.logger.error(
          'Error retrieving variable expenses by category',
          error,
        );
        throw error;
      });
  }

  findByUserAndYear(userId: number, year: string) {
    this.logger.log(
      `Retrieving variable expenses for user with id ${userId}, year ${year}`,
    );

    return this.variableExpensesRepository
      .find({ where: { userId, referenceYear: String(year) } })
      .then((variableExpenses) => ({
        message: 'Variable expenses retrieved successfully',
        variableExpenses,
      }))
      .catch((error) => {
        this.logger.error(
          'Error retrieving variable expenses by user and year',
          error,
        );
        throw error;
      });
  }

  findByUserAndMonth(userId: number, month: string) {
    this.logger.log(
      `Retrieving variable expenses for user with id ${userId}, month ${month}`,
    );

    return this.variableExpensesRepository
      .find({ where: { userId, referenceMonth: String(month) } })
      .then((variableExpenses) => ({
        message: 'Variable expenses retrieved successfully',
        variableExpenses,
      }))
      .catch((error) => {
        this.logger.error(
          'Error retrieving variable expenses by user and month',
          error,
        );
        throw error;
      });
  }
}
