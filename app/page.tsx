import { HomeHero } from "@/components/sections/home-hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { InvestmentApproach } from "@/components/sections/investment-approach";
import { InvestmentPlans } from "@/components/sections/investment-plans";
import { MarketsExplorer } from "@/components/sections/markets-explorer";
import { ProfitCalculator } from "@/components/sections/profit-calculator";
import { SecurityTransparency } from "@/components/sections/security-transparency";
import { WhyTradeUply } from "@/components/sections/why-tradeuply";

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <WhyTradeUply />
      <MarketsExplorer />
      <InvestmentApproach />
      <InvestmentPlans />
      <ProfitCalculator />
      <SecurityTransparency />
      <HowItWorks />
    </main>
  );
}
