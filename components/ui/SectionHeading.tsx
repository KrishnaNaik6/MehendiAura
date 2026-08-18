import React from "react";
import { Sparkles } from "lucide-react";
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
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 text-xs font-semibold uppercase tracking-widest mb-3.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-spin-slow" />
          <span>{badge}</span>
        </div>
      )}

      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-900 leading-tight">
        {title}
      </h2>

      {/* Decorative Royal Gold Flourish Filigree */}
      <div className="flex items-center gap-2.5 my-4">
        <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-gold-400 to-gold-600" />
        <div className="w-2.5 h-2.5 rotate-45 bg-gold-500 border border-gold-300 shadow-xs" />
        <div className="w-16 h-[1.5px] bg-gradient-to-l from-transparent via-gold-400 to-gold-600" />
      </div>

      {subtitle && (
        <p className="text-base sm:text-lg text-brand-700 max-w-2xl font-sans leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
