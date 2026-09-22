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
  currency: "USDT";
  lastTransactionAt: string | null;
  lockedBalance: string;
  totalDeposited: string;
  totalWithdrawn: string;
};
