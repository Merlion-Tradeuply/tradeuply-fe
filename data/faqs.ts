export const faqCategories = [
  "All Questions",
  "Getting Started",
  "Accounts & Verification",
  "Investment Plans",
  "Profit Calculations",
  "Deposits & Withdrawals",
  "Risk & Security",
] as const;

export type FaqCategory = Exclude<(typeof faqCategories)[number], "All Questions">;

export type FaqItem = {
  answer: string;
  category: FaqCategory;
  question: string;
};

export const faqItems: FaqItem[] = [
  {
    answer:
      "TradeUply is an online investment platform designed to make structured plans, projected profit calculations, market categories, durations, and risk information easier to review in one place.",
    category: "Getting Started",
    question: "What is TradeUply?",
  },
  {
    answer:
      "Start by comparing the available plans and using the profit calculator. When you are ready, create an account, complete your investor profile, and review all applicable terms before proceeding.",
    category: "Getting Started",
    question: "How do I get started?",
  },
  {
    answer:
      "No. The platform presents key plan information in a structured format for both new and experienced investors. You should still assess whether an investment is appropriate for your circumstances and seek independent advice when needed.",
    category: "Getting Started",
    question: "Do I need previous investment experience?",
  },
  {
    answer:
      "Registration currently asks for your name, email address, phone number with international country code, a password, and a short investor profile. Additional eligibility or identity checks may apply before account services become available.",
    category: "Accounts & Verification",
    question: "What information is needed to create an account?",
  },
  {
    answer:
      "You must confirm that you are at least 18 years old when creating an account. Regional eligibility and service availability may also apply.",
    category: "Accounts & Verification",
    question: "Is there a minimum age requirement?",
  },
  {
    answer:
      "Use the contact page or email trade@tradeuply.com for account-access assistance. A self-service password recovery flow can be connected when the authentication backend is implemented.",
    category: "Accounts & Verification",
    question: "What should I do if I cannot access my account?",
  },
  {
    answer:
      "TradeUply currently presents six plans: Essential, Income, Balanced, Global Growth, Future Focus, and Wealth Select. Each plan displays its minimum amount, objective, fixed term, risk level, and strategy information.",
    category: "Investment Plans",
    question: "How many investment plans are available?",
  },
  {
    answer:
      "Plan terms currently range from 3 to 7 days. The exact duration is shown on every plan card and in the profit calculator before you proceed.",
    category: "Investment Plans",
    question: "How long does an investment plan run?",
  },
  {
    answer:
      "The lowest displayed starting amount is $100. Minimum amounts vary by plan, so the calculator automatically applies the minimum for the plan you select.",
    category: "Investment Plans",
    question: "What is the minimum investment amount?",
  },
  {
    answer:
      "Compare the minimum amount, daily objective, duration, risk level, and strategy mix shown for each plan. A higher objective can involve greater risk, so the largest projected outcome is not automatically the most suitable choice.",
    category: "Investment Plans",
    question: "How should I compare the plans?",
  },
  {
    answer:
      "The calculator multiplies your investment amount by the plan's daily objective percentage to estimate daily profit. It then multiplies daily profit by the plan duration. Projected total equals the original investment plus projected total profit.",
    category: "Profit Calculations",
    question: "How is projected profit calculated?",
  },
  {
    answer:
      "No. Calculator results and plan objectives are illustrative projections, not guaranteed returns. Actual outcomes can vary, and capital may be at risk.",
    category: "Profit Calculations",
    question: "Are the calculator results guaranteed?",
  },
  {
    answer:
      "The current calculator excludes fees, taxes, withdrawals, and market changes. Review the final transaction terms and obtain tax guidance relevant to your location before making a decision.",
    category: "Profit Calculations",
    question: "Does the calculator include fees or taxes?",
  },
  {
    answer:
      "Available funding methods will depend on your verified account and region. Supported methods, limits, and any applicable charges should be displayed for confirmation before a transaction is submitted.",
    category: "Deposits & Withdrawals",
    question: "Which deposit methods are supported?",
  },
  {
    answer:
      "Withdrawal eligibility, processing steps, and timing can depend on verification, the selected plan, and the chosen payment method. These details should be confirmed in your account before requesting a withdrawal.",
    category: "Deposits & Withdrawals",
    question: "How do withdrawals work?",
  },
  {
    answer:
      "Public plan amounts and projections are currently displayed in US dollars. Contact the TradeUply team to confirm regional currency and payment availability before funding an account.",
    category: "Deposits & Withdrawals",
    question: "Which currency does TradeUply use?",
  },
  {
    answer:
      "Yes. Investment values and returns can change, objectives may not be achieved, and you may lose some or all of the capital committed. Review the displayed risk level and all applicable disclosures before proceeding.",
    category: "Risk & Security",
    question: "Can my investment lose value?",
  },
  {
    answer:
      "Use a unique password, keep account credentials private, verify the website address before signing in, and contact support if you notice unfamiliar activity. TradeUply will never need you to disclose your password by email.",
    category: "Risk & Security",
    question: "How can I help protect my account?",
  },
  {
    answer:
      "Every plan shows a risk label alongside its objective and duration. These labels are a comparison aid and do not remove investment risk or replace an assessment of your personal circumstances.",
    category: "Risk & Security",
    question: "What do the plan risk levels mean?",
  },
];
