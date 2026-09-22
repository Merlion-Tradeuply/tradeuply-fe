import type { Metadata } from "next";

import { ClientRegistrationBenefits } from "@/components/client/client-registration-benefits";
import { ClientRegistrationForm } from "@/components/client/client-registration-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Open an Investment Account | TradeUply",
  description:
    "Create your TradeUply account to compare structured investment plans, review transparent profit projections, and track your investment journey.",
};

export default function RegisterPage() {
  return (
    <main className="mt-[7.5rem] min-h-screen bg-[#f4f8f6] sm:mt-[8.5rem] lg:mt-36">
      <Container className="grid items-start gap-6 py-8 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:py-16 xl:grid-cols-[0.95fr_1.05fr]">
        <ClientRegistrationBenefits />
        <ClientRegistrationForm />
      </Container>
    </main>
  );
}
