import { IsNumber, IsString } from 'class-validator';

export class UpdateSavingsDto {
  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsString()
  category: string;
}
