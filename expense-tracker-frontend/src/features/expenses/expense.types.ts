export interface Expense {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseDto {
  description: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
  notes?: string;
}

export type UpdateExpenseDto = Partial<CreateExpenseDto>;

export interface ExpenseQueryParams {
  category?: string;
  type?: "income" | "expense";
  startDate?: string;
  endDate?: string;
  sortBy?: "date" | "amount" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ExpenseListResponse {
  expenses: Expense[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ExpenseStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: Array<{ category: string; total: number }>;
}

export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Business",
  "Personal Care",
  "Gifts & Donations",
  "Investments",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

