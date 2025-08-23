import { Module } from '@nestjs/common';
import { VariableExpenseController } from './variable-expenses.controller';
import { VariableExpensesService } from './variable-expenses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariableExpenses } from './variable-expenses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VariableExpenses])],
  controllers: [VariableExpenseController],
  providers: [VariableExpensesService],
})
export class VariableExpenseModule {}
