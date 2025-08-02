import { PartialType } from '@nestjs/mapped-types';
import { CreateExpenseDto } from './create-expense.dto';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}

export class ExpenseQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(['income', 'expense'], {
    message: 'Type must be either income or expense',
  })
  type?: 'income' | 'expense';

  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid date' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid date' })
  endDate?: string;

  @IsOptional()
  @IsIn(['date', 'amount', 'createdAt'], {
    message: 'Sort by must be one of: date, amount, createdAt',
  })
  sortBy?: 'date' | 'amount' | 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'Sort order must be either asc or desc',
  })
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number;
}
