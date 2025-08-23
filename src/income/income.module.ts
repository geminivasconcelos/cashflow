import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeController } from './income.controller';
import { IncomeService } from './income.service';
import { Module } from '@nestjs/common';
import { Income } from './income.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Income])],
  controllers: [IncomeController],
  providers: [IncomeService],
  exports: [IncomeService],
})
export class IncomeModule {}
