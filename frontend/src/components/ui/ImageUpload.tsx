import React from "react";
import FileUpload, { type UploadedFile } from "./FileUpload";

interface ImageUploadProps {
  onUpload?: (imageUrls: string[]) => void;
  onError?: (error: string) => void;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
  uploadType?: "single" | "products" | "creator-assets" | "avatar";
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  onError,
  multiple = false,
  maxFiles = 5,
  className = "",
  disabled = false,
  uploadType = "single",
}) => {
  const handleUpload = (files: UploadedFile[]) => {
    const imageUrls = files
      .filter((f) => f.status === "completed")
      .map((f) => f.url);
    onUpload?.(imageUrls);
  };

  return (
    <FileUpload
      accept="image/*"
      multiple={multiple}
      maxFiles={maxFiles}
      maxSize={10 * 1024 * 1024} // 10MB for images
      uploadType={uploadType}
      onUpload={handleUpload}
      onError={onError}
      className={className}
      disabled={disabled}
      showPreview={true}
    />
  );
};

export default ImageUpload;
