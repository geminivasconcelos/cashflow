import { IsNumber, IsString } from 'class-validator';

export class UpdateFixedExpensesDto {
  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsString()
  referenceYear: string;

  @IsString()
  referenceMonth: string;

  @IsString()
  paymentDate: string;
}
