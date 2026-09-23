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
  qrCodeUrl: string | null;
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
  createdAt: string;
  destinationWalletAddress: string;
  id: string;
  methodCode: string;
  methodName: string;
  network: string;
  paymentProofUrl: string | null;
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
  status: "available" | "withdrawn";
  walletAmount: string;
  walletCurrency: string;
  withdrawnAt: string | null;
};
