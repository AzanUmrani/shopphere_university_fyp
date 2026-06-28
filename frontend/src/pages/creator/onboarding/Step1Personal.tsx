import { Phone } from "lucide-react";
import { InputField, FileUpload } from "./OnboardingFields";
import type { OnboardingData } from "./onboarding.types";

interface StepProps {
  onboardingData: OnboardingData;
  updateData: (
    section: keyof OnboardingData,
    field: string,
    value: any,
    nested?: string,
  ) => void;
  validationErrors: any;
}

const Step1Personal = ({
  onboardingData,
  updateData,
  validationErrors,
}: StepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="First Name"
          name="firstName"
          placeholder="Enter First name"
          value={onboardingData.personalInfo.firstName}
          onChange={(e: any) =>
            updateData("personalInfo", "firstName", e.target.value)
          }
          required
          validationErrors={validationErrors}
        />
        <InputField
          label="Last Name"
          name="lastName"
          placeholder="Enter last name"
          value={onboardingData.personalInfo.lastName}
          onChange={(e: any) =>
            updateData("personalInfo", "lastName", e.target.value)
          }
          required
          validationErrors={validationErrors}
        />
      </div>
      <InputField
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter Email address"
        value={onboardingData.personalInfo.email}
        onChange={(e: any) =>
          updateData("personalInfo", "email", e.target.value)
        }
        required
        validationErrors={validationErrors}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Phone Number"
          name="phone"
          placeholder="Enter Phone number"
          value={onboardingData.personalInfo.phone}
          onChange={(e: any) =>
            updateData("personalInfo", "phone", e.target.value)
          }
          leftIcon={<Phone size={16} />}
          required
          validationErrors={validationErrors}
        />
        <InputField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={onboardingData.personalInfo.dateOfBirth}
          onChange={(e: any) =>
            updateData("personalInfo", "dateOfBirth", e.target.value)
          }
          validationErrors={validationErrors}
          required
        />
      </div>
      <FileUpload
        label="Profile Picture (Optional)"
        name="profileImage"
        accept="image/*"
        description="PNG, JPG up to 2MB (Square, at least 200x200px recommended)"
        onChange={(url: string) =>
          updateData("personalInfo", "profileImage", url)
        }
        value={onboardingData.personalInfo.profileImage}
        validationErrors={validationErrors}
      />
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5"></div>
          <div>
            <h5 className="font-medium text-primary-900 dark:text-primary-100 text-sm">
              Why do we need this information?
            </h5>
            <p className="text-sm text-primary-800 dark:text-primary-200 mt-1">
              Your personal information helps us verify your identity and ensure
              secure transactions. All data is encrypted and protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Step1Personal;
