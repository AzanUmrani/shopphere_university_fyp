// import React from "react";
// import InputField from "../../../components/ui/Input";
// import FileUpload from "../../../components/ui/FileUpload";
// import Badge from "../../../components/ui/Badge";
// import { X } from "lucide-react";
// import type {OnboardingData}  from "../../CreatorOnboardingPage";

// interface StepProps {
//   onboardingData: OnboardingData;
//   updateData: (section: keyof OnboardingData, field: string, value: any) => void;
//   validationErrors: any;
// }

// const categories = ["Fashion", "Electronics", "Home & Decor", "Beauty", "Art", "Digital Products"];

// const Step2Shop: React.FC<StepProps> = ({ onboardingData, updateData }) => {

//   const addSubCategory = (cat: string) => {
//     if (!onboardingData.shopInfo.subCategories.includes(cat)) {
//       const updated = [...onboardingData.shopInfo.subCategories, cat];
//       updateData("shopInfo", "subCategories", updated);
//     }
//   };

//   const removeSubCategory = (cat: string) => {
//     const updated = onboardingData.shopInfo.subCategories.filter((c) => c !== cat);
//     updateData("shopInfo", "subCategories", updated);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <InputField
//           label="Shop Name"
//           name="shopName"
//           value={onboardingData.shopInfo.shopName}
//           onChange={(e: any) => updateData("shopInfo", "shopName", e.target.value)}
//           placeholder="Enter your shop name"
//           required
//         />
//         <InputField
//           label="Shop URL"
//           name="shopUrl"
//           value={onboardingData.shopInfo.shopUrl}
//           onChange={(e: any) => updateData("shopInfo", "shopUrl", e.target.value)}
//           placeholder="your-shop-name"
//           required
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <label className="text-sm font-medium">Shop Description</label>
//         <textarea
//           className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
//           value={onboardingData.shopInfo.shopDescription}
//           name="shortDesc"
//           onChange={(e) => updateData("shopInfo", "shopDescription", e.target.value)}
//           placeholder="Tell customers about your shop..."
//           rows={4}
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <label className="text-sm font-medium">Primary Category</label>
//         <select
//           className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
//           value={onboardingData.shopInfo.category}
//           name="primaryCat"

//           onChange={(e) => updateData("shopInfo", "category", e.target.value)}
//         >
//           <option value="">Select a category</option>
//           {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
//         </select>
//       </div>

//       {/* Sub-Categories */}
//       <div>
//         <label className="block text-sm font-medium mb-2">Additional Categories</label>
//         <div className="flex flex-wrap gap-2 mb-2">
//           {onboardingData.shopInfo.subCategories.map((cat) => (
//             <Badge key={cat} className="flex items-center space-x-1">
//               <span>{cat}</span>
//               <button type="button" onClick={() => removeSubCategory(cat)} className="ml-1 hover:text-red-500">
//                 <X className="w-3 h-3" />
//               </button>
//             </Badge>
//           ))}
//         </div>
//         <select
//           onChange={(e) => { if (e.target.value) { addSubCategory(e.target.value); e.target.value = ""; } }}
//           className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
//         >
//           <option value="">Add another category</option>
//           {categories.filter(c => c !== onboardingData.shopInfo.category && !onboardingData.shopInfo.subCategories.includes(c)).map(c => (
//             <option key={c} value={c}>{c}</option>
//           ))}
//         </select>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
//         <InputField
//           label="Website"
//           value={onboardingData.shopInfo.website || ""}
//           name="website"
//           onChange={(e: any) => updateData("shopInfo", "website", e.target.value)}
//         />
//         <InputField
//           label="Instagram"
//           value={onboardingData.shopInfo.instagram || ""}
//           name="instagram"
//           onChange={(e: any) => updateData("shopInfo", "instagram", e.target.value)}
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="flex flex-col gap-2">
//             <label className="text-sm font-medium">Shop Logo</label>
//             <FileUpload
//                 {...({
//                     onChange: (files: any) => files && updateData("shopInfo", "shopLogo", files[0].name),
//                 } as any)}
//                 value={onboardingData.shopInfo.shopLogo || ""}
//             />
//         </div>
//         <div className="flex flex-col gap-2">
//             <label className="text-sm font-medium">Shop Banner</label>
//             <FileUpload
//                 {...({
//                     onChange: (files: any) => files && updateData("shopInfo", "shopBanner", files[0].name),
//                 } as any)}
//                 value={onboardingData.shopInfo.shopBanner || ""}
//             />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Step2Shop;

