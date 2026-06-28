import { useCallback, useState, useEffect } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/index";
import {
  updateOnboardingField,
  setOnboardingData,
} from "../store/slices/creatorOnboardingSlice";
import { applyToBeCreator } from "../store/slices/creatorSlice";
import { updateUser } from "../store/slices/authSlice";
import { onboardingAPI } from "../services/api";
import Step1Personal from "./creator/onboarding/Step1Personal";
import Step2Shop from "./creator/onboarding/Step2Shop";
import Step3Business from "./creator/onboarding/Step3Business";
import Step4Payment from "./creator/onboarding/Step4Payment";
import Step5Plan from "./creator/onboarding/Step5Plan";
import Button from "../components/ui/Button";
// ADD THIS AT THE TOP
interface ValidationErrors {
  [key: string]: string[];
}
const STEP_ORDER = [
  "personal-details",
  "setup-shop",
  "business-details",
  "payment",
  "plans",
];

const CreatorOnboardingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { stepName } = useParams<{ stepName: string }>();

  // 1. Switch from local state to Redux state
  const onboardingData = useSelector(
    (state: RootState) => state.creatorOnboarding,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const currentIndex = STEP_ORDER.indexOf(stepName || "personal-details");
  const currentStep = currentIndex + 1;

  // Fetch existing onboarding data on mount
  useEffect(() => {
    const fetchOnboardingData = async () => {
      try {
        setIsLoading(true);
        const response = await onboardingAPI.getOnboardingData();
        if (response.data && response.data.onboardingData) {
          // Merge fetched data with initial state to ensure all fields exist
          const fetchedData = response.data.onboardingData;
          if (Object.keys(fetchedData).length > 0) {
            dispatch(setOnboardingData(fetchedData));
          }
        }
      } catch (error) {
        console.error("Failed to fetch onboarding data:", error);
        // Continue with empty state if fetch fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchOnboardingData();
  }, [dispatch]);

  // 2. Map local updateData to Redux dispatch
  const updateData = useCallback(
    (section: any, field: string, value: any, nested?: string) => {
      dispatch(updateOnboardingField({ section, field, value, nested }));
    },
    [dispatch],
  );

  // Helper function to check if current step is complete (all required fields filled)
  const isCurrentStepComplete = (): boolean => {
    switch (currentStep) {
      case 1: // Personal Info
        const personal = onboardingData.personalInfo;
        return (
          personal.firstName.trim() !== "" &&
          personal.lastName.trim() !== "" &&
          personal.email.trim() !== "" &&
          personal.phone.trim() !== "" &&
          personal.dateOfBirth.trim() !== ""
        );

      case 2: // Shop Setup
        const shop = onboardingData.shopInfo;
        return (
          shop.shopName.trim() !== "" &&
          shop.shopDescription.trim() !== "" &&
          shop.category !== ""
        );

      case 3: // Business Details
        const business = onboardingData.businessInfo;
        return (
          business.businessType.trim() !== "" &&
          business.businessName.trim() !== "" &&
          business.taxId.trim() !== "" &&
          business.businessPhone.trim() !== "" &&
          business.businessEmail.trim() !== "" &&
          business.businessAddress.street.trim() !== "" &&
          business.businessAddress.city.trim() !== "" &&
          business.businessAddress.state.trim() !== "" &&
          business.businessAddress.zipCode.trim() !== "" &&
          business.businessAddress.country.trim() !== ""
        );

      case 4: // Payment Info
        const payment = onboardingData.paymentInfo;
        if (payment.accountType === "paypal") {
          return (
            payment.paypalEmail?.trim() !== "" && payment.termsAccepted === true
          );
        } else {
          return (
            payment.bankAccount?.accountNumber?.trim() !== "" &&
            payment.bankAccount?.bankName?.trim() !== "" &&
            payment.termsAccepted === true
          );
        }

      case 5: // Plans
        return onboardingData.planInfo.selectedPlan !== "";

      default:
        return false;
    }
  };

  const validateStep = (stepNumber: number): ValidationErrors => {
    const errors: ValidationErrors = {};

    switch (stepNumber) {
      case 1: // Personal Info
        const personal = onboardingData.personalInfo;
        if (!personal.firstName.trim())
          errors.firstName = ["First name is required"];
        if (!personal.lastName.trim())
          errors.lastName = ["Last name is required"];
        if (!personal.email.trim()) errors.email = ["Email is required"];
        if (!personal.phone.trim()) errors.phone = ["Phone is required"];
        if (!personal.dateOfBirth.trim())
          errors.dateOfBirth = ["Date of birth is required"];
        break;

      case 2: // Shop Setup
        const shop = onboardingData.shopInfo;
        if (!shop.shopName.trim()) errors.shopName = ["Shop name is required"];
        if (!shop.shopDescription.trim())
          errors.shopDescription = ["Shop description is required"];
        if (!shop.category) errors.category = ["Please select a category"];
        break;

      case 3: // Business Details
        const business = onboardingData.businessInfo;
        if (!business.businessType.trim())
          errors.businessType = ["Business type is required"];
        if (!business.businessName.trim())
          errors.businessName = ["Business name is required"];
        if (!business.taxId.trim()) errors.taxId = ["Tax ID is required"];
        if (!business.businessPhone.trim())
          errors.businessPhone = ["Business phone is required"];
        if (!business.businessEmail.trim())
          errors.businessEmail = ["Business email is required"];
        if (!business.businessAddress.street.trim())
          errors.street = ["Street address is required"];
        if (!business.businessAddress.city.trim())
          errors.city = ["City is required"];
        if (!business.businessAddress.state.trim())
          errors.state = ["State is required"];
        if (!business.businessAddress.zipCode.trim())
          errors.zipCode = ["ZIP code is required"];
        if (!business.businessAddress.country.trim())
          errors.country = ["Country is required"];
        break;

      case 4: // Payment Info
        const payment = onboardingData.paymentInfo;
        if (payment.accountType === "paypal") {
          if (!payment.paypalEmail?.trim())
            errors.paypalEmail = ["PayPal email is required"];
        } else {
          if (!payment.bankAccount?.accountNumber?.trim())
            errors.accountNumber = ["Account number is required"];
          if (!payment.bankAccount?.bankName?.trim())
            errors.bankName = ["Bank name is required"];
        }
        if (!payment.termsAccepted)
          errors.termsAccepted = ["You must accept the terms"];
        break;

      case 5: // Plans
        if (!onboardingData.planInfo.selectedPlan)
          errors.selectedPlan = ["Please select a plan"];
        break;

      default:
        break;
    }

    return errors;
  };

  const handleNext = async () => {
    // 1. Determine the current step number (1-indexed based on your switch case)
    const currentStepNumber = currentIndex + 1;

    // 2. Run the validation logic you defined in validateStep
    // Note: validateStep returns ValidationErrors (Record<string, string[]>)
    const errors = validateStep(currentStepNumber);

    // 3. Update the state to show errors in the UI
    setValidationErrors(errors);

    // 4. GUARD: Check if there are any error messages in the object
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      // Stop the function here if there are errors
      console.log("Validation failed:", errors);
      alert("Please! Enter all the required Details Properly");

      // Optional: Scroll to the first error
      setTimeout(() => {
        const firstError = document.querySelector('[data-error="true"]');
        firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);

      return;
    }

    // 5. Save current step data to backend before proceeding
    try {
      setIsSubmitting(true);

      // Save the current step data
      switch (currentStepNumber) {
        case 1:
          await onboardingAPI.saveStep1(onboardingData.personalInfo);
          break;
        case 2:
          await onboardingAPI.saveStep2(onboardingData.shopInfo);
          break;
        case 3:
          await onboardingAPI.saveStep3(onboardingData.businessInfo);
          break;
        case 4:
          await onboardingAPI.saveStep4(onboardingData.paymentInfo);
          break;
        case 5:
          await onboardingAPI.saveStep5(onboardingData.planInfo);
          break;
      }

      // 6. SUCCESS: If no errors, proceed with navigation or final submission
      const nextStepName = STEP_ORDER[currentIndex + 1];

      if (nextStepName) {
        // Clear errors for the next page
        setValidationErrors({});
        navigate(`/creator/onboarding/${nextStepName}`);
        setIsSubmitting(false);
      } else {
        // Final Submission Logic - Complete the onboarding
        console.log("Completing onboarding with data: ", onboardingData);

        // Call the complete onboarding API
        const response = await onboardingAPI.completeOnboarding();

        if (response.data?.creatorProfile) {
          // Update the user role in auth state
          dispatch(updateUser({ role: "creator" }));
        }

        navigate("/creator/dashboard", { replace: true });
      }
    } catch (error: any) {
      console.error("Failed to save step data:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to save data. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    const prevStepName = STEP_ORDER[currentIndex - 1];
    if (prevStepName) navigate(`/creator/onboarding/${prevStepName}`);
  };

  const renderStep = () => {
    // Props remain EXACTLY the same for the child components
    const props = { onboardingData, updateData, validationErrors };
    switch (stepName) {
      case "personal-details":
        return <Step1Personal {...props} />;
      case "setup-shop":
        return <Step2Shop {...props} />;
      case "business-details":
        return <Step3Business {...props} />;
      case "payment":
        return <Step4Payment {...props} />;
      case "plans":
        return <Step5Plan {...props} />;
      default:
        return <Navigate to={`/creator/onboarding/${STEP_ORDER[0]}`} replace />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-10 px-4 relative">
      {(isSubmitting || isLoading) && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 dark:bg-gray-950/90">
          <div className="w-14 h-14 border-4 border-secondary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "Loading your data..." : "Saving your progress..."}
          </h2>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <div className="flex justify-between items-end mb-4">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white capitalize">
              {stepName?.replace("-", " ")}
            </h1>
            <span className="text-sm font-bold text-secondary-600 px-3 py-1 rounded-full bg-secondary-50">
              Step {currentStep} of 5
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 h-2.5 rounded-full">
            <div
              className="bg-secondary-600 h-full transition-all duration-700"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 md:p-12">
          {renderStep()}
        </div>

        <div className="mt-8 flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentIndex === 0 || isSubmitting}
            className="w-32"
          >
            Back
          </Button>

          {/* Next button only shows when all required fields are filled */}
          {isCurrentStepComplete() && (
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="w-44"
            >
              {isSubmitting
                ? "Processing..."
                : currentIndex === STEP_ORDER.length - 1
                  ? "Finish & Launch"
                  : "Next Step"}
            </Button>
          )}

          {/* Show hint message if step is not complete */}
          {!isCurrentStepComplete() && (
            <div className="flex items-center justify-end text-sm text-gray-500 dark:text-gray-400">
              <span className="animate-pulse">
                ↑ Fill all required fields to continue
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorOnboardingPage;
