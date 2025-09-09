import { DebtTrackerModule } from './debt-tracker/debt-tracker.module';
import { DebtTrackerService } from './debt-tracker/debt-tracker.service';
import { PasswordRecoveryService } from './auth/password-recovery.service';
import { LiabilitiesModule } from './liabilities/liabilities.module';
import { LiabilitiesController } from './liabilities/liabilities.controller';
import { MailModule } from './mail/mail.module';
import { SavingsModule } from './savings/savings.module';
import { SavingsController } from './savings/savings.controller';
import { VariableExpenseModule } from './variable-expense/variable-expenses.module';
import { FixedExpensesModule } from './fixed-expenses/fixed-expenses.module';
import { IncomeModule } from './income/income.module';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { Income } from './income/income.entity';
import { FixedExpenses } from './fixed-expenses/fixed-expenses.entity';
import { VariableExpenses } from './variable-expense/variable-expenses.entity';
import { Savings } from './savings/savings.entity';
import { ResetCode } from './auth/reset-code.entity';

@Module({
  imports: [
    DebtTrackerModule,
    LiabilitiesModule,
    MailModule,
    SavingsModule,
    VariableExpenseModule,
    FixedExpensesModule,
    IncomeModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: String(process.env.DB_PASSWORD),
      database: process.env.DB_NAME,
      entities: [
        User,
        Income,
        FixedExpenses,
        VariableExpenses,
        Savings,
        ResetCode,
      ],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
