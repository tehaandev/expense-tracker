import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LogOut, Plus, Settings, X } from "lucide-react";
import { useState } from "react";
import type { Expense } from "../expense.types";
import { useMonthlyExpenseStats } from "../hooks/useExpenses";
import ExpenseForm from "./ExpenseForm";
import ExpenseLimitModal from "./ExpenseLimitModal";
import ExpenseList from "./ExpenseList";
import ExpenseStats from "./ExpenseStats";
import MonthlyLimitAlert from "./MonthlyLimitAlert";
import MonthlyProgressBar from "./MonthlyProgressBar";

export default function ExpenseDashboard() {
  const [showForm, setShowForm] = useState(false);
  const { logout } = useAuth();

  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "expenses">(
    "overview"
  );

  // Get monthly stats for alerts and progress
  const { data: monthlyStats } = useMonthlyExpenseStats();

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
    const formElement = document.getElementById("expense-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingExpense(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingExpense(undefined);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="mb-14">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Expense Dashboard
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Track your expenses and manage your budget effectively
        </p>
      </div>
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-full sm:w-fit overflow-x-auto">
            <Button
              variant={activeTab === "overview" ? "default" : "secondary"}
              onClick={() => setActiveTab("overview")}
              size="sm"
              className="flex-1 sm:flex-none whitespace-nowrap"
            >
              Overview
            </Button>
            <Button
              variant={activeTab === "expenses" ? "default" : "secondary"}
              size="sm"
              onClick={() => setActiveTab("expenses")}
              className="flex-1 sm:flex-none whitespace-nowrap"
            >
              All Expenses
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 min-w-0">
            <Button
              variant="outline"
              onClick={() => setIsLimitModalOpen(true)}
              className="flex items-center justify-center gap-2 text-sm whitespace-nowrap"
              size="sm"
            >
              <Settings className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Monthly Limit</span>
              <span className="sm:hidden">Limit</span>
            </Button>
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 text-sm whitespace-nowrap"
              size="sm"
            >
              <Plus className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Add Expense</span>
              <span className="sm:hidden">Add</span>
            </Button>
            {/* Log out */}
            <Button
              variant="destructive"
              onClick={logout}
              className="flex items-center justify-center gap-2 text-sm whitespace-nowrap"
              size="sm"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Logout</span>
            </Button>
          </div>
        </div>

        {/* Monthly Limit Alert */}
        {monthlyStats && (
          <MonthlyLimitAlert
            stats={monthlyStats}
            onOpenSettings={() => setIsLimitModalOpen(true)}
          />
        )}

        {/* Content */}
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="xl:col-span-4 order-2 xl:order-1">
            {activeTab === "overview" ? (
              <div className="space-y-4 sm:space-y-6">
                <ExpenseStats />

                {/* Monthly Progress */}
                {monthlyStats && (
                  <MonthlyProgressBar
                    stats={monthlyStats}
                    onOpenSettings={() => setIsLimitModalOpen(true)}
                  />
                )}

                {/* Recent Expenses Preview */}
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">
                      Recent Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ExpenseList onEditExpense={handleEditExpense} />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <ExpenseList onEditExpense={handleEditExpense} />
            )}
          </div>

          {/* Form Sidebar */}
          <div className="xl:col-span-2 order-1 xl:order-2">
            {showForm ? (
              <div className="space-y-4 sticky top-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold truncate flex-1 mr-2">
                    {editingExpense ? "Edit Expense" : "Add New Expense"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFormCancel}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <ExpenseForm
                  expense={editingExpense}
                  onSuccess={handleFormSuccess}
                  onCancel={handleFormCancel}
                />
              </div>
            ) : (
              <Card className="sticky top-4">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <Button
                    onClick={() => setShowForm(true)}
                    className="w-full flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Plus className="h-4 w-4 flex-shrink-0" />
                    Add New Expense
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Expense Limit Modal */}
        <ExpenseLimitModal
          isOpen={isLimitModalOpen}
          onClose={() => setIsLimitModalOpen(false)}
          currentStats={monthlyStats}
        />
      </div>
    </div>
  );
}

