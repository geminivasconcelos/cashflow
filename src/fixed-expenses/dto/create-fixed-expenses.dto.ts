import { IsNumber, IsString } from 'class-validator';

export class CreateFixedExpensesDto {
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
