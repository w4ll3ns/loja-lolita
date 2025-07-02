
import { XmlProduct, XmlSupplier } from '@/types/xml-import';

export const extractSupplierFromXml = (xmlDoc: Document): XmlSupplier | null => {
  // Buscar pelo caminho completo da NF-e
  const nfeProc = xmlDoc.getElementsByTagName('nfeProc')[0];
  let emit: Element | null = null;
  
  if (nfeProc) {
    // Caminho: nfeProc.NFe.infNFe.emit
    const nfe = nfeProc.getElementsByTagName('NFe')[0];
    if (nfe) {
      const infNFe = nfe.getElementsByTagName('infNFe')[0];
      if (infNFe) {
        emit = infNFe.getElementsByTagName('emit')[0];
      }
    }
  }
  
  // Fallback para estrutura mais simples
  if (!emit) {
    emit = xmlDoc.getElementsByTagName('emit')[0];
  }
  
  if (!emit) return null;

  const cnpj = emit.getElementsByTagName('CNPJ')[0]?.textContent || '';
  const razaoSocial = emit.getElementsByTagName('xNome')[0]?.textContent || '';
  const nomeFantasia = emit.getElementsByTagName('xFant')[0]?.textContent || '';

  return {
    cnpj,
    razaoSocial,
    nomeFantasia
  };
};

export const inferSizeFromProduct = (productName: string, productCode: string): string => {
  const sizePattern = /\b(PP|P|M|G|GG|XG|XXG|34|36|38|40|42|44|46|48|50|52)\b/i;
  const match = productName.match(sizePattern) || productCode.match(sizePattern);
  return match ? match[0].toUpperCase() : '';
};

export const inferGenderFromProduct = (productName: string): 'Masculino' | 'Feminino' | 'Unissex' => {
  const productNameLower = productName.toLowerCase();
  if (productNameLower.includes('masc') || productNameLower.includes('masculino') || productNameLower.includes('homem')) {
    return 'Masculino';
  }
  if (productNameLower.includes('fem') || productNameLower.includes('feminino') || productNameLower.includes('mulher')) {
    return 'Feminino';
  }
  return 'Unissex';
};

export const extractProductsFromXml = (xmlDoc: Document, supplierName: string): XmlProduct[] => {
  const detElements = xmlDoc.getElementsByTagName('det');
  const products: XmlProduct[] = [];

  for (let i = 0; i < detElements.length; i++) {
    const det = detElements[i];
    const prod = det.getElementsByTagName('prod')[0];
    
    if (prod) {
      const cProd = prod.getElementsByTagName('cProd')[0]?.textContent || '';
      const cEAN = prod.getElementsByTagName('cEAN')[0]?.textContent || 
                   prod.getElementsByTagName('cEANTrib')[0]?.textContent || '';
      const xProd = prod.getElementsByTagName('xProd')[0]?.textContent || '';
      const qCom = prod.getElementsByTagName('qCom')[0]?.textContent || '0';
      const uCom = prod.getElementsByTagName('uCom')[0]?.textContent || 'UN';
      const vUnCom = prod.getElementsByTagName('vUnCom')[0]?.textContent || '0';
      const vProd = prod.getElementsByTagName('vProd')[0]?.textContent || '0';
      const NCM = prod.getElementsByTagName('NCM')[0]?.textContent || '';
      const CFOP = prod.getElementsByTagName('CFOP')[0]?.textContent || '';
      const xPed = prod.getElementsByTagName('xPed')[0]?.textContent || '';

      const costPrice = parseFloat(vUnCom.replace(',', '.')) || 0;
      const suggestedSalePrice = costPrice * 1.5; // Margem sugerida de 50%

      const size = inferSizeFromProduct(xProd, cProd);
      const gender = inferGenderFromProduct(xProd);

      products.push({
        cProd,
        cEAN: cEAN === 'SEM GTIN' ? '' : cEAN,
        xProd,
        qCom,
        uCom,
        vUnCom,
        vProd,
        NCM,
        CFOP,
        xPed,
        selected: true,
        // Campos editáveis inicializados
        editableName: xProd,
        editableBarcode: cEAN === 'SEM GTIN' ? '' : cEAN,
        editableQuantity: qCom,
        editableUnit: uCom,
        editableCostPrice: costPrice.toFixed(2),
        editableSalePrice: suggestedSalePrice.toFixed(2),
        editableCategory: 'Importado',
        editableSize: size,
        editableGender: gender,
        editableSupplier: supplierName,
        editableBrand: 'A definir',
        editableColor: 'A definir'
      });
    }
  }

  return products;
};
