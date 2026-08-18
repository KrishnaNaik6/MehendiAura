import React from "react";
import { twMerge } from "tailwind-merge";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "full";
}

export function Container({
  children,
  className,
  size = "lg",
  ...props
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-4xl",
    md: "max-w-6xl",
    lg: "max-w-7xl",
    full: "max-w-full px-3.5 sm:px-6 lg:px-12",
  };

  return (
    <div
      className={twMerge(
        "w-full mx-auto px-3.5 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
