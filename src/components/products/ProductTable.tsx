
import React from 'react';
import { Product } from '@/types/store';
import { useAuth } from '@/contexts/AuthContext';
import { ProductTableDesktop } from './table/ProductTableDesktop';
import { ProductTableMobile } from './table/ProductTableMobile';

interface ProductTableProps {
  products: Product[];
  canEdit: boolean;
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onDelete: (product: Product) => void;
  selectedProducts: string[];
  onSelectProduct: (productId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  canEdit,
  onEdit,
  onDuplicate,
  onDelete,
  selectedProducts,
  onSelectProduct,
  onSelectAll
}) => {
  const { user } = useAuth();
  const canDelete = user?.role === 'admin';

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <ProductTableDesktop
          products={products}
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          selectedProducts={selectedProducts}
          onSelectProduct={onSelectProduct}
          onSelectAll={onSelectAll}
        />
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        <ProductTableMobile
          products={products}
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          selectedProducts={selectedProducts}
          onSelectProduct={onSelectProduct}
          onSelectAll={onSelectAll}
        />
      </div>
    </div>
  );
};
