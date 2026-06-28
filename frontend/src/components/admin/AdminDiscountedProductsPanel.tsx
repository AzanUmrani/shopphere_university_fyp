import React, { useState } from "react";
import {
  Save,
  Eye,
  EyeOff,
  Settings,
  Palette,
  Clock,
  BarChart3,
  Calendar,
} from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";
import {
  defaultDiscountedProductsConfig,
  discountedProductsFormSchema,
  validateDiscountedProductsConfig,
} from "../../config/discountedProductsConfig";
import type { DiscountedProductsConfig } from "../../config/discountedProductsConfig";

interface AdminDiscountedProductsPanelProps {
  onConfigChange?: (config: DiscountedProductsConfig) => void;
  initialConfig?: DiscountedProductsConfig;
}

const AdminDiscountedProductsPanel: React.FC<
  AdminDiscountedProductsPanelProps
> = ({ onConfigChange, initialConfig = defaultDiscountedProductsConfig }) => {
  const [config, setConfig] = useState<DiscountedProductsConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState("content");
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const handleConfigChange = (
    field: keyof DiscountedProductsConfig,
    value: any
  ) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);

    // Validate configuration
    const validationErrors = validateDiscountedProductsConfig(newConfig);
    setErrors(validationErrors);

    // Notify parent component
    if (onConfigChange) {
      onConfigChange(newConfig);
    }
  };

  const handleSave = async () => {
    setSaveStatus("saving");

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would save to your backend
      console.log("Saving configuration:", config);

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const tabs = [
    { id: "content", label: "Content", icon: Settings },
    { id: "design", label: "Design", icon: Palette },
    { id: "timing", label: "Timing", icon: Clock },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "schedule", label: "Schedule", icon: Calendar },
  ];

  const renderField = (
    field: any,
    sectionIndex: number,
    fieldIndex: number
  ) => {
    const fieldKey = field.name as keyof DiscountedProductsConfig;
    const value = config[fieldKey];

    switch (field.type) {
      case "toggle":
        return (
          <div
            key={`${sectionIndex}-${fieldIndex}`}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.label}
              </label>
              {field.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {field.description}
                </p>
              )}
            </div>
            <button
              onClick={() => handleConfigChange(fieldKey, !value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? "bg-emerald-600" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        );

      case "text":
      case "textarea":
        return (
          <div key={`${sectionIndex}-${fieldIndex}`} className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={(value as string) || ""}
                onChange={(e) => handleConfigChange(fieldKey, e.target.value)}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            ) : (
              <Input
                value={(value as string) || ""}
                onChange={(e) => handleConfigChange(fieldKey, e.target.value)}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
              />
            )}
            {field.maxLength && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {((value as string) || "").length}/{field.maxLength} characters
              </p>
            )}
          </div>
        );

      case "number":
        return (
          <div key={`${sectionIndex}-${fieldIndex}`} className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
            <Input
              type="number"
              value={(value as number) || 0}
              onChange={(e) =>
                handleConfigChange(fieldKey, parseInt(e.target.value) || 0)
              }
              min={field.min}
              max={field.max}
            />
          </div>
        );

      case "range":
        return (
          <div key={`${sectionIndex}-${fieldIndex}`} className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}: {value}
            </label>
            <input
              type="range"
              value={(value as number) || 0}
              onChange={(e) =>
                handleConfigChange(fieldKey, parseInt(e.target.value))
              }
              min={field.min}
              max={field.max}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{field.min}</span>
              <span>{field.max}</span>
            </div>
          </div>
        );

      case "select":
        return (
          <div key={`${sectionIndex}-${fieldIndex}`} className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
            <select
              value={(value as string) || ""}
              onChange={(e) => handleConfigChange(fieldKey, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {field.options.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  const getTabFields = (tabId: string) => {
    const tabSections = discountedProductsFormSchema.sections.filter(
      (section) => {
        switch (tabId) {
          case "content":
            return [
              "Section Visibility",
              "Content Settings",
              "Product Settings",
            ].includes(section.title);
          case "design":
            return [
              "Design Settings",
              "Responsive Layout",
              "Animation Settings",
            ].includes(section.title);
          case "timing":
            return ["Countdown Timer"].includes(section.title);
          case "analytics":
            return ["Analytics & Tracking"].includes(section.title);
          case "schedule":
            return ["Scheduling"].includes(section.title);
          default:
            return false;
        }
      }
    );
    return tabSections;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Discounted Products Section
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage the appearance and behavior of your discounted products
            section
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2"
          >
            {previewMode ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {previewMode ? "Edit Mode" : "Preview"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={errors.length > 0 || saveStatus === "saving"}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="w-4 h-4" />
            {saveStatus === "saving"
              ? "Saving..."
              : saveStatus === "saved"
              ? "Saved!"
              : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      {errors.length > 0 && (
        <Card className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="p-4">
            <h3 className="text-red-800 dark:text-red-200 font-medium mb-2">
              Configuration Errors:
            </h3>
            <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {!previewMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tabs */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                  Settings
                </h3>
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-4">
              <div className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Status
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        config.isEnabled && config.isVisible
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {config.isEnabled && config.isVisible
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Max Products
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {config.maxProducts}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Accent Color
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {config.accentColor}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Countdown
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        config.showCountdown
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {config.showCountdown ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card>
              <div className="p-6">
                <div className="space-y-8">
                  {getTabFields(activeTab).map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        {section.title}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {section.fields.map((field, fieldIndex) =>
                          renderField(field, sectionIndex, fieldIndex)
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Preview Mode */
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Section Preview
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-medium mb-4">
                  SPECIAL DISCOUNTS AVAILABLE
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {config.sectionTitle}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                  {config.sectionSubtitle}
                </p>

                {config.showCountdown && (
                  <div className="flex justify-center gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-2">
                      <div className="text-xl font-bold text-emerald-600">
                        {config.countdownHours}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Hours
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-2">
                      <div className="text-xl font-bold text-emerald-600">
                        {config.countdownMinutes}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Minutes
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-2">
                      <div className="text-xl font-bold text-emerald-600">
                        {config.countdownSeconds}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Seconds
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing up to {config.maxProducts} products with{" "}
                  {config.accentColor} accent color
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminDiscountedProductsPanel;
