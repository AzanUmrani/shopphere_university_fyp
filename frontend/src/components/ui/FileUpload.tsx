import React, { useRef, useState, useCallback } from "react";
import { Upload, X, File, CheckCircle, AlertCircle } from "lucide-react";
import Button from "./Button";
import { uploadAPI } from "../../services/api";

export interface UploadedFile {
  id: string;
  file: File;
  url: string;
  onChange?: (files: File[]) => void;
  status: "uploading" | "completed" | "error";
  progress: number;
  error?: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  onChange?: (files: any) => void;
  maxSize?: number; // in bytes
  uploadType?: "single" | "products" | "creator-assets" | "avatar";
  onUpload?: (files: UploadedFile[]) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
  showPreview?: boolean;
  disabled?: boolean;
  value?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = "image/*",
  multiple = false,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
  uploadType = "single",
  onUpload,
  onError,
  className = "",
  children,
  showPreview = true,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const generateFileId = () => Math.random().toString(36).substr(2, 9);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${(maxSize / (1024 * 1024)).toFixed(1)}MB`;
    }

    if (accept && !accept.includes("*")) {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const fileType = file.type;
      const isValid = acceptedTypes.some((acceptType) => {
        if (acceptType.endsWith("/*")) {
          return fileType.startsWith(acceptType.slice(0, -1));
        }
        return fileType === acceptType;
      });

      if (!isValid) {
        return `File type not accepted. Accepted types: ${accept}`;
      }
    }

    return null;
  };

  const uploadFile = async (file: File, fileId: string) => {
    try {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: "uploading" as const, progress: 0 }
            : f
        )
      );

      let response;
      switch (uploadType) {
        case "products":
          response = await uploadAPI.uploadProductImages([file]);
          break;
        case "creator-assets":
          response = await uploadAPI.uploadCreatorAssets([file]);
          break;
        case "avatar":
          response = await uploadAPI.uploadAvatar(file);
          break;
        default:
          response = await uploadAPI.uploadSingle(file);
      }

      const uploadedUrl =
        (response.data as any)?.url ||
        (response.data as any)?.urls?.[0] ||
        URL.createObjectURL(file);

      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "completed" as const,
                progress: 100,
                url: uploadedUrl,
              }
            : f
        )
      );

      return uploadedUrl;
    } catch (error: any) {
      const errorMessage = error.message || "Upload failed";
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "error" as const,
                error: errorMessage,
              }
            : f
        )
      );
      onError?.(errorMessage);
      throw error;
    }
  };

  const handleFiles = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files);

      if (!multiple && fileArray.length > 1) {
        onError?.("Multiple files not allowed");
        return;
      }

      if (uploadedFiles.length + fileArray.length > maxFiles) {
        onError?.(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const validFiles: { file: File; id: string }[] = [];

      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          onError?.(error);
          continue;
        }

        const fileId = generateFileId();
        validFiles.push({ file, id: fileId });
      }

      if (validFiles.length === 0) return;

      // Add files to state first
      const newFiles: UploadedFile[] = validFiles.map(({ file, id }) => ({
        id,
        file,
        url: URL.createObjectURL(file),
        status: "uploading",
        progress: 0,
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Upload files
      const uploadPromises = validFiles.map(({ file, id }) =>
        uploadFile(file, id)
      );

      try {
        await Promise.all(uploadPromises);
        const completedFiles = uploadedFiles.filter(
          (f) => f.status === "completed"
        );
        onUpload?.(completedFiles);
      } catch (error) {
        console.error("Some uploads failed:", error);
      }
    },
    [
      uploadedFiles,
      maxFiles,
      multiple,
      onError,
      onUpload,
      maxSize,
      accept,
      uploadType,
    ]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles, disabled]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isImage = (file: File) => file.type.startsWith("image/");

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragging
              ? "border-primary-400 bg-primary-50 dark:bg-primary-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {children || (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {isDragging ? "Drop files here" : "Upload files"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Max size: {(maxSize / (1024 * 1024)).toFixed(1)}MB
                {multiple && `, up to ${maxFiles} files`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* File Previews */}
      {showPreview && uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedFiles.map((uploadedFile) => (
            <div
              key={uploadedFile.id}
              className="relative bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
            >
              {/* Remove button */}
              <button
                onClick={() => removeFile(uploadedFile.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* File preview */}
              <div className="aspect-square mb-2 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center overflow-hidden">
                {isImage(uploadedFile.file) ? (
                  <img
                    src={uploadedFile.url}
                    alt={uploadedFile.file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <File className="w-8 h-8 text-gray-400" />
                )}
              </div>

              {/* File info */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                  {uploadedFile.file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(uploadedFile.file.size / 1024).toFixed(1)} KB
                </p>

                {/* Status */}
                <div className="flex items-center space-x-1">
                  {uploadedFile.status === "uploading" && (
                    <>
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-primary-600 dark:text-primary-400">
                        Uploading... {uploadedFile.progress}%
                      </span>
                    </>
                  )}
                  {uploadedFile.status === "completed" && (
                    <>
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400">
                        Completed
                      </span>
                    </>
                  )}
                  {uploadedFile.status === "error" && (
                    <>
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-red-600 dark:text-red-400">
                        Error
                      </span>
                    </>
                  )}
                </div>

                {uploadedFile.error && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {uploadedFile.error}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Summary */}
      {uploadedFiles.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            {uploadedFiles.filter((f) => f.status === "completed").length} of{" "}
            {uploadedFiles.length} uploaded
          </span>
          {uploadedFiles.some((f) => f.status === "error") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const failedFiles = uploadedFiles.filter(
                  (f) => f.status === "error"
                );
                failedFiles.forEach((f) => uploadFile(f.file, f.id));
              }}
            >
              Retry Failed
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
