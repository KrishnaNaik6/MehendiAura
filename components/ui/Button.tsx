import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "outline" | "ghost" | "whatsapp" | "call";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants = {
      primary:
        "bg-brand-800 hover:bg-brand-900 text-cream-100 shadow-md focus:ring-brand-800 border border-brand-700",
      secondary:
        "bg-cream-200 hover:bg-cream-300 text-brand-900 border border-gold-300 shadow-sm focus:ring-gold-500",
      gold:
        "bg-gold-500 hover:bg-gold-600 text-white shadow-gold-glow focus:ring-gold-500 font-semibold",
      outline:
        "bg-transparent border-2 border-brand-800 text-brand-800 hover:bg-brand-800 hover:text-cream-100 focus:ring-brand-800",
      ghost:
        "bg-transparent hover:bg-brand-800/10 text-brand-800 focus:ring-brand-800",
      whatsapp:
        "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md focus:ring-emerald-500 font-semibold",
      call:
        "bg-brand-900 hover:bg-brand-950 text-gold-300 border border-gold-500/30 shadow-md focus:ring-brand-900 font-semibold",
    };

    const sizes = {
      sm: "px-3.5 py-2 text-xs gap-1.5 min-h-[38px]",
      md: "px-5 py-2.5 text-sm gap-2 min-h-[44px]", // Mobile touch accessible
      lg: "px-7 py-3.5 text-base gap-2.5 min-h-[50px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
