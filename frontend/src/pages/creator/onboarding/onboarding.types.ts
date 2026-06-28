export interface OnboardingData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    profileImage: string;
  };
  shopInfo: {
    shopName: string;
    shopUrl: string;
    shopDescription: string;
    category: string;
    subCategories: string[];
    website: string;
    instagram: string;
    shopLogo: string;
    shopBanner: string;
  };
  businessInfo: {
    businessType: string;
    businessName: string;
    taxId: string;
    businessPhone: string;
    businessEmail: string;
    businessAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    businessLicense: string;
  };
  paymentInfo: {
    accountType: string;
    bankAccount: {
      accountHolderName: string;
      bankName: string;
      accountNumber: string;
      routingNumber: string;
    };
    paypalEmail: string;
    termsAccepted: boolean;
    privacyAccepted: boolean;
    processingTimeAccepted: boolean;
  };
  planInfo: {
    selectedPlan: string;
    billingCycle: "monthly" | "yearly";
  };
}