// src/features/creator/onboarding/Step2Shop.tsx
import React from "react";
import InputField from "../../../components/ui/Input";
import { FileUpload } from "./OnboardingFields";
import Badge from "../../../components/ui/Badge";
import { X } from "lucide-react";
import type { OnboardingData } from "../../../pages/creator/onboarding/onboarding.types";

interface StepProps {
  onboardingData: OnboardingData;
  updateData: (
    section: keyof OnboardingData,
    field: string,
    value: any,
  ) => void;
  validationErrors: any;
}

const categories = [
  "Fashion",
  "Electronics",
  "Home & Decor",
  "Beauty",
  "Art",
  "Digital Products",
];

const Step2Shop: React.FC<StepProps> = ({
  onboardingData,
  updateData,
  validationErrors,
}) => {
  const addSubCategory = (cat: string) => {
    if (!onboardingData.shopInfo.subCategories.includes(cat)) {
      const updated = [...onboardingData.shopInfo.subCategories, cat];
      updateData("shopInfo", "subCategories", updated);
    }
  };

  const removeSubCategory = (cat: string) => {
    const updated = onboardingData.shopInfo.subCategories.filter(
      (c) => c !== cat,
    );
    updateData("shopInfo", "subCategories", updated);
  };

  return (
    <div className="space-y-6">
      {/* UI remains identical to your original code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Shop Name"
          name="shopName"
          value={onboardingData.shopInfo.shopName}
          onChange={(e: any) =>
            updateData("shopInfo", "shopName", e.target.value)
          }
          placeholder="Enter your shop name"
          required
        />
        <InputField
          label="Shop URL"
          name="shopUrl"
          value={onboardingData.shopInfo.shopUrl}
          onChange={(e: any) =>
            updateData("shopInfo", "shopUrl", e.target.value)
          }
          placeholder="your-shop-name"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium dark:text-white">
          Shop Description
        </label>
        <textarea
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          value={onboardingData.shopInfo.shopDescription}
          onChange={(e) =>
            updateData("shopInfo", "shopDescription", e.target.value)
          }
          placeholder="Tell customers about your shop..."
          rows={4}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium dark:text-white">
          Primary Category
        </label>
        <select
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          value={onboardingData.shopInfo.category}
          onChange={(e) => updateData("shopInfo", "category", e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 dark:text-white">
          Additional Categories
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {onboardingData.shopInfo.subCategories.map((cat) => (
            <Badge key={cat} className="flex items-center space-x-1">
              <span>{cat}</span>
              <button
                type="button"
                onClick={() => removeSubCategory(cat)}
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <select
          onChange={(e) => {
            if (e.target.value) {
              addSubCategory(e.target.value);
              e.target.value = "";
            }
          }}
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
        >
          <option value="">Add another category</option>
          {categories
            .filter(
              (c) =>
                c !== onboardingData.shopInfo.category &&
                !onboardingData.shopInfo.subCategories.includes(c),
            )
            .map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
        <InputField
          label="Website"
          value={onboardingData.shopInfo.website || ""}
          onChange={(e: any) =>
            updateData("shopInfo", "website", e.target.value)
          }
        />
        <InputField
          label="Instagram"
          value={onboardingData.shopInfo.instagram || ""}
          onChange={(e: any) =>
            updateData("shopInfo", "instagram", e.target.value)
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <FileUpload
            label="Shop Logo"
            name="shopLogo"
            accept="image/*"
            description="Square logo, at least 200x200px"
            onChange={(url: string) => updateData("shopInfo", "shopLogo", url)}
            value={onboardingData.shopInfo.shopLogo || ""}
            validationErrors={validationErrors}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FileUpload
            label="Shop Banner"
            name="shopBanner"
            accept="image/*"
            description="Wide banner, recommended 1200x400px"
            onChange={(url: string) =>
              updateData("shopInfo", "shopBanner", url)
            }
            value={onboardingData.shopInfo.shopBanner || ""}
            validationErrors={validationErrors}
          />
        </div>
      </div>
    </div>
  );
};

export default Step2Shop;
