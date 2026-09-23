export type ApiErrorResponse = {
  error: {
    code: string;
    details?:
      | Array<{ field: string; message: string }>
      | {
          attemptsRemaining?: number;
          canResend?: boolean;
          resendAvailableAt?: string;
          retryAfterSeconds?: number;
        };
    message: string;
  };
  success: false;
};

export type AuthenticatedClient = {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  role: "client";
  status: "active";
};

export type ClientTokenPair = {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
};

export type ClientLoginResponse = {
  data: {
    client: AuthenticatedClient;
  };
  message: string;
  success: true;
};

export type BackendClientSessionResponse = {
  data: {
    client: AuthenticatedClient;
    tokens: ClientTokenPair;
  };
  message: string;
  success: true;
};

export type OtpDelivery = {
  email: string;
  expiresAt: string;
  resendAvailableAt: string;
};

export type ClientRegistrationResponse = {
  data: {
    client: {
      email: string;
      firstName: string;
      id: string;
      status: "pending_verification";
    };
    otp: OtpDelivery;
  };
  message: string;
  success: true;
};

export type VerifyOtpResponse = {
  data: {
    client: {
      email: string;
      firstName: string;
      id: string;
      status: "active";
    };
    verifiedAt: string;
  };
  message: string;
  success: true;
};

export type ResendOtpResponse = {
  data: { otp: OtpDelivery };
  message: string;
  success: true;
};

export type PaymentMethod = {
  asset: string | null;
  category: "bank" | "card" | "crypto" | "wallet";
  code: string;
  displayOrder: number;
  id: string;
  instructions: string;
  maximumAmount: number | null;
  minimumAmount: number | null;
  name: string;
  network: string | null;
  qrCodeUrl: string | null;
  status: "active" | "coming_soon";
  walletAddress?: string | null;
};

export type ClientWalletPaymentMethod = {
  asset: string;
  createdAt: string;
  id: string;
  isDefault: boolean;
  label: string;
  network: string;
  updatedAt: string;
  walletAddress: string;
};

export type DepositActivity = {
  actorLabel: string;
  actorType: "client" | "internal" | "system";
  createdAt: string;
  event:
    | "submitted"
    | "approved"
    | "rejected"
    | "balance_credited"
    | "note_added";
  id: string;
  metadata: Record<string, string>;
  newStatus: string | null;
  previousStatus: string | null;
};

export type Deposit = {
  activities: DepositActivity[];
  amount: string;
  asset: string;
  clientNotes: string;
  convertedAmount: string | null;
  convertedAsset: string | null;
  createdAt: string;
  destinationWalletAddress: string;
  id: string;
  methodCode: string;
  methodName: string;
  network: string;
  paymentCategory: "crypto" | "wallet";
  exchangeRate: string | null;
  quoteExpiresAt: string | null;
  rateQuotedAt: string | null;
  rateSource: string | null;
  reviewNotes: string;
  reviewedAt: string | null;
  senderWalletAddress: string;
  status: "approved" | "pending" | "rejected";
  transactionHash: string;
  updatedAt: string;
};

export type ClientBalance = {
  availableBalance: string;
  currency: string;
  lastTransactionAt: string | null;
  lockedBalance: string;
  totalDeposited: string;
  totalWithdrawn: string;
};

export type Withdrawal = {
  amount: string;
  asset: string;
  createdAt: string;
  destinationLabel: string;
  destinationNetwork: string;
  destinationWalletAddress: string;
  id: string;
  paymentMethodId: string;
  reviewNotes: string;
  reviewedAt: string | null;
  status: "approved" | "pending" | "rejected";
  updatedAt: string;
};

export type CurrencyConversion = {
  amount: number;
  convertedAmount: number;
  from: { code: string; name: string; type: string };
  lastUpdated: string;
  quoteExpiresAt: string;
  rate: number;
  source: string;
  to: { code: string; name: string; type: string };
};

export type ClientInvestment = {
  amountUsd: string;
  capitalReturnedAt: string | null;
  createdAt: string;
  daysCompleted: number;
  daysRemaining: number;
  exchangeRate: string;
  id: string;
  maturesAt: string;
  plan: {
    allocation: string;
    dailyObjective: number;
    horizonDays: number;
    name: string;
    risk: string;
    slug: string;
  };
  profit: {
    accruedDays: number;
    availableUsd: string;
    availableWalletAmount: string;
    dailyUsd: string;
    dailyWalletAmount: string;
    entries?: ClientInvestmentProfit[];
    totalAccruedUsd: string;
    totalAccruedWalletAmount: string;
    withdrawnUsd: string;
    withdrawnWalletAmount: string;
  };
  progressPercent: number;
  projectedProfitUsd: string;
  projectedTotalUsd: string;
  quoteExpiresAt: string;
  rateQuotedAt: string;
  rateSource: string;
  startsAt: string;
  status: "active" | "matured" | "completed" | "cancelled";
  walletAmount: string;
  walletCurrency: string;
};

export type ClientInvestmentProfit = {
  amountUsd: string;
  creditDate: string;
  dayNumber: number;
  id: string;
  kind: "daily" | "bonus";
  note: string;
  status: "available" | "withdrawn";
  walletAmount: string;
  walletCurrency: string;
  withdrawnAt: string | null;
};

export type InvestmentProfitWithdrawal = {
  amount: string;
  amountUsd: string;
  currency: string;
  exchangeRate: string;
  id: string;
  quoteExpiresAt: string;
  rateQuotedAt: string;
  rateSource: string;
};

export type ClientTransactionType =
  | "deposit"
  | "withdrawal"
  | "adjustment"
  | "investment"
  | "capital_return"
  | "profit_withdrawal";

export type ClientTransaction = {
  amount: string;
  amountUsd: string | null;
  balanceAfter: string;
  balanceBefore: string;
  createdAt: string;
  currency: string;
  description: string;
  destination: string;
  direction: "credit" | "debit";
  exchangeRate: string | null;
  id: string;
  reference: string;
  source: string;
  sourceAmount: string | null;
  sourceCurrency: string | null;
  type: ClientTransactionType;
};

export type ClientTransactionResult = {
  currencies: string[];
  pagination: {
    limit: number;
    page: number;
    pages: number;
    total: number;
  };
  summary: {
    credits: number;
    debits: number;
    total: number;
  };
  transactions: ClientTransaction[];
};
