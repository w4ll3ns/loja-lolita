
import { useState } from 'react';
import { XmlProduct, XmlSupplier } from '@/types/xml-import';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { extractSupplierFromXml, extractProductsFromXml } from '@/utils/xmlParser';
import { checkSupplierExists } from '@/utils/supplierUtils';
import { generateNfeHash } from '@/utils/xmlHasher';

export const useXmlImport = () => {
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [extractedProducts, setExtractedProducts] = useState<XmlProduct[]>([]);
  const [extractedSupplier, setExtractedSupplier] = useState<XmlSupplier | null>(null);
  const [supplierExists, setSupplierExists] = useState<boolean>(false);
  const [existingSupplierName, setExistingSupplierName] = useState<string>('');
  const [shouldImportSupplier, setShouldImportSupplier] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'edit'>('upload');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [supplierFormData, setSupplierFormData] = useState({
    name: '',
    cnpj: '',
    address: '',
    city: '',
    state: '',
    cep: '',
    phone: '',
    email: ''
  });

  const { categories, suppliers, addCategory, addSupplier, isXmlAlreadyImported, markXmlAsImported } = useStore();
  const { user } = useAuth();
  const { toast } = useToast();

  const canManageSuppliers = user?.role === 'admin';

  const processXmlFile = async () => {
    if (!xmlFile) return;

    setIsProcessing(true);
    try {
      const xmlText = await xmlFile.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

      if (xmlDoc.documentElement.nodeName === 'parsererror') {
        throw new Error('XML inválido');
      }

      const xmlHash = generateNfeHash(xmlDoc);
      
      if (isXmlAlreadyImported(xmlHash)) {
        toast({
          title: "XML já importado",
          description: "Este arquivo XML já foi importado anteriormente. Não é possível importar o mesmo XML novamente para evitar duplicidade de produtos.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      const supplierData = extractSupplierFromXml(xmlDoc);
      setExtractedSupplier(supplierData);

      let supplierCheck = { exists: false, existingName: undefined as string | undefined };
      if (supplierData) {
        supplierCheck = checkSupplierExists(supplierData, suppliers);
        setSupplierExists(supplierCheck.exists);
        setExistingSupplierName(supplierCheck.existingName || '');

        if (!supplierCheck.exists) {
          setSupplierFormData({
            name: supplierData.razaoSocial,
            cnpj: supplierData.cnpj,
            address: '',
            city: '',
            state: '',
            cep: '',
            phone: '',
            email: ''
          });
        }
      }

      let defaultSupplier = 'A definir';
      if (supplierData) {
        if (supplierCheck.exists) {
          defaultSupplier = supplierCheck.existingName || 'A definir';
        } else {
          defaultSupplier = supplierData.razaoSocial;
        }
      }

      const products = extractProductsFromXml(xmlDoc, defaultSupplier);

      if (products.length === 0) {
        throw new Error('Nenhum produto encontrado no XML');
      }

      setExtractedProducts(products);
      setStep('preview');
      
      let successMessage = `${products.length} produtos extraídos do XML`;
      if (supplierData) {
        successMessage += ` - Fornecedor: ${supplierData.razaoSocial}`;
        if (supplierCheck.exists) {
          successMessage += ' (já cadastrado)';
        } else {
          successMessage += ' (novo)';
        }
      }

      toast({
        title: "Sucesso",
        description: successMessage,
      });

      if (supplierData && !supplierCheck.exists && canManageSuppliers) {
        setShouldImportSupplier(true);
        toast({
          title: "Novo fornecedor encontrado",
          description: `Fornecedor "${supplierData.razaoSocial}" pode ser cadastrado automaticamente.`,
        });
      }

      markXmlAsImported(xmlHash);
      
    } catch (error) {
      toast({
        title: "Erro ao processar XML",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegisterSupplier = () => {
    if (!supplierFormData.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome do fornecedor é obrigatório",
        variant: "destructive",
      });
      return;
    }

    addSupplier(supplierFormData.name.trim());
    
    setExtractedProducts(prev => prev.map(p => ({
      ...p,
      editableSupplier: supplierFormData.name.trim()
    })));

    setShouldImportSupplier(false);
    setSupplierExists(true);
    setExistingSupplierName(supplierFormData.name.trim());

    toast({
      title: "Fornecedor cadastrado",
      description: `Fornecedor "${supplierFormData.name.trim()}" foi adicionado ao sistema`,
    });
  };

  const resetState = () => {
    setXmlFile(null);
    setExtractedProducts([]);
    setExtractedSupplier(null);
    setSupplierExists(false);
    setExistingSupplierName('');
    setShouldImportSupplier(false);
    setStep('upload');
    setEditingIndex(null);
    setSupplierFormData({
      name: '',
      cnpj: '',
      address: '',
      city: '',
      state: '',
      cep: '',
      phone: '',
      email: ''
    });
  };

  return {
    // State
    xmlFile,
    extractedProducts,
    extractedSupplier,
    supplierExists,
    existingSupplierName,
    shouldImportSupplier,
    isProcessing,
    step,
    editingIndex,
    supplierFormData,
    canManageSuppliers,
    categories,
    
    // Actions
    setXmlFile,
    setExtractedProducts,
    setShouldImportSupplier,
    setStep,
    setEditingIndex,
    setSupplierFormData,
    processXmlFile,
    handleRegisterSupplier,
    resetState,
    addCategory
  };
};
