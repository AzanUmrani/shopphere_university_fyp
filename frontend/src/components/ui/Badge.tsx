import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const variantClasses = {
    default:
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    primary:
      "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
    success:
      "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    warning:
      "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    danger:
      "bg-red-500 text-white dark:bg-red-600",
    info:
      "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
    secondary:
      "bg-secondary-50 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300",
  };

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-0.5 text-xs",
    lg: "px-2.5 py-1 text-sm",
  };

  const baseClasses = [
    "inline-flex items-center rounded-full font-semibold",
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={baseClasses}>{children}</span>;
};

export default Badge;
