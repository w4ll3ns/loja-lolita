
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { XmlProduct, XmlSupplier } from '@/types/xml-import';
import { SupplierInfoCard } from '@/components/xml-import/SupplierInfoCard';
import { ProductPreviewTable } from '@/components/xml-import/ProductPreviewTable';
import { useToast } from '@/hooks/use-toast';

interface XmlPreviewStepProps {
  extractedProducts: XmlProduct[];
  extractedSupplier: XmlSupplier | null;
  supplierExists: boolean;
  existingSupplierName: string;
  shouldImportSupplier: boolean;
  canManageSuppliers: boolean;
  supplierFormData: any;
  categories: string[];
  onToggleSelection: (index: number) => void;
  onUpdateField: (index: number, field: keyof XmlProduct, value: any) => void;
  onEditProduct: (index: number) => void;
  onPriceChange: (index: number, field: 'editableCostPrice' | 'editableSalePrice', value: string) => void;
  onAddNewCategory: (index: number, categoryName: string) => void;
  setShouldImportSupplier: (value: boolean) => void;
  setSupplierFormData: (data: any) => void;
  onRegisterSupplier: () => void;
  onBack: () => void;
  onImportProducts: () => void;
}

export const XmlPreviewStep: React.FC<XmlPreviewStepProps> = ({
  extractedProducts,
  extractedSupplier,
  supplierExists,
  existingSupplierName,
  shouldImportSupplier,
  canManageSuppliers,
  supplierFormData,
  categories,
  onToggleSelection,
  onUpdateField,
  onEditProduct,
  onPriceChange,
  onAddNewCategory,
  setShouldImportSupplier,
  setSupplierFormData,
  onRegisterSupplier,
  onBack,
  onImportProducts
}) => {
  const [showNewCategoryInput, setShowNewCategoryInput] = useState<{ [key: number]: boolean }>({});
  const [newCategoryName, setNewCategoryName] = useState('');
  const { toast } = useToast();

  const sizes = ['PP', 'P', 'M', 'G', 'GG', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52'];
  const genders = ['Masculino', 'Feminino', 'Unissex'];

  const handleAddNewCategory = (index: number) => {
    if (newCategoryName.trim()) {
      onAddNewCategory(index, newCategoryName.trim());
      setNewCategoryName('');
      setShowNewCategoryInput(prev => ({ ...prev, [index]: false }));
      toast({
        title: "Categoria adicionada",
        description: `A categoria "${newCategoryName.trim()}" foi criada`,
      });
    }
  };

  const selectAll = () => {
    extractedProducts.forEach((_, index) => {
      if (!extractedProducts[index].selected) {
        onToggleSelection(index);
      }
    });
  };

  const deselectAll = () => {
    extractedProducts.forEach((_, index) => {
      if (extractedProducts[index].selected) {
        onToggleSelection(index);
      }
    });
  };

  return (
    <div className="space-y-4">
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
          onRegisterSupplier={onRegisterSupplier}
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
        onToggleSelection={onToggleSelection}
        onUpdateField={onUpdateField}
        onEditProduct={onEditProduct}
        onPriceChange={onPriceChange}
        onAddNewCategory={handleAddNewCategory}
        showNewCategoryInput={showNewCategoryInput}
        setShowNewCategoryInput={setShowNewCategoryInput}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
      />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button 
          onClick={onImportProducts}
          disabled={extractedProducts.filter(p => p.selected).length === 0}
          className="bg-store-green-600 hover:bg-store-green-700"
        >
          Importar Produtos Selecionados ({extractedProducts.filter(p => p.selected).length})
        </Button>
      </div>
    </div>
  );
};
