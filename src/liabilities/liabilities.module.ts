import { TypeOrmModule } from '@nestjs/typeorm';
import { LiabilitiesController } from './liabilities.controller';
import { Liabilities } from './liabilities.entity';
import { LiabilitiesService } from './liabilities.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Liabilities])],
  controllers: [LiabilitiesController],
  providers: [LiabilitiesService],
})
export class LiabilitiesModule {}
