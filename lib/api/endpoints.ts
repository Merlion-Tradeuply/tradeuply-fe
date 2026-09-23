export const API_ENDPOINTS = {
  backend: {
    clientLogin: "/client/login",
    clientLogout: "/client/logout",
    clientMe: "/client/me",
    clientBalance: "/client/balance",
    clientInvestments: "/client/investments",
    clientInvestment: (investmentId: string) =>
      `/client/investments/${investmentId}`,
    clientInvestmentCapitalTransfer: (investmentId: string) =>
      `/client/investments/${investmentId}/capital-transfer`,
    clientInvestmentProfitWithdrawal: (investmentId: string) =>
      `/client/investments/${investmentId}/profit-withdrawal`,
    currencyConversion: "/currency/convert",
    clientDeposits: "/client/deposits",
    clientPaymentMethods: "/client/payment-methods",
    clientWallets: "/client/wallets",
    clientWallet: (methodId: string) => `/client/wallets/${methodId}`,
    clientWalletQrSignature: (methodId: string) =>
      `/client/wallets/${methodId}/qr-code/signature`,
    clientWalletQrComplete: (methodId: string) =>
      `/client/wallets/${methodId}/qr-code/complete`,
    clientTransactions: "/client/transactions",
    publicInvestmentPlans: "/investment-plans/public",
    clientRegistration: "/client/signup",
    clientTokenRefresh: "/client/token/refresh",
    resendOtp: "/client/otp/resend",
    verifyOtp: "/client/otp/verify",
  },
  client: {
    clientLogin: "/api/client/login",
    clientLogout: "/api/client/logout",
    clientRegistration: "/api/client/signup",
    clientSession: "/api/client/session",
    clientBalance: "/api/client/balance",
    clientInvestments: "/api/client/investments",
    clientInvestment: (investmentId: string) =>
      `/api/client/investments/${investmentId}`,
    clientInvestmentCapitalTransfer: (investmentId: string) =>
      `/api/client/investments/${investmentId}/capital-transfer`,
    clientInvestmentProfitWithdrawal: (investmentId: string) =>
      `/api/client/investments/${investmentId}/profit-withdrawal`,
    currencyConversion: "/api/client/currency/convert",
    clientDeposits: "/api/client/deposits",
    clientPaymentMethods: "/api/client/payment-methods",
    clientWallets: "/api/client/wallets",
    clientWallet: (methodId: string) => `/api/client/wallets/${methodId}`,
    clientWalletQrSignature: (methodId: string) =>
      `/api/client/wallets/${methodId}/qr-code/signature`,
    clientWalletQrComplete: (methodId: string) =>
      `/api/client/wallets/${methodId}/qr-code/complete`,
    clientTransactions: "/api/client/transactions",
    publicInvestmentPlans: "/api/investment-plans",
    clientTokenRefresh: "/api/client/token/refresh",
    resendOtp: "/api/client/otp/resend",
    verifyOtp: "/api/client/otp/verify",
  },
} as const;
