import { AlertTriangle, TrendingUp, DollarSign, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { MonthlyExpenseStats } from "../expense.types";

interface MonthlyLimitAlertProps {
  stats: MonthlyExpenseStats;
  onOpenSettings?: () => void;
}

export default function MonthlyLimitAlert({
  stats,
  onOpenSettings,
}: MonthlyLimitAlertProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: stats.currency,
    }).format(amount);
  };

  // Don't show alert if limit is not set or not enabled
  if (!stats.isLimitSet || !stats.limitEnabled) {
    return null;
  }

  // Only show alerts for warning, critical, and exceeded states
  if (stats.alertLevel === "safe") {
    return null;
  }

  const getAlertConfig = () => {
    switch (stats.alertLevel) {
      case "warning":
        return {
          bgColor: "bg-yellow-50 border-yellow-200",
          textColor: "text-yellow-800",
          iconColor: "text-yellow-600",
          icon: TrendingUp,
          title: "Approaching Monthly Limit",
          message: `You've spent ${stats.percentageUsed.toFixed(
            1
          )}% of your monthly limit.`,
        };
      case "critical":
        return {
          bgColor: "bg-red-50 border-red-200",
          textColor: "text-red-800",
          iconColor: "text-red-600",
          icon: AlertTriangle,
          title: "Critical: Monthly Limit Alert",
          message: `You've spent ${stats.percentageUsed.toFixed(
            1
          )}% of your monthly limit!`,
        };
      case "exceeded":
        return {
          bgColor: "bg-red-100 border-red-300",
          textColor: "text-red-900",
          iconColor: "text-red-700",
          icon: AlertTriangle,
          title: "Monthly Limit Exceeded!",
          message: `You've exceeded your monthly limit by ${formatCurrency(
            stats.currentMonthTotal - (stats.monthlyLimit || 0)
          )}.`,
        };
      default:
        return null;
    }
  };

  const alertConfig = getAlertConfig();
  if (!alertConfig) return null;

  const {
    bgColor,
    textColor,
    iconColor,
    icon: Icon,
    title,
    message,
  } = alertConfig;

  return (
    <Card className={`${bgColor} border-2 mb-6`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon className={`h-5 w-5 ${iconColor} mt-0.5 flex-shrink-0`} />

          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold ${textColor} mb-1`}>{title}</h3>
            <p className={`text-sm ${textColor} mb-3`}>{message}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div className="flex items-center gap-2">
                <DollarSign className={`h-4 w-4 ${iconColor}`} />
                <div>
                  <p className="text-xs text-gray-600">This Month</p>
                  <p className={`font-medium ${textColor}`}>
                    {formatCurrency(stats.currentMonthTotal)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className={`h-4 w-4 ${iconColor}`} />
                <div>
                  <p className="text-xs text-gray-600">Monthly Limit</p>
                  <p className={`font-medium ${textColor}`}>
                    {formatCurrency(stats.monthlyLimit || 0)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full ${iconColor.replace(
                    "text-",
                    "bg-"
                  )}`}
                />
                <div>
                  <p className="text-xs text-gray-600">Days Left</p>
                  <p className={`font-medium ${textColor}`}>
                    {stats.daysRemainingInMonth} days
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  stats.alertLevel === "exceeded"
                    ? "bg-red-600"
                    : stats.alertLevel === "critical"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
                style={{
                  width: `${Math.min(stats.percentageUsed, 100)}%`,
                }}
              />
            </div>

            <div className="flex gap-2">
              {onOpenSettings && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenSettings}
                  className={`border-current ${textColor}`}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Adjust Limit
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

