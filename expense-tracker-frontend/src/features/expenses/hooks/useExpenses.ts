import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { expenseService } from "../expense.service";
import type {
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseQueryParams,
  Expense,
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
      // Invalidate and refetch expense queries
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
    onSuccess: (updatedExpense: Expense) => {
      // Update the specific expense in cache
      queryClient.setQueryData(
        expenseKeys.detail(updatedExpense._id),
        updatedExpense
      );
      // Invalidate list queries to refresh
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
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: expenseKeys.detail(deletedId) });
      // Invalidate list queries to refresh
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.stats() });
    },
  });
};

