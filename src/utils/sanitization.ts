/**
 * Funções de sanitização para entrada de dados
 */

export const sanitizeName = (name: string | undefined | null): string => {
  if (!name) return '';
  
  return name
    .trim()
    .replace(/[<>]/g, '') // Remove caracteres perigosos
    .replace(/\s+/g, ' ') // Remove espaços múltiplos
    .substring(0, 100); // Limita o tamanho
};

export const sanitizeText = (text: string | undefined | null): string => {
  if (!text) return '';
  
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove caracteres perigosos
    .replace(/\s+/g, ' ') // Remove espaços múltiplos
    .substring(0, 500); // Limita o tamanho
};

export const sanitizeBarcode = (barcode: string | undefined | null): string => {
  if (!barcode) return '';
  
  return barcode
    .trim()
    .replace(/[^a-zA-Z0-9]/g, '') // Remove caracteres especiais
    .substring(0, 50); // Limita o tamanho
};

export const sanitizeNumber = (value: string | number): number => {
  if (typeof value === 'number') {
    return Math.max(0, value);
  }
  
  const num = parseFloat(value.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
  return isNaN(num) ? 0 : Math.max(0, num);
};

export const sanitizeEmail = (email: string | undefined | null): string => {
  if (!email) return '';
  
  return email
    .trim()
    .toLowerCase()
    .replace(/[<>]/g, '') // Remove caracteres perigosos
    .substring(0, 100); // Limita o tamanho
};

export const sanitizePhone = (phone: string | undefined | null): string => {
  if (!phone) return '';
  
  return phone
    .trim()
    .replace(/[^\d+\-\(\)\s]/g, '') // Remove caracteres não permitidos
    .substring(0, 20); // Limita o tamanho
};
