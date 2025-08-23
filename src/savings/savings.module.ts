import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';

import { Module } from '@nestjs/common';
import { Savings } from './savings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Savings])],
  controllers: [SavingsController],
  providers: [SavingsService],
})
export class SavingsModule {}
