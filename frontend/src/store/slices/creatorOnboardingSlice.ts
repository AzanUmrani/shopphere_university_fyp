// import { createSlice } from "@reduxjs/toolkit";
// import type {  PayloadAction } from "@reduxjs/toolkit";

// export interface OnboardingData {
//   personalInfo: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
//     dateOfBirth: string;
//     profileImage: string;
//   };
//   shopInfo: {
//     shopName: string;
//     shopDescription: string;
//     shopUrl: string;
//     category: string;
//     subCategories: string[];
//     website: string;
//     instagram: string;
//     facebook: string;
//     twitter: string;
//     shopLogo: string;
//     shopBanner: string;
//   };
//   businessInfo: {
//     businessType: string;
//     businessName: string;
//     taxId: string;
//     businessPhone: string;
//     businessEmail: string;
//     businessLicense: string;
//     businessAddress: {
//       street: string;
//       city: string;
//       state: string;
//       zipCode: string;
//       country: string;
//     };
//   };
//   paymentInfo: {
//     accountType: string;
//     bankAccount: {
//       accountHolderName: string;
//       bankName: string;
//       accountNumber: string;
//       routingNumber: string;
//       accountType: string;
//     };
//     paypalEmail: string;
//     termsAccepted: boolean;
//     privacyAccepted: boolean;
//     processingTimeAccepted: boolean;
//   };
//   planInfo: {
//     selectedPlan: string;
//     billingCycle: "monthly" | "yearly";
//   };
// }

// const initialState: OnboardingData = {
//   personalInfo: { firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "", profileImage: "" },
//   shopInfo: {
//     shopName: "", shopDescription: "", shopUrl: "", category: "", subCategories: [], website: "", instagram: "", facebook: "", twitter: "", shopLogo: "", shopBanner: ""
//   },
//   businessInfo: {
//     businessType: "", businessName: "", taxId: "", businessPhone: "", businessEmail: "", businessLicense: "", businessAddress: { street: "", city: "", state: "", zipCode: "", country: "" }
//   },
//   paymentInfo: {
//     accountType: "bank",
//     bankAccount: { accountHolderName: "", bankName: "", accountNumber: "", routingNumber: "", accountType: "checking" },
//     paypalEmail: "", termsAccepted: false, privacyAccepted: false, processingTimeAccepted: false
//   },
//   planInfo: { selectedPlan: "pro", billingCycle: "monthly" },
// };

// const creatorSlice = createSlice({
//   name: "creatorOnboarding",
//   initialState,
//   reducers: {
//     updateField: (state, action: PayloadAction<{ section: keyof OnboardingData; field: string; value: any; nested?: string }>) => {
//       const { section, field, value, nested } = action.payload;
//       if (nested) {
//         (state[section] as any)[nested][field] = value;
//       } else {
//         (state[section] as any)[field] = value;
//       }
//     },
//     resetOnboarding: () => initialState,
//   },
// });

// export const { updateField, resetOnboarding } = creatorSlice.actions;
// export default creatorSlice.reducer;

// src/store/slices/creatorOnboardingSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { OnboardingData } from "../../pages/creator/onboarding/onboarding.types"; // Move your interface to a shared types file

const initialState: OnboardingData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    profileImage: "",
  },
  shopInfo: {
    shopName: "",
    shopDescription: "",
    shopUrl: "",
    category: "",
    subCategories: [],
    website: "",
    instagram: "",
    shopLogo: "",
    shopBanner: "",
  },
  businessInfo: {
    businessType: "",
    businessName: "",
    taxId: "",
    businessPhone: "",
    businessEmail: "",
    businessLicense: "",
    businessAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  },
  paymentInfo: {
    accountType: "bank",
    bankAccount: {
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      routingNumber: "",
    },
    paypalEmail: "",
    termsAccepted: false,
    privacyAccepted: false,
    processingTimeAccepted: false,
  },
  planInfo: { selectedPlan: "pro", billingCycle: "monthly" },
};

const mergeOnboardingData = (
  currentState: OnboardingData,
  incomingData: Partial<OnboardingData>,
): OnboardingData => ({
  personalInfo: {
    ...currentState.personalInfo,
    ...(incomingData.personalInfo ?? {}),
  },
  shopInfo: {
    ...currentState.shopInfo,
    ...(incomingData.shopInfo ?? {}),
    subCategories:
      incomingData.shopInfo?.subCategories ??
      currentState.shopInfo.subCategories,
  },
  businessInfo: {
    ...currentState.businessInfo,
    ...(incomingData.businessInfo ?? {}),
    businessAddress: {
      ...currentState.businessInfo.businessAddress,
      ...(incomingData.businessInfo?.businessAddress ?? {}),
    },
  },
  paymentInfo: {
    ...currentState.paymentInfo,
    ...(incomingData.paymentInfo ?? {}),
    bankAccount: {
      ...currentState.paymentInfo.bankAccount,
      ...(incomingData.paymentInfo?.bankAccount ?? {}),
    },
  },
  planInfo: {
    ...currentState.planInfo,
    ...(incomingData.planInfo ?? {}),
  },
});

const creatorOnboardingSlice = createSlice({
  name: "creatorOnboarding",
  initialState,
  reducers: {
    // This replicates your exact 'updateData' logic to maintain 1:1 behavior
    updateOnboardingField: (
      state,
      action: PayloadAction<{
        section: keyof OnboardingData;
        field: string;
        value: any;
        nested?: string;
      }>,
    ) => {
      const { section, field, value, nested } = action.payload;
      if (nested) {
        // Handle nested objects like businessAddress or bankAccount
        (state[section] as any)[field][nested] = value;
      } else {
        // Handle direct fields
        (state[section] as any)[field] = value;
      }
    },
    // Set entire onboarding data (for loading from backend)
    setOnboardingData: (
      state,
      action: PayloadAction<Partial<OnboardingData>>,
    ) => {
      return mergeOnboardingData(state, action.payload);
    },
    resetOnboarding: () => initialState,
  },
});

export const { updateOnboardingField, setOnboardingData, resetOnboarding } =
  creatorOnboardingSlice.actions;
export default creatorOnboardingSlice.reducer;
