
export function cleanPhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
}

export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleanedNumber = phoneNumber.replace(/\D/g, '');

  if (cleanedNumber.length === 11) { // Número de celular com DDD
    return cleanedNumber.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (cleanedNumber.length === 10) { // Número de telefone fixo com DDD
    return cleanedNumber.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  } else if (cleanedNumber.length === 9) { // Número de celular sem DDD
    return cleanedNumber.replace(/^(\d{5})(\d{4})$/, '$1-$2');
  } else if (cleanedNumber.length === 8) { // Número de telefone fixo sem DDD
    return cleanedNumber.replace(/^(\d{4})(\d{4})$/, '$1-$2');
  } else {
    return phoneNumber; // Retorna o número original se não corresponder aos formatos esperados
  }
};