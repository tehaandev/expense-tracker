import { useState, useEffect } from "react";
import { X, DollarSign, Save, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateExpenseLimit } from "../hooks/useExpenses";
import type { MonthlyExpenseStats } from "../expense.types";

interface ExpenseLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStats?: MonthlyExpenseStats;
}

const CURRENCY_OPTIONS = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "LKR", symbol: "Rs.", name: "Sri Lankan Rupee" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
];

export default function ExpenseLimitModal({
  isOpen,
  onClose,
  currentStats,
}: ExpenseLimitModalProps) {
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [currency, setCurrency] = useState("LKR");
  const [limitEnabled, setLimitEnabled] = useState(true);
  const [errors, setErrors] = useState<{ monthlyLimit?: string }>({});

  const updateLimitMutation = useUpdateExpenseLimit();

  // Initialize form with current values
  useEffect(() => {
    if (currentStats) {
      setMonthlyLimit(currentStats.monthlyLimit?.toString() || "");
      setCurrency(currentStats.currency || "LKR");
      setLimitEnabled(currentStats.limitEnabled ?? true);
    } else {
      // Default values for new setup
      setMonthlyLimit("");
      setCurrency("LKR");
      setLimitEnabled(true);
    }
    setErrors({});
  }, [currentStats, isOpen]);

  const validateForm = () => {
    const newErrors: { monthlyLimit?: string } = {};

    if (!monthlyLimit.trim()) {
      newErrors.monthlyLimit = "Monthly limit is required";
    } else {
      const numericLimit = parseFloat(monthlyLimit);
      if (isNaN(numericLimit) || numericLimit <= 0) {
        newErrors.monthlyLimit = "Please enter a valid amount greater than 0";
      } else if (numericLimit > 1000000) {
        newErrors.monthlyLimit = "Amount cannot exceed 1,000,000";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateLimitMutation.mutateAsync({
        monthlyExpenseLimit: parseFloat(monthlyLimit),
        currency,
        limitEnabled,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update expense limit:", error);
    }
  };

  const formatCurrencyPreview = (amount: string) => {
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount)) return "";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(numericAmount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed backdrop-blur-xs bg-black/5 inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">
            {currentStats?.isLimitSet
              ? "Update Monthly Limit"
              : "Set Monthly Expense Limit"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Monthly Limit Input */}
            <div className="space-y-2">
              <Label htmlFor="monthlyLimit">Monthly Expense Limit *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="monthlyLimit"
                  type="number"
                  placeholder="Enter amount"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(e.target.value)}
                  className={`pl-10 ${
                    errors.monthlyLimit ? "border-red-500" : ""
                  }`}
                  step="0.01"
                  min="0"
                />
              </div>
              {errors.monthlyLimit && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {errors.monthlyLimit}
                </div>
              )}
              {monthlyLimit && !errors.monthlyLimit && (
                <p className="text-sm text-gray-600">
                  Preview: {formatCurrencyPreview(monthlyLimit)}
                </p>
              )}
            </div>

            {/* Currency Selection */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CURRENCY_OPTIONS.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.name} ({curr.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Enable/Disable Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="limitEnabled"
                checked={limitEnabled}
                onChange={(e) => setLimitEnabled(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="limitEnabled" className="text-sm">
                Enable monthly limit alerts
              </Label>
            </div>

            {/* Information Box */}
            {currentStats?.currentMonthTotal && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Current Month Spending</p>
                    <p>
                      You've already spent{" "}
                      <span className="font-semibold">
                        {formatCurrencyPreview(
                          currentStats.currentMonthTotal.toString()
                        )}
                      </span>{" "}
                      this month.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={updateLimitMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={updateLimitMutation.isPending}
              >
                {updateLimitMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {currentStats?.isLimitSet ? "Update Limit" : "Set Limit"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

