// usePhoneFormat - Phone Number Formatting Composable
// Single Responsibility: Format phone numbers for display

/**
 * Format phone number for display
 * Converts +90XXXXXXXXXX or 90XXXXXXXXXX or XXXXXXXXXX to +90 5XX XXX XX XX
 * @param {string} phone - Phone number in any format
 * @returns {string} Formatted phone number
 */
export function formatPhoneDisplay(phone) {
  if (!phone) return '-'
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')
  
  // If starts with 90 and has 12 digits (90 + 10 digit number)
  if (digits.startsWith('90') && digits.length === 12) {
    const num = digits.slice(2) // Remove 90
    return `+90 ${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6, 8)} ${num.slice(8, 10)}`
  }
  
  // If 10 digit Turkish number
  if (digits.length === 10) {
    return `+90 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`
  }
  
  // If doesn't match expected format, return as is
  return phone
}

export default function usePhoneFormat() {
  return {
    formatPhoneDisplay
  }
}
