
export interface XmlProduct {
  cProd: string;
  cEAN: string;
  xProd: string;
  qCom: string;
  uCom: string;
  vUnCom: string;
  vProd: string;
  NCM?: string;
  CFOP?: string;
  xPed?: string;
  selected: boolean;
  // Campos editáveis
  editableName: string;
  editableBarcode: string;
  editableQuantity: string;
  editableUnit: string;
  editableCostPrice: string;
  editableSalePrice: string;
  editableCategory: string;
  editableSize: string;
  editableGender: 'Masculino' | 'Feminino' | 'Unissex';
  editableSupplier: string;
  editableBrand: string;
  editableColor: string;
}

export interface XmlSupplier {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

export interface SupplierCheckResult {
  exists: boolean;
  existingName?: string;
}
