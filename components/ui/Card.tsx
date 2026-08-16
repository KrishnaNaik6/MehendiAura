import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glass?: boolean;
}

export function Card({
  children,
  className,
  hoverEffect = true,
  glass = false,
  ...props
}: CardProps) {
  return (
    <div
      className={twMerge(
        "rounded-2xl overflow-hidden transition-all duration-300 border border-gold-300/30",
        glass ? "glass-card" : "bg-white shadow-soft",
        hoverEffect && "hover:shadow-gold-glow hover:-translate-y-1 hover:border-gold-400/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge("p-6 pb-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge("p-6 pt-0 flex-1", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge("p-6 pt-4 border-t border-cream-200 bg-cream-50/50 flex items-center justify-between gap-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}
