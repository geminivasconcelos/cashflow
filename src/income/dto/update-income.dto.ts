import { IsNumber, IsString } from 'class-validator';

export class UpdateIncomeDto {
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
}
