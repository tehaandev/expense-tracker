import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import ExpenseStats from "./ExpenseStats";
import type { Expense } from "../expense.types";
import { Plus, X } from "lucide-react";

export default function ExpenseDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [activeTab, setActiveTab] = useState<"overview" | "expenses">(
    "overview"
  );

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Expense Tracker
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your finances efficiently
            </p>
          </div>

          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("expenses")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "expenses"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All Expenses
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === "overview" ? (
              <div className="space-y-6">
                <ExpenseStats />

                {/* Recent Expenses Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ExpenseList onEditExpense={handleEditExpense} />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <ExpenseList onEditExpense={handleEditExpense} />
            )}
          </div>

          {/* Form Sidebar */}
          <div className="lg:col-span-1">
            {showForm ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {editingExpense ? "Edit Expense" : "Add New Expense"}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={handleFormCancel}>
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
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => setShowForm(true)}
                    className="w-full flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Expense
                  </Button>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Track your income and expenses</p>
                    <p>• Categorize your transactions</p>
                    <p>• View detailed analytics</p>
                    <p>• Export your data</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

