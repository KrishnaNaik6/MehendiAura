import React from "react";
import { Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  badge,
  align = "center",
  className,
}: SectionHeadingProps) {
  const alignClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div
      className={twMerge(
        "flex flex-col mb-12 sm:mb-16",
        alignClasses[align],
        className
      )}
    >
      {badge && (
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>{badge}</span>
        </div>
      )}

      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-900 leading-tight">
        {title}
      </h2>

      {/* Decorative Gold Flourish Line */}
      <div className="flex items-center gap-2 my-4">
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gold-500" />
        <div className="w-2 h-2 rotate-45 bg-gold-500" />
        <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gold-500" />
      </div>

      {subtitle && (
        <p className="text-base sm:text-lg text-brand-700 max-w-2xl font-sans leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
