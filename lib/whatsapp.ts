import { Locale } from "./i18n/config";

/**
 * Encodes string into valid WhatsApp URL
 */
export function getWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

/**
 * Builds localized WhatsApp message for Mehendi Service inquiry
 */
export function buildServiceWhatsAppMsg(
  serviceName: string,
  businessName: string = "MehendiAura",
  locale: Locale = "en"
): string {
  if (locale === "kn") {
    return `ನಮಸ್ಕಾರ ${businessName}, ನನಗೆ '${serviceName}' ಮೆಹೆಂದಿ ಸೇವೆಯ ಬಗ್ಗೆ ಆಸಕ್ತಿ ಇದೆ. ದಯವಿಟ್ಟು ಲಭ್ಯತೆ ಮತ್ತು ಬೆಲೆಯ ವಿವರಗಳನ್ನು ತಿಳಿಸಿ.`;
  }
  return `Hi ${businessName}, I am interested in booking your '${serviceName}' mehendi service. Could you please share date availability, custom pricing, and booking details?`;
}

/**
 * Builds localized WhatsApp message for Rental Jewellery Set inquiry
 */
export function buildJewelleryWhatsAppMsg(
  jewelleryName: string,
  businessName: string = "MehendiAura",
  locale: Locale = "en"
): string {
  if (locale === "kn") {
    return `ನಮಸ್ಕಾರ ${businessName}, ನನಗೆ '${jewelleryName}' ಬಾಡಿಗೆ ಆಭರಣ ಸೆಟ್‌ನಲ್ಲಿ ಆಸಕ್ತಿ ಇದೆ. ದಯವಿಟ್ಟು ಬಾಡಿಗೆ ಲಭ್ಯತೆ, ದಿನದ ದರ ಮತ್ತು ಠೇವಣಿ ವಿವರಗಳನ್ನು ತಿಳಿಸಿ.`;
  }
  return `Hi ${businessName}, I am interested in renting the '${jewelleryName}' jewellery set. Could you please share availability, rental price, security deposit terms, and booking details?`;
}

/**
 * Builds general localized WhatsApp message
 */
export function buildGeneralWhatsAppMsg(
  businessName: string = "MehendiAura",
  locale: Locale = "en"
): string {
  if (locale === "kn") {
    return `ನಮಸ್ಕಾರ ${businessName}, ನಾನು ನಿಮ್ಮ ಬ್ರೈಡಲ್ ಮೆಹೆಂದಿ ಸೇವೆಗಳು ಮತ್ತು ಬಾಡಿಗೆ ಆಭರಣಗಳ ಬಗ್ಗೆ ವಿಚಾರಿಸಲು ಬಯಸುತ್ತೇನೆ. ದಯವಿಟ್ಟು ವಿವರಗಳನ್ನು ನೀಡಿ.`;
  }
  return `Hi ${businessName}, I would like to inquire about your bridal mehendi services and rental jewellery availability for an upcoming wedding celebration.`;
}
