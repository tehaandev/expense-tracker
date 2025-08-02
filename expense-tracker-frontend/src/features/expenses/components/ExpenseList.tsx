import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, Option } from "@/components/ui/select";
import { useExpenses, useDeleteExpense } from "../hooks/useExpenses";
import type { ExpenseQueryParams, Expense } from "../expense.types";
import { Trash2, Edit, Calendar, DollarSign, Tag } from "lucide-react";

interface ExpenseListProps {
  onEditExpense?: (expense: Expense) => void;
}

export default function ExpenseList({ onEditExpense }: ExpenseListProps) {
  const [filters, setFilters] = useState<ExpenseQueryParams>({
    page: 1,
    limit: 10,
    sortBy: "date",
    sortOrder: "desc",
  });

  const { data, isLoading, error } = useExpenses(filters);
  const deleteMutation = useDeleteExpense();

  const handleFilterChange = (
    key: keyof ExpenseQueryParams,
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : Number(value), // Reset page when other filters change
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading expenses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-600">
          Error loading expenses: {error.message}
        </div>
      </div>
    );
  }

  const expenses = data?.expenses || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="type-filter">Type</Label>
              <Select
                id="type-filter"
                value={filters.type || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "type",
                    e.target.value as "income" | "expense"
                  )
                }
              >
                <Option value="">All Types</Option>
                <Option value="income">Income</Option>
                <Option value="expense">Expense</Option>
              </Select>
            </div>

            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Input
                id="category-filter"
                value={filters.category || ""}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                placeholder="Filter by category"
              />
            </div>

            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={filters.startDate || ""}
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
                value={filters.endDate || ""}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="sort-by">Sort By</Label>
              <Select
                id="sort-by"
                value={filters.sortBy || "date"}
                onChange={(e) =>
                  handleFilterChange(
                    "sortBy",
                    e.target.value as "date" | "amount" | "createdAt"
                  )
                }
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
                value={filters.sortOrder || "desc"}
                onChange={(e) =>
                  handleFilterChange(
                    "sortOrder",
                    e.target.value as "asc" | "desc"
                  )
                }
              >
                <Option value="desc">Newest First</Option>
                <Option value="asc">Oldest First</Option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <div className="space-y-4">
        {expenses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-lg text-muted-foreground">No expenses found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters or add your first expense
              </p>
            </CardContent>
          </Card>
        ) : (
          expenses.map((expense) => (
            <Card key={expense._id} className="relative">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">
                        {expense.description}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          expense.type === "income"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {expense.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span
                          className={`font-medium ${
                            expense.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {expense.type === "income" ? "+" : "-"}
                          {formatCurrency(expense.amount)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(expense.date)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <span>{expense.category}</span>
                      </div>
                    </div>

                    {expense.notes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        {expense.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditExpense?.(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense._id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={filters.page === 1}
            onClick={() => handleFilterChange("page", (filters.page || 1) - 1)}
          >
            Previous
          </Button>

          <span className="px-4 py-2 text-sm">
            Page {filters.page || 1} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={filters.page === totalPages}
            onClick={() => handleFilterChange("page", (filters.page || 1) + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

