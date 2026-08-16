import React from "react";
import { Phone } from "lucide-react";
import { getCallUrl } from "@/lib/call";
import { Button, ButtonProps } from "@/components/ui/Button";

interface CallButtonProps extends Omit<ButtonProps, "onClick"> {
  phoneNumber?: string;
  label?: string;
}

export function CallButton({
  phoneNumber,
  label = "Call Now",
  size = "md",
  variant = "call",
  fullWidth = false,
  className,
  ...props
}: CallButtonProps) {
  const defaultPhone =
    process.env.NEXT_PUBLIC_DEFAULT_PHONE || "+919876543210";
  const targetPhone = phoneNumber || defaultPhone;
  const callUrl = getCallUrl(targetPhone);

  return (
    <a href={callUrl} className={fullWidth ? "w-full" : "inline-block"}>
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
