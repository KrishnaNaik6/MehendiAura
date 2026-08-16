import React from "react";
import { MessageSquare } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { Button, ButtonProps } from "@/components/ui/Button";

interface WhatsAppButtonProps extends Omit<ButtonProps, "onClick"> {
  phoneNumber?: string;
  message?: string;
  label?: string;
}

export function WhatsAppButton({
  phoneNumber,
  message = "Hi, I am interested in your Mehendi services & Rental Jewellery. Could you please share availability and details?",
  label = "Enquire on WhatsApp",
  size = "md",
  variant = "whatsapp",
  fullWidth = false,
  className,
  ...props
}: WhatsAppButtonProps) {
  const defaultNumber =
    process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || "919876543210";
  const targetPhone = phoneNumber || defaultNumber;
  const whatsappUrl = getWhatsAppUrl(targetPhone, message);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={fullWidth ? "w-full" : "inline-block"}
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
