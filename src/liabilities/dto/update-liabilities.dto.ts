import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateLiabilityDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  installmentQuantity?: number;

  @IsOptional()
  @IsBoolean()
  purchaseInInstallments?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalPaid?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalDue?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  installmentsPaid?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  installmentsDue?: number;
}
