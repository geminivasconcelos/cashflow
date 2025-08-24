import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';

export class CreateLiabilityDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  installmentQuantity: number;

  @IsNotEmpty()
  @IsBoolean()
  purchaseInInstallments: boolean;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalPaid: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalDue: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  installmentsPaid: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  installmentsDue: number;
}
