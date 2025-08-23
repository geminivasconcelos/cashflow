import { IsNumber, IsString } from 'class-validator';

export class CreateVariableExpensesDto {
  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsNumber()
  userId: number;

  @IsString()
  referenceYear: string;

  @IsString()
  referenceMonth: string;

  @IsString()
  paymentDate: string;
}
