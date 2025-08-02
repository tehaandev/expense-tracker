import { authService } from "@/features/auth/auth.service";
import type {
  Expense,
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseQueryParams,
  ExpenseListResponse,
  ExpenseStats,
} from "./expense.types";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

class ExpenseService {
  private baseUrl = "/expense";

  async createExpense(data: CreateExpenseDto): Promise<Expense> {
    try {
      const response = await authService
        .getApiInstance()
        .post<Expense>(this.baseUrl, data);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to create expense";
      throw new Error(errorMessage);
    }
  }

  async getExpenses(params?: ExpenseQueryParams): Promise<ExpenseListResponse> {
    try {
      const response = await authService
        .getApiInstance()
        .get<ExpenseListResponse>(this.baseUrl, { params });
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to fetch expenses";
      throw new Error(errorMessage);
    }
  }

  async getExpenseById(id: string): Promise<Expense> {
    try {
      const response = await authService
        .getApiInstance()
        .get<Expense>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to fetch expense";
      throw new Error(errorMessage);
    }
  }

  async updateExpense(id: string, data: UpdateExpenseDto): Promise<Expense> {
    try {
      const response = await authService
        .getApiInstance()
        .patch<Expense>(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to update expense";
      throw new Error(errorMessage);
    }
  }

  async deleteExpense(id: string): Promise<void> {
    try {
      await authService.getApiInstance().delete(`${this.baseUrl}/${id}`);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to delete expense";
      throw new Error(errorMessage);
    }
  }

  async getExpenseStats(): Promise<ExpenseStats> {
    try {
      const response = await authService
        .getApiInstance()
        .get<ExpenseStats>(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to fetch expense stats";
      throw new Error(errorMessage);
    }
  }
}

export const expenseService = new ExpenseService();

