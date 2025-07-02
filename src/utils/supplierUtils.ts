
import { XmlSupplier, SupplierCheckResult } from '@/types/xml-import';

export const checkSupplierExists = (supplierData: XmlSupplier, suppliers: string[]): SupplierCheckResult => {
  // Verificar por CNPJ primeiro (mais preciso)
  const existingByCnpj = suppliers.find(s => 
    s.toLowerCase().includes(supplierData.cnpj) ||
    supplierData.cnpj.includes(s)
  );
  
  if (existingByCnpj) {
    return { exists: true, existingName: existingByCnpj };
  }

  // Verificar por nome (razão social ou fantasia)
  const nameToCheck = supplierData.nomeFantasia || supplierData.razaoSocial;
  const existingByName = suppliers.find(s => 
    s.toLowerCase().includes(nameToCheck.toLowerCase()) ||
    nameToCheck.toLowerCase().includes(s.toLowerCase())
  );

  if (existingByName) {
    return { exists: true, existingName: existingByName };
  }

  return { exists: false };
};
