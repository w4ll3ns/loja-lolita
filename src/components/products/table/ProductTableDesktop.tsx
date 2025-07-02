
import React from 'react';
import { Table, TableBody, TableHeader } from '@/components/ui/table';
import { Product } from '@/types/store';
import { ProductTableHeaderRow } from './ProductTableHeaderRow';
import { ProductTableRow } from './ProductTableRow';

interface ProductTableDesktopProps {
  products: Product[];
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onDelete: (product: Product) => void;
  selectedProducts: string[];
  onSelectProduct: (productId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

export const ProductTableDesktop: React.FC<ProductTableDesktopProps> = ({
  products,
  canEdit,
  canDelete,
  onEdit,
  onDuplicate,
  onDelete,
  selectedProducts,
  onSelectProduct,
  onSelectAll
}) => {
  return (
    <Table>
      <TableHeader>
        <ProductTableHeaderRow
          canEdit={canEdit}
          products={products}
          selectedProducts={selectedProducts}
          onSelectAll={onSelectAll}
        />
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <ProductTableRow
            key={product.id}
            product={product}
            canEdit={canEdit}
            canDelete={canDelete}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            isSelected={selectedProducts.includes(product.id)}
            onSelect={onSelectProduct}
          />
        ))}
      </TableBody>
    </Table>
  );
};
