"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { Button, ButtonProps } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics/track";

interface WhatsAppButtonProps extends Omit<ButtonProps, "onClick"> {
  phoneNumber?: string;
  message?: string;
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function WhatsAppButton({
  phoneNumber,
  message = "Hi, I am interested in your Mehendi services & Rental Jewellery. Could you please share availability and details?",
  label = "Enquire on WhatsApp",
  size = "md",
  variant = "whatsapp",
  fullWidth = false,
  className,
  onClick,
  ...props
}: WhatsAppButtonProps) {
  const defaultNumber =
    process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || "919876543210";
  const targetPhone = phoneNumber || defaultNumber;
  const whatsappUrl = getWhatsAppUrl(targetPhone, message);

  const handleClick = (e: React.MouseEvent) => {
    // Record WhatsApp click event immediately before navigating
    trackEvent("whatsapp_click", {
      pagePath: typeof window !== "undefined" ? window.location.pathname : "/",
      details: `WhatsApp Button: ${label} (${targetPhone})`,
      phoneNumber: targetPhone,
    });

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={fullWidth ? "w-full" : "inline-block"}
      aria-label={label}
    >
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        leftIcon={<MessageSquare className="w-4 h-4 shrink-0" />}
        className={className}
        {...props}
      >
        {label}
      </Button>
    </a>
  );
}
