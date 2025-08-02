import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { expenseService } from "../expense.service";
import { authService } from "@/features/auth/auth.service";
import type {
  CreateExpenseDto,
  ExpenseQueryParams,
  UpdateExpenseDto,
  UpdateExpenseLimitDto,
} from "../expense.types";

// Query keys
export const expenseKeys = {
  all: ["expenses"] as const,
  lists: () => [...expenseKeys.all, "list"] as const,
  list: (params?: ExpenseQueryParams) =>
    [...expenseKeys.lists(), params] as const,
  details: () => [...expenseKeys.all, "detail"] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
  stats: () => [...expenseKeys.all, "stats"] as const,
  monthlyStats: () => [...expenseKeys.all, "monthly-stats"] as const,
};

// Get expenses list
export const useExpenses = (params?: ExpenseQueryParams) => {
  return useQuery({
    queryKey: expenseKeys.list(params),
    queryFn: () => expenseService.getExpenses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single expense
export const useExpense = (id: string) => {
  return useQuery({
    queryKey: expenseKeys.detail(id),
    queryFn: () => expenseService.getExpenseById(id),
    enabled: !!id,
  });
};

// Get expense stats
export const useExpenseStats = () => {
  return useQuery({
    queryKey: expenseKeys.stats(),
    queryFn: () => expenseService.getExpenseStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create expense
export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseDto) => expenseService.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.stats() });
    },
  });
};

// Update expense
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpenseDto }) =>
      expenseService.updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.stats() });
    },
  });
};

// Delete expense
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseService.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.stats() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.monthlyStats() });
    },
  });
};

// Get monthly expense stats
export const useMonthlyExpenseStats = () => {
  return useQuery({
    queryKey: expenseKeys.monthlyStats(),
    queryFn: () => expenseService.getMonthlyExpenseStats(),
    staleTime: 1 * 60 * 1000, // 1 minute (more frequent updates for limit tracking)
  });
};

// Update expense limit
export const useUpdateExpenseLimit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateExpenseLimitDto) =>
      authService.updateExpenseLimit(data),
    onSuccess: () => {
      // Invalidate monthly stats to refresh limit data
      queryClient.invalidateQueries({ queryKey: expenseKeys.monthlyStats() });
      // Also invalidate auth profile if needed
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    },
  });
};

