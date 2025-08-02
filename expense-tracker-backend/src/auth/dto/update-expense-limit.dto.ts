import { IsNumber, IsBoolean, IsOptional, Min, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateExpenseLimitDto {
  @IsOptional()
  @IsNumber({}, { message: 'Monthly expense limit must be a valid number' })
  @Min(0, { message: 'Monthly expense limit must be positive' })
  @Transform(({ value }) => parseFloat(value))
  monthlyExpenseLimit?: number;

  @IsOptional()
  @IsEnum(['USD', 'LKR', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY'], {
    message: 'Currency must be a valid currency code',
  })
  currency?: string;

  @IsOptional()
  @IsBoolean({ message: 'Limit enabled must be a boolean' })
  limitEnabled?: boolean;
}
