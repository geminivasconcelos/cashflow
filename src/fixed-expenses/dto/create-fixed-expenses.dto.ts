import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFixedExpensesDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  category: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  referenceYear: string;

  @IsString()
  @IsNotEmpty()
  referenceMonth: string;

  @IsString()
  @IsNotEmpty()
  paymentDate: string;
}
