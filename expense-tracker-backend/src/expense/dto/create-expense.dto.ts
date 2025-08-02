import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200, { message: 'Description cannot exceed 200 characters' })
  description: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'Amount must be a valid number' })
  @Min(0, { message: 'Amount must be positive' })
  @Transform(({ value }) => parseFloat(value))
  amount: number;

  @IsNotEmpty()
  @IsDateString({}, { message: 'Date must be a valid date' })
  date: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50, { message: 'Category cannot exceed 50 characters' })
  category: string;

  @IsNotEmpty()
  @IsEnum(['income', 'expense'], {
    message: 'Type must be either income or expense',
  })
  type: 'income' | 'expense';

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Notes cannot exceed 500 characters' })
  notes?: string;
}
