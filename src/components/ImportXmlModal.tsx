
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDataManagement } from '@/contexts/DataManagementContext';
import { XmlProduct } from '@/types/xml-import';
import { useXmlImport } from '@/hooks/useXmlImport';
import { XmlUploadStep } from '@/components/xml-import/XmlUploadStep';
import { XmlPreviewStep } from '@/components/xml-import/XmlPreviewStep';
import { XmlEditStep } from '@/components/xml-import/XmlEditStep';

interface ImportXmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: any[]) => void;
}

export const ImportXmlModal: React.FC<ImportXmlModalProps> = ({ isOpen, onClose, onImport }) => {
  const { suppliers, brands, colors, sizes } = useDataManagement();
  const { toast } = useToast();
  
  const {
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
    setXmlFile,
    setExtractedProducts,
    setShouldImportSupplier,
    setStep,
    setEditingIndex,
    setSupplierFormData,
    processXmlFile,
    handleRegisterSupplier,
    resetState,
    addCategory,
    markAsImported
  } = useXmlImport();

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

  const handlePriceChange = (index: number, field: 'editableCostPrice' | 'editableSalePrice', value: string) => {
    const cleanValue = value.replace(/[^\d.,]/g, '');
    const numericValue = cleanValue.replace(',', '.');
    updateProductField(index, field, numericValue);
  };

  const handleAddNewCategory = (index: number, categoryName: string) => {
    addCategory(categoryName);
    updateProductField(index, 'editableCategory', categoryName);
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

    // Só marca como importado APÓS importar os produtos com sucesso
    try {
      onImport(productsToImport);
      markAsImported(); // Marca como importado apenas quando a importação é bem-sucedida
      handleClose();
      
      toast({
        title: "Importação concluída",
        description: `${selectedProducts.length} produtos foram importados com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar os produtos",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
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
          <XmlUploadStep
            xmlFile={xmlFile}
            isProcessing={isProcessing}
            onFileUpload={handleFileUpload}
            onProcessXml={processXmlFile}
            onCancel={handleClose}
          />
        )}

        {step === 'preview' && (
          <XmlPreviewStep
            extractedProducts={extractedProducts}
            extractedSupplier={extractedSupplier}
            supplierExists={supplierExists}
            existingSupplierName={existingSupplierName}
            shouldImportSupplier={shouldImportSupplier}
            canManageSuppliers={canManageSuppliers}
            supplierFormData={supplierFormData}
            categories={categories}
            onToggleSelection={toggleProductSelection}
            onUpdateField={updateProductField}
            onEditProduct={handleEditProduct}
            onPriceChange={handlePriceChange}
            onAddNewCategory={handleAddNewCategory}
            setShouldImportSupplier={setShouldImportSupplier}
            setSupplierFormData={setSupplierFormData}
            onRegisterSupplier={handleRegisterSupplier}
            onBack={() => setStep('upload')}
            onImportProducts={handleImportProducts}
          />
        )}

        {step === 'edit' && editingIndex !== null && (
          <XmlEditStep
            product={extractedProducts[editingIndex]}
            categories={categories}
            suppliers={suppliers}
            brands={brands}
            colors={colors}
            sizes={sizes}
            onUpdateField={(field, value) => updateProductField(editingIndex, field, value)}
            onBack={() => setStep('preview')}
            onSave={handleSaveEdit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
