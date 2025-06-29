
import { Label } from '@/components/ui/label';
import { ProductAutocomplete } from '@/components/ui/product-autocomplete';
import { Product } from '@/types/store';
import { Barcode } from 'lucide-react';

interface ProductAdditionSectionProps {
  productSearch: string;
  products: Product[];
  onProductSearchChange: (value: string) => void;
  onProductSelect: (product: Product) => void;
  onCreateTemporary: (barcode: string, price: number) => void;
}

export const ProductAdditionSection = ({
  productSearch,
  products,
  onProductSearchChange,
  onProductSelect,
  onCreateTemporary
}: ProductAdditionSectionProps) => {
  return (
    <div className="space-y-3 border-t pt-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Barcode className="h-5 w-5" />
        Adicionar Produtos
      </h3>
      
      <div className="space-y-2">
        <Label>Código de Barras ou Nome do Produto</Label>
        <ProductAutocomplete
          value={productSearch}
          onChange={onProductSearchChange}
          products={products}
          placeholder="Digite o código de barras ou nome do produto..."
          onProductSelect={onProductSelect}
          onCreateTemporary={onCreateTemporary}
          className="text-center"
        />
      </div>
    </div>
  );
};
