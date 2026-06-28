import React, { useState, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Input from "../../../components/ui/Input";
import { uploadAPI } from "../../../services/api";

// Get API base URL without /api suffix
const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5001";

export const InputField = React.memo(
  ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
    required = false,
    leftIcon,
    validationErrors,
    ...props
  }: any) => {
    const errors = validationErrors[name] || [];
    const hasError = errors.length > 0;
    return (
      <div className="w-full">
        <Input
          label={`${label}${required ? " *" : ""}`}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          leftIcon={leftIcon}
          error={hasError ? errors[0] : undefined}
          fullWidth
          {...props}
        />
      </div>
    );
  },
);

export const TextAreaField = React.memo(
  ({
    label,
    name,
    value,
    onChange,
    placeholder = "",
    required = false,
    rows = 4,
    validationErrors,
    ...props
  }: any) => {
    const errors = validationErrors[name] || [];
    const hasError = errors.length > 0;
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required ? " *" : ""}
        </label>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
            hasError
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-600 focus:ring-secondary-500"
          }`}
          {...props}
        />
        {hasError && <p className="mt-1 text-sm text-red-600">{errors[0]}</p>}
      </div>
    );
  },
);

export const FileUpload = ({
  label,
  name,
  accept,
  description,
  onChange,
  value,
  validationErrors,
}: any) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(value || "");
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  const errors = validationErrors[name] || [];
  const hasError = errors.length > 0;

  // Update preview when value changes (e.g., from loaded data)
  useEffect(() => {
    if (value && !blobUrl && !isUploading) {
      // Construct full URL for the image
      const fullUrl = value.startsWith("http")
        ? value
        : `${API_BASE_URL}${value}`;
      setPreviewUrl(fullUrl);
    }
  }, [value, blobUrl, isUploading]);

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Create local blob preview immediately for instant feedback
    const localBlobUrl = URL.createObjectURL(file);
    setBlobUrl(localBlobUrl);
    setPreviewUrl(localBlobUrl);
    setUploadError("");
    setIsUploading(true);

    try {
      // Upload to server in background
      const response = await uploadAPI.uploadSingle(file);

      if (response.success && response.data) {
        // Get the image URL from response (imageUrl field)
        const uploadedPath =
          response.data.imageUrl ||
          response.data.url ||
          response.data.path ||
          "";

        // Construct full URL
        const fullUrl = uploadedPath.startsWith("http")
          ? uploadedPath
          : `${API_BASE_URL}${uploadedPath}`;

        console.log(
          "Upload successful! Path:",
          uploadedPath,
          "Full URL:",
          fullUrl,
        );

        // Update to show the actual uploaded image
        setPreviewUrl(fullUrl);

        // Pass the uploaded URL back to parent (store the path, not full URL)
        onChange(uploadedPath);

        // Keep blob visible for a moment to ensure smooth transition
        setTimeout(() => {
          setBlobUrl(null);
          URL.revokeObjectURL(localBlobUrl);
        }, 500);
      } else {
        throw new Error("Upload failed - no data returned");
      }
    } catch (error: any) {
      console.error("File upload error:", error);
      setUploadError(
        error.message || "Failed to upload image. Please try again.",
      );
      setPreviewUrl("");
      setBlobUrl(null);
      onChange("");
      URL.revokeObjectURL(localBlobUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }
    setPreviewUrl("");
    onChange("");
  };

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const displayUrl = previewUrl || value;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>

      {displayUrl ? (
        <div className="relative border-2 border-secondary-300 dark:border-secondary-600 rounded-xl overflow-hidden bg-secondary-50 dark:bg-secondary-900/10">
          <div className="p-4">
            <img
              src={displayUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
              onError={(e) => {
                console.error("Image load error for URL:", displayUrl);
                // If server image fails, don't clear if we have a blob
                if (!blobUrl) {
                  setPreviewUrl("");
                }
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-6 right-6 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
            disabled={isUploading}
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
              <p className="text-white text-sm font-medium">
                Uploading to server...
              </p>
              <p className="text-white text-xs mt-1">Please wait</p>
            </div>
          )}
          {blobUrl && !isUploading && (
            <div className="absolute bottom-2 left-2 right-2 px-4">
              <div className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-md shadow-lg text-center font-medium">
                ✅ Upload Complete! Click Next to save
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            hasError
              ? "border-red-500 bg-red-50 dark:bg-red-900/10"
              : "border-gray-300 dark:border-gray-600 hover:border-secondary-500 dark:hover:border-secondary-500"
          }`}
        >
          <input
            type="file"
            accept={accept}
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            id={name}
            disabled={isUploading}
          />
          <label htmlFor={name} className="cursor-pointer block">
            {isUploading ? (
              <>
                <Loader2 className="w-10 h-10 mx-auto mb-3 text-secondary-500 animate-spin" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Click to upload
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {description}
                </p>
              </>
            )}
          </label>
        </div>
      )}

      {uploadError && (
        <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <span>❌</span> {uploadError}
          </p>
        </div>
      )}
      {hasError && <p className="mt-1 text-sm text-red-600">{errors[0]}</p>}
    </div>
  );
};
