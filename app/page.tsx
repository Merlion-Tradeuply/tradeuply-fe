import { HomeHero } from "@/components/sections/home-hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { InvestmentApproach } from "@/components/sections/investment-approach";
import { InvestmentPlans } from "@/components/sections/investment-plans";
import { MarketsExplorer } from "@/components/sections/markets-explorer";
import { ProfitCalculator } from "@/components/sections/profit-calculator";
import { SecurityTransparency } from "@/components/sections/security-transparency";
import { WhyTradeUply } from "@/components/sections/why-tradeuply";
import { getPublicInvestmentPlans } from "@/services/investment-plan.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const plans = await getPublicInvestmentPlans();
  return (
    <main>
      <HomeHero />
      <WhyTradeUply />
      <MarketsExplorer />
      <InvestmentApproach plans={plans} />
      <InvestmentPlans plans={plans} />
      <ProfitCalculator plans={plans} />
      <SecurityTransparency />
      <HowItWorks />
    </main>
  );
}
