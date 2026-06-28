// import React, { createContext, useContext, useState } from "react";
// import type { ReactNode } from "react";


// /* =======================
//    TYPES
// ======================= */

// type PersonalInfo = {
//   firstName?: string;
//   lastName?: string;
//   email?: string;
// };

// type ShopInfo = {
//   shopName?: string;
//   shopDescription?: string;
//   subCategories: string[];
// };

// type BusinessInfo = {
//   businessName?: string;
//   businessAddress: Record<string, string>;
// };

// type PaymentInfo = {
//   paypalEmail?: string;
//   bankAccount: Record<string, string>;
// };

// type PlanInfo = {
//   billingCycle: "monthly" | "yearly";
//   selectedPlan?: string;
// };

// type OnboardingData = {
//   personalInfo: PersonalInfo;
//   shopInfo: ShopInfo;
//   businessInfo: BusinessInfo;
//   paymentInfo: PaymentInfo;
//   planInfo: PlanInfo;
// };

// type OnboardingContextType = {
//   onboardingData: OnboardingData;
//   updateData: (
//     section: keyof OnboardingData,
//     field: string,
//     value: any,
//     nested?: string
//   ) => void;
//   currentStep: number;
//   setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
//   validationErrors: Record<string, string>;
//   setValidationErrors: React.Dispatch<
//     React.SetStateAction<Record<string, string>>
//   >;
// };

// /* =======================
//    CONTEXT
// ======================= */

// const OnboardingContext = createContext<OnboardingContextType | null>(
//   null
// );

// export const useOnboarding = () => {
//   const context = useContext(OnboardingContext);
//   if (!context) {
//     throw new Error(
//       "useOnboarding must be used within OnboardingProvider"
//     );
//   }
//   return context;
// };

// /* =======================
//    PROVIDER
// ======================= */

// type ProviderProps = {
//   children: ReactNode;
// };

// export const OnboardingProvider = ({ children }: ProviderProps) => {
//   const [currentStep, setCurrentStep] = useState<number>(1);
//   const [validationErrors, setValidationErrors] = useState<
//     Record<string, string>
//   >({});

//   const [onboardingData, setOnboardingData] =
//     useState<OnboardingData>({
//       personalInfo: {},
//       shopInfo: { subCategories: [] },
//       businessInfo: { businessAddress: {} },
//       paymentInfo: { bankAccount: {} },
//       planInfo: { billingCycle: "monthly" },
//     });

//   const updateData = (
//     section: keyof OnboardingData,
//     field: string,
//     value: any,
//     nested?: string
//   ) => {
//     setOnboardingData((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         ...(nested
//           ? {
//               [field]: {
//                 ...(prev[section] as any)[field],
//                 [nested]: value,
//               },
//             }
//           : { [field]: value }),
//       },
//     }));
//   };

//   return (
//     <OnboardingContext.Provider
//       value={{
//         onboardingData,
//         updateData,
//         currentStep,
//         setCurrentStep,
//         validationErrors,
//         setValidationErrors,
//       }}
//     >
//       {children}
//     </OnboardingContext.Provider>
//   );
// };
