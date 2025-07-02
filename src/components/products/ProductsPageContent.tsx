
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ProductTable } from './ProductTable';
import type { Product } from '@/types/store';

interface ProductsPageContentProps {
  filteredProducts: Product[];
  viewMode: 'cards' | 'list';
  canEdit: boolean;
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onDelete: (product: Product) => void;
  selectedProducts: string[];
  onSelectProduct: (productId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  searchTerm: string;
}

export const ProductsPageContent: React.FC<ProductsPageContentProps> = ({
  filteredProducts,
  viewMode,
  canEdit,
  onEdit,
  onDuplicate,
  onDelete,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
  searchTerm
}) => {
  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-sm md:text-base">
          {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* On mobile, always show cards. On desktop, respect viewMode */}
      <div className="md:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              canEdit={canEdit}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              isSelected={selectedProducts.includes(product.id)}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </div>
      
      <div className="hidden md:block">
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                canEdit={canEdit}
                onEdit={onEdit}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
                isSelected={selectedProducts.includes(product.id)}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            canEdit={canEdit}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            selectedProducts={selectedProducts}
            onSelectProduct={onSelectProduct}
            onSelectAll={onSelectAll}
          />
        )}
      </div>
    </>
  );
};
