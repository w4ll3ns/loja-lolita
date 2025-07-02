import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { XmlProduct, XmlSupplier } from '@/types/xml-import';
import { extractSupplierFromXml, extractProductsFromXml } from '@/utils/xmlParser';
import { checkSupplierExists } from '@/utils/supplierUtils';
import { SupplierInfoCard } from '@/components/xml-import/SupplierInfoCard';
import { ProductPreviewTable } from '@/components/xml-import/ProductPreviewTable';
import { ProductEditForm } from '@/components/xml-import/ProductEditForm';

interface ImportXmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: any[]) => void;
}

export const ImportXmlModal: React.FC<ImportXmlModalProps> = ({ isOpen, onClose, onImport }) => {
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [extractedProducts, setExtractedProducts] = useState<XmlProduct[]>([]);
  const [extractedSupplier, setExtractedSupplier] = useState<XmlSupplier | null>(null);
  const [supplierExists, setSupplierExists] = useState<boolean>(false);
  const [existingSupplierName, setExistingSupplierName] = useState<string>('');
  const [shouldImportSupplier, setShouldImportSupplier] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'edit'>('upload');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState<{ [key: number]: boolean }>({});
  
  // Estados para formulário de fornecedor (simplificado)
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

  const { categories, suppliers, brands, colors, addCategory, addSupplier, addBrand, addColor } = useStore();
  const { user } = useAuth();
  const { toast } = useToast();

  const sizes = ['PP', 'P', 'M', 'G', 'GG', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52'];
  const genders = ['Masculino', 'Feminino', 'Unissex'];

  // Verificar se usuário pode cadastrar fornecedores
  const canManageSuppliers = user?.role === 'admin';

  // ... keep existing code (handleFileUpload function)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.xml')) {
      toast({
        title: "Erro",
        description: "Selecione apenas arquivos XML",
        variant: "destructive",
      });
      return;
    }

    setXmlFile(file);
  };

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

      // Extrair dados do fornecedor
      const supplierData = extractSupplierFromXml(xmlDoc);
      setExtractedSupplier(supplierData);

      // Verificar se o fornecedor já existe
      let supplierCheck = { exists: false, existingName: undefined as string | undefined };
      if (supplierData) {
        supplierCheck = checkSupplierExists(supplierData, suppliers);
        setSupplierExists(supplierCheck.exists);
        setExistingSupplierName(supplierCheck.existingName || '');

        // Preencher formulário de fornecedor se não existir - SEMPRE usar razaoSocial (xNome)
        if (!supplierCheck.exists) {
          setSupplierFormData({
            name: supplierData.razaoSocial, // SEMPRE usar razão social
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

      // Definir o fornecedor baseado na verificação
      let defaultSupplier = 'A definir';
      if (supplierData) {
        if (supplierCheck.exists) {
          defaultSupplier = supplierCheck.existingName || 'A definir';
        } else {
          defaultSupplier = supplierData.razaoSocial; // SEMPRE usar razão social
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
        successMessage += ` - Fornecedor: ${supplierData.razaoSocial}`; // SEMPRE usar razão social
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

      // Se o fornecedor não existe e usuário tem permissão, sugerir importação
      if (supplierData && !supplierCheck.exists && canManageSuppliers) {
        setShouldImportSupplier(true);
        toast({
          title: "Novo fornecedor encontrado",
          description: `Fornecedor "${supplierData.razaoSocial}" pode ser cadastrado automaticamente.`, // SEMPRE usar razão social
        });
      }
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

  const toggleProductSelection = (index: number) => {
    setExtractedProducts(prev => prev.map((product, i) => 
      i === index ? { ...product, selected: !product.selected } : product
    ));
  };

  const updateProductField = (index: number, field: keyof XmlProduct, value: any) => {
    setExtractedProducts(prev => prev.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    ));
  };

  const handleEditProduct = (index: number) => {
    setEditingIndex(index);
    setStep('edit');
  };

  const handleSaveEdit = () => {
    setStep('preview');
    setEditingIndex(null);
    toast({
      title: "Produto atualizado",
      description: "As alterações foram salvas com sucesso",
    });
  };

  const handleAddNewCategory = (index: number) => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      updateProductField(index, 'editableCategory', newCategoryName.trim());
      setNewCategoryName('');
      setShowNewCategoryInput(prev => ({ ...prev, [index]: false }));
      toast({
        title: "Categoria adicionada",
        description: `A categoria "${newCategoryName.trim()}" foi criada`,
      });
    }
  };

  const handlePriceChange = (index: number, field: 'editableCostPrice' | 'editableSalePrice', value: string) => {
    // Remove caracteres não numéricos exceto vírgula e ponto
    const cleanValue = value.replace(/[^\d.,]/g, '');
    // Converte vírgula para ponto para cálculos
    const numericValue = cleanValue.replace(',', '.');
    
    updateProductField(index, field, numericValue);
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
    
    // Atualizar produtos para usar o novo fornecedor
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

  const handleImportProducts = () => {
    const selectedProducts = extractedProducts.filter(p => p.selected);
    
    if (selectedProducts.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um produto para importar",
        variant: "destructive",
      });
      return;
    }

    const productsToImport = selectedProducts.map(p => ({
      name: p.editableName,
      description: `Importado via NF-e - Código: ${p.cProd}`,
      price: parseFloat(p.editableSalePrice),
      costPrice: parseFloat(p.editableCostPrice),
      category: p.editableCategory,
      collection: 'NF-e',
      size: p.editableSize,
      supplier: p.editableSupplier,
      brand: p.editableBrand,
      quantity: parseInt(p.editableQuantity),
      barcode: p.editableBarcode || p.cProd,
      color: p.editableColor,
      gender: p.editableGender
    }));

    onImport(productsToImport);
    handleClose();
  };

  const handleClose = () => {
    setXmlFile(null);
    setExtractedProducts([]);
    setExtractedSupplier(null);
    setSupplierExists(false);
    setExistingSupplierName('');
    setShouldImportSupplier(false);
    setStep('upload');
    setEditingIndex(null);
    setShowNewCategoryInput({});
    setNewCategoryName('');
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
    onClose();
  };

  const selectAll = () => {
    setExtractedProducts(prev => prev.map(p => ({ ...p, selected: true })));
  };

  const deselectAll = () => {
    setExtractedProducts(prev => prev.map(p => ({ ...p, selected: false })));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Importar Produtos via NF-e
          </DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload do XML da NF-e</CardTitle>
                <CardDescription>
                  Selecione o arquivo XML da Nota Fiscal Eletrônica para extrair os produtos e dados do fornecedor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="xmlFile">Arquivo XML</Label>
                  <Input
                    id="xmlFile"
                    type="file"
                    accept=".xml"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                </div>
                
                {xmlFile && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      Arquivo selecionado: {xmlFile.name}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button 
                onClick={processXmlFile} 
                disabled={!xmlFile || isProcessing}
                className="bg-store-blue-600 hover:bg-store-blue-700"
              >
                {isProcessing ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Processar XML
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            {/* Informações do fornecedor extraído */}
            {extractedSupplier && (
              <SupplierInfoCard
                supplier={extractedSupplier}
                supplierExists={supplierExists}
                existingSupplierName={existingSupplierName}
                shouldImportSupplier={shouldImportSupplier}
                setShouldImportSupplier={setShouldImportSupplier}
                canManageSuppliers={canManageSuppliers}
                supplierFormData={supplierFormData}
                setSupplierFormData={setSupplierFormData}
                onRegisterSupplier={handleRegisterSupplier}
              />
            )}

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Produtos Extraídos ({extractedProducts.filter(p => p.selected).length} de {extractedProducts.length} selecionados)
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Selecionar Todos
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAll}>
                  Desmarcar Todos
                </Button>
              </div>
            </div>

            <ProductPreviewTable
              products={extractedProducts}
              categories={categories}
              sizes={sizes}
              genders={genders}
              onToggleSelection={toggleProductSelection}
              onUpdateField={updateProductField}
              onEditProduct={handleEditProduct}
              onPriceChange={handlePriceChange}
              onAddNewCategory={handleAddNewCategory}
              showNewCategoryInput={showNewCategoryInput}
              setShowNewCategoryInput={setShowNewCategoryInput}
              newCategoryName={newCategoryName}
              setNewCategoryName={setNewCategoryName}
            />

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Voltar
              </Button>
              <Button 
                onClick={handleImportProducts}
                disabled={extractedProducts.filter(p => p.selected).length === 0}
                className="bg-store-green-600 hover:bg-store-green-700"
              >
                Importar Produtos Selecionados ({extractedProducts.filter(p => p.selected).length})
              </Button>
            </div>
          </div>
        )}

        {step === 'edit' && editingIndex !== null && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Edição Avançada: {extractedProducts[editingIndex].editableName}
              </h3>
            </div>

            <ProductEditForm
              product={extractedProducts[editingIndex]}
              categories={categories}
              suppliers={suppliers}
              brands={brands}
              colors={colors}
              sizes={sizes}
              genders={genders}
              onUpdateField={(field, value) => updateProductField(editingIndex, field, value)}
            />

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setStep('preview')}>
                Voltar à Lista
              </Button>
              <Button onClick={handleSaveEdit} className="bg-store-blue-600 hover:bg-store-blue-700">
                Salvar Alterações
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
