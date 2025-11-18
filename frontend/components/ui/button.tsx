"use client";

import * as React from "react";

export type ButtonVariant = "primary" | "secondary" | "outline";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const baseClasses =
  "inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-purple-600 text-white shadow-sm hover:bg-purple-700 focus-visible:ring-purple-500 focus-visible:ring-offset-white",
  secondary:
    "bg-purple-50 text-purple-700 hover:bg-purple-100 focus-visible:ring-purple-500 focus-visible:ring-offset-white",
  outline:
    "border border-purple-200 bg-white text-purple-700 hover:bg-purple-50 focus-visible:ring-purple-500 focus-visible:ring-offset-white",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", ...props }, ref) => {
    const variantClasses = variants[variant] ?? variants.primary;

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses} ${className}`}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
