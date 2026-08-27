"use client";

import React from "react";
import { Phone } from "lucide-react";
import { getCallUrl } from "@/lib/call";
import { Button, ButtonProps } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics/track";

interface CallButtonProps extends Omit<ButtonProps, "onClick"> {
  phoneNumber?: string;
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function CallButton({
  phoneNumber,
  label = "Call Now",
  size = "md",
  variant = "call",
  fullWidth = false,
  className,
  onClick,
  ...props
}: CallButtonProps) {
  const defaultPhone =
    process.env.NEXT_PUBLIC_DEFAULT_PHONE || "+919876543210";
  const targetPhone = phoneNumber || defaultPhone;
  const callUrl = getCallUrl(targetPhone);

  const handleClick = (e: React.MouseEvent) => {
    // Record call click event immediately before navigating
    trackEvent("call_click", {
      pagePath: typeof window !== "undefined" ? window.location.pathname : "/",
      details: `Call Button: ${label} (${targetPhone})`,
      phoneNumber: targetPhone,
    });

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      href={callUrl}
      onClick={handleClick}
      className={fullWidth ? "w-full" : "inline-block"}
      aria-label={label}
    >
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        leftIcon={<Phone className="w-4 h-4 shrink-0 text-gold-400" />}
        className={className}
        {...props}
      >
        {label}
      </Button>
    </a>
  );
}
