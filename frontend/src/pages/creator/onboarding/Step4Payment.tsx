import React from "react";
import { InputField } from "./OnboardingFields";
import { CreditCard, FileText, CheckCircle2 } from "lucide-react";
import type { OnboardingData } from "./onboarding.types";

interface StepProps {
  onboardingData: OnboardingData;
  updateData: (
    section: keyof OnboardingData,
    field: string,
    value: any,
    nested?: string
  ) => void;
  validationErrors: any;
}

const Step4Payment: React.FC<StepProps> = ({ onboardingData, updateData }) => {
  const paymentMethods = [
    { key: "bank", label: "Bank Account", description: "Direct bank transfer" },
    { key: "paypal", label: "PayPal", description: "PayPal payments" },
    { key: "stripe", label: "Stripe", description: "Coming soon", disabled: true },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment & Legal Setup</h2>
        <p className="text-gray-600 dark:text-gray-400">Set up your payment method and complete legal requirements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.key}
            onClick={() => !method.disabled && updateData("paymentInfo", "accountType", method.key)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              onboardingData.paymentInfo.accountType === method.key
                ? "border-secondary-600 bg-secondary-50 dark:bg-secondary-900/20"
                : "border-gray-200 dark:border-gray-800 hover:border-secondary-300"
            } ${method.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <CreditCard
              className={`w-8 h-8 mb-3 ${
                onboardingData.paymentInfo.accountType === method.key ? "text-secondary-600" : "text-gray-400"
              }`}
            />
            <div className="font-bold dark:text-white">{method.label}</div>
            <div className="text-xs text-gray-500">{method.description}</div>
          </div>
        ))}
      </div>

      {onboardingData.paymentInfo.accountType === "bank" && (
        <div className="bg-gray-50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
          <h4 className="font-semibold flex items-center mb-4 dark:text-white">
            <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
            Bank Details
          </h4>
          <div className="space-y-4 md:flex md:gap-4">
            <InputField
              label="Account Holder Name *"
              name="HolderName"
              value={onboardingData.paymentInfo.bankAccount.accountHolderName}
              onChange={(e: any) => updateData("paymentInfo", "bankAccount", e.target.value, "accountHolderName")}
              placeholder="John Doe"
              required
              validationErrors={{}}
            />
            <InputField
              label="Bank Name *"
              name="BankName"
              value={onboardingData.paymentInfo.bankAccount.bankName}
              onChange={(e: any) => updateData("paymentInfo", "bankAccount", e.target.value, "bankName")}
              placeholder="Global Bank Inc."
              required
              validationErrors={{}}
            />
          </div>
          <div className="space-y-4 md:flex md:gap-4">
            <InputField
              label="Account Number *"
              type="password"
              name="AccountNum"
              value={onboardingData.paymentInfo.bankAccount.accountNumber}
              onChange={(e: any) => updateData("paymentInfo", "bankAccount", e.target.value, "accountNumber")}
              placeholder="••••••••••••"
              required
              validationErrors={{}}
            />
            <InputField
              label="Routing Number *"
              name="RoutingNumber"
              value={onboardingData.paymentInfo.bankAccount.routingNumber}
              onChange={(e: any) => updateData("paymentInfo", "bankAccount", e.target.value, "routingNumber")}
              placeholder="9-digit code"
              required
              validationErrors={{}}
            />
          </div>
        </div>
      )}

      {onboardingData.paymentInfo.accountType === "paypal" && (
        <div className="bg-primary-50 dark:bg-primary-900/10 p-6 rounded-2xl border border-primary-100 dark:border-primary-900">
          <InputField
            label="PayPal Email Address *"
            type="email"
            name="PaypalEmail"
            value={onboardingData.paymentInfo.paypalEmail}
            onChange={(e: any) => updateData("paymentInfo", "paypalEmail", e.target.value)}
            placeholder="yourname@paypal.com"
            required
            validationErrors={{}}
          />
        </div>
      )}

      <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
        <h4 className="font-semibold flex items-center mb-2 dark:text-white">
          <FileText className="w-5 h-5 mr-2 text-secondary-600" />
          Legal Agreements
        </h4>
        <div className="flex flex-col gap-3">
          {[
            { id: "termsAccepted", label: "I agree to the Terms of Service and Creator Agreement" },
            { id: "privacyAccepted", label: "I acknowledge the Privacy Policy" },
            { id: "processingTimeAccepted", label: "I understand bank processing times take 2-5 days" },
          ].map((item) => (
            <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 rounded border-gray-300 text-secondary-600 focus:ring-secondary-500"
                checked={(onboardingData.paymentInfo as any)[item.id]}
                onChange={(e) => updateData("paymentInfo", item.id, e.target.checked)}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step4Payment;
