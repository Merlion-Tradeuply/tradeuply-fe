export const investmentPlanTerms = [
  {
    horizonDays: 7,
    id: "essential",
    minimum: 50,
    name: "Essential",
    objective: 5,
    risk: "Lower",
  },
  {
    horizonDays: 7,
    id: "income",
    minimum: 500,
    name: "Income",
    objective: 7,
    risk: "Low–moderate",
  },
  {
    horizonDays: 7,
    id: "balanced",
    minimum: 1_000,
    name: "Balanced",
    objective: 10,
    risk: "Moderate",
  },
  {
    horizonDays: 5,
    id: "global-growth",
    minimum: 5_000,
    name: "Global Growth",
    objective: 13,
    risk: "Moderate–high",
  },
  {
    horizonDays: 5,
    id: "future-focus",
    minimum: 2_500,
    name: "Future Focus",
    objective: 18,
    risk: "Higher",
  },
  {
    horizonDays: 5,
    id: "wealth-select",
    minimum: 10_000,
    name: "Wealth Select",
    objective: 21,
    risk: "Personalized",
  },
] as const;

export type InvestmentPlanId = (typeof investmentPlanTerms)[number]["id"];

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

  return {
    dailyProfit,
    profit,
    total: amount + profit,
  };
}
