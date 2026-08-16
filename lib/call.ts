/**
 * Formats tel: links for mobile phone dialers
 */
export function getCallUrl(phoneNumber: string): string {
  // Keep country code plus sign if present, strip spaces/hyphens
  const formatted = phoneNumber.replace(/[\s-]/g, '');
  return `tel:${formatted}`;
}
