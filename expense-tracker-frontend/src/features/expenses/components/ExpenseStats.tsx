import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useExpenseStats } from "../hooks/useExpenses";
import { DollarSign, TrendingUp, TrendingDown, PieChart } from "lucide-react";
import { PieChart as RechartsPieChart, Pie, Cell } from "recharts";

export default function ExpenseStats() {
  const { data: stats, isLoading, error } = useExpenseStats();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#00ff00",
    "#ff00ff",
    "#00ffff",
    "#ff0000",
    "#0000ff",
    "#ffff00",
  ];

  const pieChartData =
    stats?.expensesByCategory.map((category, index) => ({
      name: category.category,
      value: category.total,
      color: colors[index % colors.length],
    })) || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-2 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-8 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-destructive">
          <p>Something went wrong. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Total Income",
            icon: <TrendingUp className="text-green-600 h-5 w-5" />,
            amount: stats.totalIncome,
            className: "text-green-600",
          },
          {
            title: "Total Expenses",
            icon: <TrendingDown className="text-red-600 h-5 w-5" />,
            amount: stats.totalExpenses,
            className: "text-red-600",
          },
          {
            title: "Balance",
            icon: (
              <DollarSign
                className={`h-5 w-5 ${
                  stats.balance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              />
            ),
            amount: stats.balance,
            className: stats.balance >= 0 ? "text-green-600" : "text-red-600",
          },
        ].map(({ title, icon, amount, className }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              {icon}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${className}`}>
                {formatCurrency(amount)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pie Chart + Legend */}
      {stats.expensesByCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="h-5 w-5" />
              Top Expense Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Pie Chart */}
              <div className="flex-1">
                <ChartContainer className="h-[300px] w-full" config={{}}>
                  <RechartsPieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload?.length) {
                          const { name, value } = payload[0];
                          return (
                            <ChartTooltipContent>
                              <div className="flex flex-col gap-1">
                                <span className="font-semibold">{name}</span>
                                <span className="text-muted-foreground">
                                  {formatCurrency(value as number)}
                                </span>
                              </div>
                            </ChartTooltipContent>
                          );
                        }
                        return null;
                      }}
                    />
                  </RechartsPieChart>
                </ChartContainer>
              </div>

              {/* Legend */}
              <div className="flex flex-col justify-center gap-4 lg:w-1/3">
                {stats.expensesByCategory.map((category, index) => {
                  const percentage =
                    stats.totalExpenses > 0
                      ? (category.total / stats.totalExpenses) * 100
                      : 0;
                  return (
                    <div
                      key={category.category}
                      className="flex items-start gap-3"
                    >
                      {/* <div
                        className="w-2 h-2 rounded-full mt-1"
                        style={{
                          backgroundColor: colors[index % colors.length],
                        }}
                      /> */}
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span
                            style={{ color: colors[index % colors.length] }}
                            className="truncate font-medium"
                          >
                            {category.category}
                          </span>
                          <span className="text-muted-foreground">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div
                          style={{ color: colors[index % colors.length] }}
                          className="text-xs mt-1 font-bold text-muted-foreground"
                        >
                          {formatCurrency(category.total)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

