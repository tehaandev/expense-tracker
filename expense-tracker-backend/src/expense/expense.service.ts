import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto, ExpenseQueryDto } from './dto/update-expense.dto';
import { ExpenseDocument } from './entities/expense.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel('Expense') private expenseModel: Model<ExpenseDocument>,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    userId: string,
  ): Promise<ExpenseDocument> {
    const expense = new this.expenseModel({
      ...createExpenseDto,
      userId,
    });
    return expense.save();
  }

  async findAll(
    userId: string,
    queryDto: ExpenseQueryDto = {},
  ): Promise<{
    expenses: ExpenseDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      category,
      type,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = queryDto;

    // Build filter object
    const filter: any = { userId };

    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (type) {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [expenses, total] = await Promise.all([
      this.expenseModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.expenseModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      expenses,
      total,
      page,
      totalPages,
    };
  }

  async findOne(id: string, userId: string): Promise<ExpenseDocument> {
    console.log(`Finding expense with ID: ${id} for user: ${userId}`);

    const expense = await this.expenseModel.findById(id).exec();

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.userId !== userId.toString()) {
      throw new ForbiddenException('Access denied');
    }

    return expense;
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
    userId: string,
  ): Promise<ExpenseDocument> {
    const expense = await this.findOne(id, userId);

    Object.assign(expense, updateExpenseDto);
    return expense.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId); // Verify ownership
    await this.expenseModel.findByIdAndDelete(id).exec();
  }

  async getExpenseStats(userId: string): Promise<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    expensesByCategory: Array<{ category: string; total: number }>;
  }> {
    const [incomeResult, expensesResult, categoryStats] = await Promise.all([
      this.expenseModel
        .aggregate([
          { $match: { userId, type: 'income' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ])
        .exec(),
      this.expenseModel
        .aggregate([
          { $match: { userId, type: 'expense' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ])
        .exec(),
      this.expenseModel
        .aggregate([
          { $match: { userId, type: 'expense' } },
          {
            $group: {
              _id: '$category',
              total: { $sum: '$amount' },
            },
          },
          { $sort: { total: -1 } },
          { $limit: 10 },
          {
            $project: {
              category: '$_id',
              total: 1,
              _id: 0,
            },
          },
        ])
        .exec(),
    ]);

    const totalIncome = incomeResult[0]?.total || 0;
    const totalExpenses = expensesResult[0]?.total || 0;
    const balance = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      balance,
      expensesByCategory: categoryStats,
    };
  }
}
