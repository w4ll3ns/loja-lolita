
import React from 'react';
import { Button } from '@/components/ui/button';
import { XmlProduct } from '@/types/xml-import';
import { ProductEditForm } from '@/components/xml-import/ProductEditForm';

interface XmlEditStepProps {
  product: XmlProduct;
  categories: string[];
  suppliers: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  onUpdateField: (field: keyof XmlProduct, value: any) => void;
  onBack: () => void;
  onSave: () => void;
}

export const XmlEditStep: React.FC<XmlEditStepProps> = ({
  product,
  categories,
  suppliers,
  brands,
  colors,
  sizes,
  onUpdateField,
  onBack,
  onSave
}) => {
  const genders = ['Masculino', 'Feminino', 'Unissex'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Edição Avançada: {product.editableName}
        </h3>
      </div>

      <ProductEditForm
        product={product}
        categories={categories}
        suppliers={suppliers}
        brands={brands}
        colors={colors}
        sizes={sizes}
        genders={genders}
        onUpdateField={onUpdateField}
      />

      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          Voltar à Lista
        </Button>
        <Button onClick={onSave} className="bg-store-blue-600 hover:bg-store-blue-700">
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};
