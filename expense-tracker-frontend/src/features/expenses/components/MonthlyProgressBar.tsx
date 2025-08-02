import { TrendingUp, DollarSign, Calendar, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { MonthlyExpenseStats } from "../expense.types";

interface MonthlyProgressBarProps {
  stats: MonthlyExpenseStats;
  onOpenSettings?: () => void;
}

export default function MonthlyProgressBar({
  stats,
  onOpenSettings,
}: MonthlyProgressBarProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: stats.currency,
    }).format(amount);
  };

  const getProgressColor = () => {
    switch (stats.alertLevel) {
      case "safe":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
        return "bg-orange-500";
      case "exceeded":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusMessage = () => {
    if (!stats.isLimitSet) {
      return "No monthly limit set";
    }

    const remaining = (stats.monthlyLimit || 0) - stats.currentMonthTotal;

    if (stats.alertLevel === "exceeded") {
      return `Over budget by ${formatCurrency(Math.abs(remaining))}`;
    }

    return `${formatCurrency(remaining)} remaining`;
  };

  // Don't show if limit is not set
  if (!stats.isLimitSet) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Monthly Budget
          </CardTitle>
          {onOpenSettings && (
            <Button variant="outline" size="sm" onClick={onOpenSettings}>
              <Settings className="h-4 w-4 mr-1" />
              Set Limit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-3">
              Set a monthly expense limit to track your spending progress
            </p>
            {onOpenSettings && (
              <Button onClick={onOpenSettings} size="sm">
                <DollarSign className="h-4 w-4 mr-1" />
                Set Monthly Limit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          Monthly Budget Progress
        </CardTitle>
        {onOpenSettings && (
          <Button variant="outline" size="sm" onClick={onOpenSettings}>
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {formatCurrency(stats.currentMonthTotal)} of{" "}
                {formatCurrency(stats.monthlyLimit || 0)}
              </span>
              <span
                className={`text-sm font-medium ${
                  stats.alertLevel === "exceeded"
                    ? "text-red-600"
                    : stats.alertLevel === "critical"
                    ? "text-orange-600"
                    : stats.alertLevel === "warning"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {stats.percentageUsed.toFixed(1)}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
                style={{ width: `${Math.min(stats.percentageUsed, 100)}%` }}
              />
            </div>

            <p
              className={`text-sm mt-2 ${
                stats.alertLevel === "exceeded"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {getStatusMessage()}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-xs text-gray-500">Days Left</span>
              </div>
              <p className="font-semibold text-gray-800">
                {stats.daysRemainingInMonth}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span className="text-xs text-gray-500">Daily Avg</span>
              </div>
              <p className="font-semibold text-gray-800">
                {formatCurrency(stats.dailyAverage)}
              </p>
            </div>
          </div>

          {/* Status indicator */}
          {stats.limitEnabled && (
            <div
              className={`text-xs px-2 py-1 rounded-full text-center ${
                stats.alertLevel === "safe"
                  ? "bg-green-100 text-green-800"
                  : stats.alertLevel === "warning"
                  ? "bg-yellow-100 text-yellow-800"
                  : stats.alertLevel === "critical"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {stats.alertLevel === "safe" && "✓ On track"}
              {stats.alertLevel === "warning" && "⚠ Approaching limit"}
              {stats.alertLevel === "critical" && "🚨 Critical level"}
              {stats.alertLevel === "exceeded" && "🚫 Budget exceeded"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

