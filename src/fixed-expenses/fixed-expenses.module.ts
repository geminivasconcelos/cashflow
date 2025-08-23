import { TypeOrmModule } from '@nestjs/typeorm';
import { FixedExpensesController } from './fixed-expenses.controller';
import { FixedExpenses } from './fixed-expenses.entity';
import { FixedExpensesService } from './fixed-expenses.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([FixedExpenses])],
  controllers: [FixedExpensesController],
  providers: [FixedExpensesService],
})
export class FixedExpensesModule {}
