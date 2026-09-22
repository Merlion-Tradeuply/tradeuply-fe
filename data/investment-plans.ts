export type InvestmentPlan = {
  allocation: string;
  badge: string | null;
  dailyObjective: number;
  description: string;
  displayOrder: number;
  features: string[];
  horizonDays: number;
  icon: "chart" | "coins" | "globe" | "leaf" | "shield" | "sparkle";
  id: string;
  isFeatured: boolean;
  minimumInvestment: number;
  name: string;
  risk: string;
  slug: string;
  status: "active" | "coming_soon" | "disabled";
};

export type InvestmentPlanId = string;

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    style: "currency",
  }).format(value);
}

export function calculatePlanProjection(
  amount: number,
  dailyObjective: number,
  horizonDays: number,
) {
  const dailyProfit = amount * (dailyObjective / 100);
  const profit = dailyProfit * horizonDays;
  return { dailyProfit, profit, total: amount + profit };
}
