
import React from 'react';
import { TableHead, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '@/types/store';

interface ProductTableHeaderRowProps {
  canEdit: boolean;
  products: Product[];
  selectedProducts: string[];
  onSelectAll: (selected: boolean) => void;
}

export const ProductTableHeaderRow: React.FC<ProductTableHeaderRowProps> = ({
  canEdit,
  products,
  selectedProducts,
  onSelectAll
}) => {
  const allSelected = products.length > 0 && selectedProducts.length === products.length;
  const someSelected = selectedProducts.length > 0 && selectedProducts.length < products.length;

  return (
    <TableRow>
      {canEdit && (
        <TableHead className="w-12">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(checked) => onSelectAll(!!checked)}
          />
          {someSelected && !allSelected && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2 h-2 bg-primary rounded-sm"></div>
            </div>
          )}
        </TableHead>
      )}
      <TableHead>Nome</TableHead>
      <TableHead>Categoria</TableHead>
      <TableHead>Marca</TableHead>
      <TableHead>Cor</TableHead>
      <TableHead>Tamanho</TableHead>
      <TableHead>Gênero</TableHead>
      <TableHead>Preço Venda</TableHead>
      <TableHead>Preço Custo</TableHead>
      <TableHead>Margem</TableHead>
      <TableHead>Estoque</TableHead>
      <TableHead>Código</TableHead>
      {canEdit && <TableHead>Ações</TableHead>}
    </TableRow>
  );
};
