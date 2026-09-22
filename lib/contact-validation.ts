export type ContactData = {
  email: string;
  fullName: string;
  message: string;
  subject: string;
};

export type ContactErrors = Partial<Record<keyof ContactData, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(data: ContactData) {
  const errors: ContactErrors = {};

  if (data.fullName.trim().length < 2) {
    errors.fullName = "Enter your full name.";
  }

  if (!emailPattern.test(data.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.subject) {
    errors.subject = "Select an enquiry subject.";
  }

  if (data.message.trim().length < 20) {
    errors.message = "Enter at least 20 characters so the support team can understand your enquiry.";
  }

  return errors;
}
