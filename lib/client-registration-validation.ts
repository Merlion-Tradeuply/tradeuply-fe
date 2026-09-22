export type ClientRegistrationData = {
  ageConfirmed: boolean;
  confirmPassword: string;
  email: string;
  experience: string;
  firstName: string;
  investmentRange: string;
  lastName: string;
  objective: string;
  password: string;
  phone: string;
  riskAccepted: boolean;
  termsAccepted: boolean;
};

export type ClientRegistrationErrors = Partial<Record<keyof ClientRegistrationData, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeInternationalPhone(phone: string) {
  return phone.replace(/[\s()-]/g, "");
}

export function isValidInternationalPhone(phone: string) {
  return /^\+[1-9]\d{7,14}$/.test(normalizeInternationalPhone(phone));
}

export function getPasswordStrength(password: string) {
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  return checks.filter(Boolean).length;
}

export function validateClientRegistrationStep(step: number, data: ClientRegistrationData) {
  const errors: ClientRegistrationErrors = {};

  if (step === 1) {
    if (data.firstName.trim().length < 2) errors.firstName = "Enter your first name.";
    if (data.lastName.trim().length < 2) errors.lastName = "Enter your last name.";
    if (!emailPattern.test(data.email.trim())) errors.email = "Enter a valid email address.";
    if (!isValidInternationalPhone(data.phone)) {
      errors.phone = "Enter a valid phone number beginning with a country code, such as +91.";
    }
  }

  if (step === 2) {
    if (getPasswordStrength(data.password) < 4) {
      errors.password = "Use at least 8 characters with uppercase, lowercase, and a number.";
    }
    if (data.confirmPassword !== data.password) {
      errors.confirmPassword = "The passwords do not match.";
    }
    if (!data.ageConfirmed) errors.ageConfirmed = "Confirm that you are at least 18 years old.";
    if (!data.termsAccepted) errors.termsAccepted = "Accept the Terms and Privacy Policy to continue.";
  }

  if (step === 3) {
    if (!data.investmentRange) errors.investmentRange = "Select an intended investment range.";
    if (!data.objective) errors.objective = "Select your primary investment objective.";
    if (!data.experience) errors.experience = "Select your investment experience.";
    if (!data.riskAccepted) errors.riskAccepted = "Acknowledge the investment-risk statement.";
  }

  return errors;
}
