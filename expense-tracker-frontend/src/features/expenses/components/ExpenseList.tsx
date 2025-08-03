import {
  Trash2,
  Edit,
  Calendar,
  Tag,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useExpenses, useDeleteExpense } from "../hooks/useExpenses";
import type { ExpenseQueryParams, Expense } from "../expense.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Option, Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebouncedState } from "@/hooks/useDebounce";
interface ExpenseListProps {
  onEditExpense?: (expense: Expense) => void;
}

export default function ExpenseList({ onEditExpense }: ExpenseListProps) {
  const [uiFilters, debouncedFilters, setFilters] =
    useDebouncedState<ExpenseQueryParams>(
      {
        page: 1,
        limit: 10,
        sortBy: "date",
        sortOrder: "desc",
      },
      500
    );

  const { data, isLoading, error } = useExpenses(debouncedFilters);
  const deleteMutation = useDeleteExpense();

  const handleFilterChange = (
    key: keyof ExpenseQueryParams,
    value: string | number | null
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page on filter change
    }));
  };

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const expenses = data?.expenses || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 text-muted-foreground">
        Loading expenses...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8 text-destructive">
        Error loading expenses: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="type-filter">Type</Label>
              <Select
                id="type-filter"
                value={uiFilters.type || ""}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <Option value="">All</Option>
                <Option value="income">Income</Option>
                <Option value="expense">Expense</Option>
              </Select>
            </div>

            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Input
                id="category-filter"
                placeholder="e.g. Food"
                value={uiFilters.category || ""}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={uiFilters.startDate || ""}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={uiFilters.endDate || ""}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="sort-by">Sort By</Label>
              <Select
                id="sort-by"
                value={uiFilters.sortBy || "date"}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              >
                <Option value="date">Date</Option>
                <Option value="amount">Amount</Option>
                <Option value="createdAt">Created At</Option>
              </Select>
            </div>

            <div>
              <Label htmlFor="sort-order">Sort Order</Label>
              <Select
                id="sort-order"
                value={uiFilters.sortOrder || "desc"}
                onChange={(e) =>
                  handleFilterChange("sortOrder", e.target.value)
                }
              >
                <Option value="desc">Newest First</Option>
                <Option value="asc">Oldest First</Option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense List */}
      {expenses.length === 0 ? (
        <Card>
          <CardContent className="text-center p-8">
            <p className="text-lg text-muted-foreground">No expenses found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your filters or add an expense
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {expenses.map((expense) => (
            <Card
              key={expense._id}
              className="group relative overflow-hidden border-0 bg-gradient-to-br from-white via-gray-50/20 to-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Accent indicator */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  expense.type === "income"
                    ? "bg-gradient-to-r from-emerald-400 to-green-500"
                    : "bg-gradient-to-r from-rose-400 to-red-500"
                }`}
              />

              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Header row with title, type badge, and amount */}
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {expense.description}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border flex-shrink-0 ${
                            expense.type === "income"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {expense.type === "income" ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {expense.type.charAt(0).toUpperCase() +
                            expense.type.slice(1)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-lg font-bold flex-shrink-0 ${
                            expense.type === "income"
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {expense.type === "income" ? "+" : "-"}
                          {formatCurrency(expense.amount)}
                        </span>
                      </div>
                    </div>

                    {/* Metadata row */}
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(expense.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5" />
                        <span>{expense.category}</span>
                      </div>
                    </div>

                    {/* Notes - only show if present */}
                    {expense.notes && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded text-justify">
                          {expense.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditExpense?.(expense)}
                      className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors duration-200 group/edit h-8 w-8 p-0"
                      aria-label="Edit Expense"
                    >
                      <Edit className="h-3.5 w-3.5 group-hover/edit:scale-110 transition-transform" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense._id)}
                      disabled={deleteMutation.isPending}
                      className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors duration-200 group/delete disabled:opacity-50 h-8 w-8 p-0"
                      aria-label="Delete Expense"
                    >
                      <Trash2 className="h-3.5 w-3.5 group-hover/delete:scale-110 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleFilterChange("page", (uiFilters.page || 1) - 1)
            }
            disabled={uiFilters.page === 1}
          >
            Previous
          </Button>

          <span className="text-sm">
            Page {uiFilters.page || 1} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleFilterChange("page", (uiFilters.page || 1) + 1)
            }
            disabled={uiFilters.page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

