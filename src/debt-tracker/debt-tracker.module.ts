import { DebtTrackerController } from './debt-tracker.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [
        DebtTrackerController, ],
  providers: [],
})
export class DebtTrackerModule {}
