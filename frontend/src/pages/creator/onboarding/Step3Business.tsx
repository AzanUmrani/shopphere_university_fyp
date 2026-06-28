// import React from "react";
// import InputField from "../../../components/ui/Input";
// import { MapPin, FileText } from "lucide-react";
// import type { OnboardingData } from "../../CreatorOnboardingPage";

// interface StepProps {
//   onboardingData: OnboardingData;
//   updateData: (
//     section: keyof OnboardingData,
//     field: string,
//     value: any,
//     nested?: string
//   ) => void;
//   validationErrors: any;
// }

// const businessTypes = [
//   "Individual / Sole Proprietor",
//   "LLC",
//   "Corporation",
//   "Partnership",
//   "Non-Profit",
// ];

// const Step3Business: React.FC<StepProps> = ({ onboardingData, updateData }) => {
//   return (
//     <div className="space-y-6">
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//           Business Information
//         </h2>
//         <p className="text-gray-600 dark:text-gray-400">
//           We need your business details for tax and legal purposes.
//         </p>
//       </div>

//       {/* Business Type & Name */}
//       <div className="flex flex-col gap-2">
//         <label className="text-sm font-medium">Business Type</label>
//         <select
//           className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
//           value={onboardingData.businessInfo.businessType || ""}
//           name="businessType"
//           onChange={(e) =>
//             updateData("businessInfo", "businessType", e.target.value)
//           }
//         >
//           <option value="">Select Business Type</option>
//           {businessTypes.map((type) => (
//             <option key={type} value={type}>
//               {type}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="md:flex md:justify-between space-y-4">
//         <InputField
//           label="Business Name *"
//           value={onboardingData.businessInfo.businessName}
//           name="businessName"
//           onChange={(e: any) =>
//             updateData("businessInfo", "businessName", e.target.value)
//           }
//           placeholder="Your Business Name LLC"
//           required
//         />

//         <InputField
//           label="Tax ID / EIN *"
//           value={onboardingData.businessInfo.taxId || ""}
//           name="TaxID"
//           onChange={(e: any) =>
//             updateData("businessInfo", "taxId", e.target.value)
//           }
//           placeholder="XX-XXXXXXX"
//           required
//         />
//       </div>

//       {/* Contact Grid */}
//       <div className="md:flex md:justify-between space-y-4 gap-4">
//         <InputField
//           label="Business Phone *"
//           type="tel"
//           value={onboardingData.businessInfo.businessPhone || ""}
//           name="phone"
//           onChange={(e: any) =>
//             updateData("businessInfo", "businessPhone", e.target.value)
//           }
//           placeholder="+1 (555) 000-0000"
//           required
//         />
//         <InputField
//           label="Business Email *"
//           type="email"
//           name="BusinessEmail"
//           value={onboardingData.businessInfo.businessEmail || ""}
//           onChange={(e: any) =>
//             updateData("businessInfo", "businessEmail", e.target.value)
//           }
//           placeholder="business@example.com"
//           required
//         />
//       </div>

//       {/* Address Section */}
//       <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 space-y-4 border border-gray-100 dark:border-gray-700">
//         <h4 className="text-lg font-semibold flex items-center">
//           <MapPin className="w-5 h-5 mr-2 text-secondary-600" />
//           Business Address <span className="text-red-500 ml-1">*</span>
//         </h4>

//         <InputField
//           label="Street Address *"
//           value={onboardingData.businessInfo.businessAddress.street}
//           name="street"
//           onChange={(e: any) =>
//             updateData(
//               "businessInfo",
//               "businessAddress",
//               e.target.value,
//               "street"
//             )
//           }
//           placeholder="123 Business Street"
//           required
//         />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2">
//           <InputField
//             label="City *"
//             value={onboardingData.businessInfo.businessAddress.city}
//             name="city"
//             onChange={(e: any) =>
//               updateData(
//                 "businessInfo",
//                 "businessAddress",
//                 e.target.value,
//                 "city"
//               )
//             }
//             placeholder="City"
//             required
//           />
//           <InputField
//             label="State/Province *"
//             value={onboardingData.businessInfo.businessAddress.state}
//             name="state"
//             onChange={(e: any) =>
//               updateData(
//                 "businessInfo",
//                 "businessAddress",
//                 e.target.value,
//                 "state"
//               )
//             }
//             placeholder="State"
//             required
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <InputField
//             label="ZIP/Postal Code *"
//             name="zip"
//             value={onboardingData.businessInfo.businessAddress.zipCode}
//             onChange={(e: any) =>
//               updateData(
//                 "businessInfo",
//                 "businessAddress",
//                 e.target.value,
//                 "zipCode"
//               )
//             }
//             placeholder="12345"
//             required
//           />
//           <InputField
//             label="Country *"
//             name="Country"
//             value={onboardingData.businessInfo.businessAddress.country || ""}
//             onChange={(e: any) =>
//               updateData(
//                 "businessInfo",
//                 "businessAddress",
//                 e.target.value,
//                 "country"
//               )
//             }
//             placeholder="United States"
//             required
//           />
//         </div>
//       </div>

