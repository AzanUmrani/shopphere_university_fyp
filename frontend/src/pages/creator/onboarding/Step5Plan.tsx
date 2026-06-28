import React from "react";
import { Check, CheckCircle } from "lucide-react";
import Card from "../../../components/ui/Card";
import type { OnboardingData } from "./onboarding.types";

interface StepProps {
  onboardingData: OnboardingData;
  updateData: (section: keyof OnboardingData, field: string, value: any, nested?: string) => void;
  validationErrors: any;
}

const plans = [
  {
    id: "free",
    name: "Starter",
    price: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    commission: "10%",
    popular: false,
    features: ["Up to 10 products", "Basic Analytics", "Standard Support", "Personal URL"],
    limitations: ["No Custom Domain", "Limited storage"],
  },
  {
    id: "pro",
    name: "Professional",
    price: "$29/mo",
    monthlyPrice: 29,
    yearlyPrice: 290,
    commission: "5%",
    popular: true,
    features: ["Unlimited products", "Advanced Analytics", "Priority Support", "Custom Domain", "Email Marketing", "Team Access"],
    limitations: [],
  },
  {
    id: "business",
    name: "Business",
    price: "$79/mo",
    monthlyPrice: 79,
    yearlyPrice: 790,
    commission: "2%",
    popular: false,
    features: ["Everything in Pro", "White-label solution", "Dedicated Manager", "API Access", "Custom Integrations"],
    limitations: [],
  },
];

const Step5Plan: React.FC<StepProps> = ({ onboardingData, updateData }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Choose your plan</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Select the plan that best fits your business needs. You can always upgrade or downgrade later.</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
          <button
            onClick={() => updateData("planInfo", "billingCycle", "monthly")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              onboardingData.planInfo.billingCycle === "monthly"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => updateData("planInfo", "billingCycle", "yearly")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              onboardingData.planInfo.billingCycle === "yearly"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Yearly
            <span className="ml-1 text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {plans.map((plan) => {
          const isSelected = onboardingData.planInfo.selectedPlan === plan.id;
          const displayPrice =
            onboardingData.planInfo.billingCycle === "yearly"
              ? plan.yearlyPrice > 0
                ? `$${plan.yearlyPrice}/year`
                : "Free"
              : plan.price;

          return (
            <Card
              key={plan.id}
              className={`relative p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? "ring-2 ring-secondary-500 bg-secondary-50 dark:bg-secondary-900/20 shadow-xl"
                  : "hover:shadow-lg border-gray-200 dark:border-gray-700"
              } ${plan.popular ? "lg:scale-105 ring-2 ring-secondary-500" : ""}`}
              onClick={() => updateData("planInfo", "selectedPlan", plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-secondary-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{displayPrice}</span>
                  {plan.monthlyPrice > 0 && onboardingData.planInfo.billingCycle === "yearly" && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-through">
                      ${plan.monthlyPrice * 12}/year
                    </div>
                  )}
                </div>
                <div className="text-xs font-medium text-secondary-600 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-900/30 px-3 py-1 rounded-full inline-block">
                  {plan.commission} transaction fee
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-3 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div
                className={`w-6 h-6 rounded-full border-2 mx-auto flex items-center justify-center ${
                  isSelected ? "bg-secondary-600 border-secondary-600" : "border-gray-300"
                }`}
              >
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 dark:text-green-100 text-lg">You're almost done!</h4>
            <p className="text-green-800 dark:text-green-200 text-sm mt-1">Complete your setup to start building your business.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Step5Plan;
