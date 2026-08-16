/**
 * Formats clean WhatsApp Click-to-Chat URLs with contextual text messages
 */
export function getWhatsAppUrl(phoneNumber: string, message: string): string {
  // Strip non-numeric characters from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

export function buildServiceWhatsAppMsg(serviceName: string, businessName = "MehendiAura"): string {
  return `Hi ${businessName}, I am interested in booking your "${serviceName}" service. Could you please share availability and pricing details?`;
}

export function buildJewelleryWhatsAppMsg(jewelleryName: string, businessName = "MehendiAura"): string {
  return `Hi ${businessName}, I am interested in renting the "${jewelleryName}" jewellery set. Could you please share rental pricing, deposit, and availability details?`;
}

export function buildGeneralWhatsAppMsg(businessName = "MehendiAura"): string {
  return `Hi ${businessName}, I would like to inquire about your Mehendi services and Rental Jewellery collections.`;
}