//       <InputField
//         label="Business License Number (Optional)"
//         value={onboardingData.businessInfo.businessLicense || ""}
//         onChange={(e: any) =>
//           updateData("businessInfo", "businessLicense", e.target.value)
//         }
//         placeholder="Lic-000000"
//         name="liscense"
//       />

//       <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
//         <div className="flex items-start space-x-3">
//           <FileText className="w-5 h-5 text-amber-500 mt-0.5" />
//           <p className="text-sm text-amber-800 dark:text-amber-200">
//             <strong>Security Note:</strong> This data is encrypted and used only
//             for tax compliance.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Step3Business;
import React from "react";
import InputField from "../../../components/ui/Input";
import { MapPin, FileText } from "lucide-react";
import type { OnboardingData } from "../../../pages/creator/onboarding/onboarding.types";


interface StepProps {
  onboardingData: OnboardingData;
  updateData: (section: keyof OnboardingData, field: string, value: any, nested?: string) => void;
  validationErrors: any;
}

const businessTypes = ["Individual / Sole Proprietor", "LLC", "Corporation", "Partnership", "Non-Profit"];

const Step3Business: React.FC<StepProps> = ({ onboardingData, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Business Information</h2>
        <p className="text-gray-600 dark:text-gray-400">We need your business details for tax and legal purposes.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium dark:text-white">Business Type</label>
        <select
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          value={onboardingData.businessInfo.businessType || ""}
          name="businessType"
          onChange={(e) => updateData("businessInfo", "businessType", e.target.value)}
        >
          <option value="">Select Business Type</option>
          {businessTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="md:flex md:justify-between space-y-4 gap-4">
        <InputField
          label="Business Name *"
          value={onboardingData.businessInfo.businessName}
          name="businessName"
          onChange={(e: any) => updateData("businessInfo", "businessName", e.target.value)}
          placeholder="Your Business Name LLC"
          required
        />
        <InputField
          label="Tax ID / EIN *"
          value={onboardingData.businessInfo.taxId || ""}
          name="TaxID"
          onChange={(e: any) => updateData("businessInfo", "taxId", e.target.value)}
          placeholder="XX-XXXXXXX"
          required
        />
      </div>

      <div className="md:flex md:justify-between space-y-4 gap-4">
        <InputField
          label="Business Phone *"
          type="tel"
          value={onboardingData.businessInfo.businessPhone || ""}
          name="phone"
          onChange={(e: any) => updateData("businessInfo", "businessPhone", e.target.value)}
          placeholder="+1 (555) 000-0000"
          required
        />
        <InputField
          label="Business Email *"
          type="email"
          name="BusinessEmail"
          value={onboardingData.businessInfo.businessEmail || ""}
          onChange={(e: any) => updateData("businessInfo", "businessEmail", e.target.value)}
          placeholder="business@example.com"
          required
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 space-y-4 border border-gray-100 dark:border-gray-700">
        <h4 className="text-lg font-semibold flex items-center dark:text-white">
          <MapPin className="w-5 h-5 mr-2 text-secondary-600 dark:text-white" />
          Business Address <span className="text-red-500 ml-1">*</span>
        </h4>

        <InputField
          label="Street Address *"
          value={onboardingData.businessInfo.businessAddress.street}
          name="street"
          onChange={(e: any) => updateData("businessInfo", "businessAddress", e.target.value, "street")}
          placeholder="123 Business Street"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="City *"
            value={onboardingData.businessInfo.businessAddress.city}
            name="city"
            onChange={(e: any) => updateData("businessInfo", "businessAddress", e.target.value, "city")}
            placeholder="City"
            required
          />
          <InputField
            label="State/Province *"
            value={onboardingData.businessInfo.businessAddress.state}
            name="state"
            onChange={(e: any) => updateData("businessInfo", "businessAddress", e.target.value, "state")}
            placeholder="State"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="ZIP/Postal Code *"
            name="zip"
            value={onboardingData.businessInfo.businessAddress.zipCode}
            onChange={(e: any) => updateData("businessInfo", "businessAddress", e.target.value, "zipCode")}
            placeholder="12345"
            required
          />
          <InputField
            label="Country *"
            name="Country"
            value={onboardingData.businessInfo.businessAddress.country || ""}
            onChange={(e: any) => updateData("businessInfo", "businessAddress", e.target.value, "country")}
            placeholder="United States"
            required
          />
        </div>
      </div>

      <InputField
        label="Business License Number (Optional)"
        value={onboardingData.businessInfo.businessLicense || ""}
        onChange={(e: any) => updateData("businessInfo", "businessLicense", e.target.value)}
        placeholder="Lic-000000"
        name="liscense"
      />

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FileText className="w-5 h-5 text-amber-500 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Security Note:</strong> This data is encrypted and used only for tax compliance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step3Business;
