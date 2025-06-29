
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ProfitMarginDisplay } from '@/components/ProfitMarginDisplay';
import { Pencil, Copy } from 'lucide-react';
import type { Product } from '@/contexts/StoreContext';

interface ProductTableProps {
  products: Product[];
  canEdit: boolean;
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  canEdit,
  onEdit,
  onDuplicate
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
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
