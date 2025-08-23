import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSavingsDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  userId: number;
}
