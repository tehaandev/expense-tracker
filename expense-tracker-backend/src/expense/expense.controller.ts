import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto, ExpenseQueryDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('expense')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
    @Request() req: any,
  ) {
    return this.expenseService.create(createExpenseDto, req.user._id);
  }

  @Get()
  async findAll(@Query() queryDto: ExpenseQueryDto, @Request() req: any) {
    return this.expenseService.findAll(req.user._id, queryDto);
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    return this.expenseService.getExpenseStats(req.user._id);
  }

  @Get('monthly-stats')
  async getMonthlyStats(@Request() req: any) {
    return this.expenseService.getMonthlyExpenseStats(req.user._id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.expenseService.findOne(id, req.user._id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Request() req: any,
  ) {
    return this.expenseService.update(id, updateExpenseDto, req.user._id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.expenseService.remove(id, req.user._id);
  }
}
