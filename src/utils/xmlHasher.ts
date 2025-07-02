
// Função simples para gerar hash do conteúdo XML
export const generateXmlHash = (xmlContent: string): string => {
  // Remove espaços em branco e quebras de linha para comparação consistente
  const normalizedContent = xmlContent.replace(/\s+/g, '').toLowerCase();
  
  // Implementação simples de hash usando características do XML
  let hash = 0;
  for (let i = 0; i < normalizedContent.length; i++) {
    const char = normalizedContent.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Converte para 32bit integer
  }
  
  return Math.abs(hash).toString(36);
};

// Função para extrair dados únicos da NF-e para criar identificador mais robusto
export const generateNfeHash = (xmlDoc: Document): string => {
  try {
    // Buscar chave da NF-e
    const infNFe = xmlDoc.getElementsByTagName('infNFe')[0];
    const nfeKey = infNFe?.getAttribute('Id')?.replace('NFe', '') || '';
    
    // Buscar número da NF-e
    const nNF = xmlDoc.getElementsByTagName('nNF')[0]?.textContent || '';
    
    // Buscar CNPJ do emitente
    const emit = xmlDoc.getElementsByTagName('emit')[0];
    const cnpjEmit = emit?.getElementsByTagName('CNPJ')[0]?.textContent || '';
    
    // Buscar data de emissão
    const dhEmi = xmlDoc.getElementsByTagName('dhEmi')[0]?.textContent || 
                  xmlDoc.getElementsByTagName('dEmi')[0]?.textContent || '';
    
    // Criar hash baseado nos dados únicos da NF-e
    const uniqueData = `${nfeKey}-${nNF}-${cnpjEmit}-${dhEmi}`;
    
    if (uniqueData === '---') {
      // Fallback para hash do conteúdo completo se não encontrar dados específicos
      return generateXmlHash(xmlDoc.documentElement.outerHTML);
    }
    
    return generateXmlHash(uniqueData);
  } catch (error) {
    // Em caso de erro, usar hash do conteúdo completo
    return generateXmlHash(xmlDoc.documentElement.outerHTML);
  }
};
