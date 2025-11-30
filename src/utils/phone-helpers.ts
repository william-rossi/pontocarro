
export function cleanPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
}

export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleanedNumber = phoneNumber.replace(/\D/g, '');

  if (cleanedNumber.length === 11) { // Mobile number with DDD
    return cleanedNumber.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (cleanedNumber.length === 10) { // Landline number with DDD
    return cleanedNumber.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  } else if (cleanedNumber.length === 9) { // Mobile number without DDD
    return cleanedNumber.replace(/^(\d{5})(\d{4})$/, '$1-$2');
  } else if (cleanedNumber.length === 8) { // Landline number without DDD
    return cleanedNumber.replace(/^(\d{4})(\d{4})$/, '$1-$2');
  } else {
    return phoneNumber; // Return original if it doesn't match expected formats
  }
};