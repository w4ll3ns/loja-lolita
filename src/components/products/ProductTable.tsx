import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ProfitMarginDisplay } from '@/components/ProfitMarginDisplay';
import { Pencil, Copy, Trash2 } from 'lucide-react';
import { Product } from '@/types/store';

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
  const allSelected = products.length > 0 && selectedProducts.length === products.length;
  const someSelected = selectedProducts.length > 0 && selectedProducts.length < products.length;

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
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
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              {canEdit && (
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={(checked) => onSelectProduct(product.id, !!checked)}
                  />
                </TableCell>
              )}
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.brand}</TableCell>
              <TableCell>{product.color}</TableCell>
              <TableCell>{product.size}</TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {product.gender}
                </span>
              </TableCell>
              <TableCell className="font-semibold text-store-green-600">
                R$ {product.price.toFixed(2)}
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                R$ {product.costPrice.toFixed(2)}
              </TableCell>
              <TableCell>
                <ProfitMarginDisplay 
                  salePrice={product.price} 
                  costPrice={product.costPrice}
                  className="text-xs"
                />
              </TableCell>
              <TableCell>
                <span className={`font-semibold ${
                  product.quantity <= 5 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {product.quantity}
                </span>
              </TableCell>
              <TableCell className="font-mono text-xs">{product.barcode}</TableCell>
              {canEdit && (
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="text-gray-500 hover:text-blue-600"
                      title="Editar produto"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicate(product)}
                      className="text-gray-500 hover:text-green-600"
                      title="Duplicar produto"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(product)}
                      className="text-gray-500 hover:text-red-600"
                      title="Excluir produto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
