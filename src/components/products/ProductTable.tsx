
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ProfitMarginDisplay } from '@/components/ProfitMarginDisplay';
import { Pencil, Copy, Trash2 } from 'lucide-react';
import { Product } from '@/types/store';
import { useAuth } from '@/contexts/AuthContext';

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
  const allSelected = products.length > 0 && selectedProducts.length === products.length;
  const someSelected = selectedProducts.length > 0 && selectedProducts.length < products.length;

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block">
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
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(product)}
                          className="text-gray-500 hover:text-red-600"
                          title="Excluir produto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3 p-4">
        {canEdit && (
          <div className="flex items-center justify-between pb-3 border-b">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
              />
              <span className="text-sm font-medium">
                {selectedProducts.length > 0 ? `${selectedProducts.length} selecionados` : 'Selecionar todos'}
              </span>
            </div>
          </div>
        )}
        
        {products.map((product) => (
          <div key={product.id} className="bg-white border rounded-lg p-4 shadow-sm relative">
            {canEdit && (
              <div className="absolute top-3 right-3">
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={(checked) => onSelectProduct(product.id, !!checked)}
                />
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg pr-8">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.category}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Marca:</span>
                  <p className="font-medium">{product.brand}</p>
                </div>
                <div>
                  <span className="text-gray-500">Cor:</span>
                  <p className="font-medium">{product.color}</p>
                </div>
                <div>
                  <span className="text-gray-500">Tamanho:</span>
                  <p className="font-medium">{product.size}</p>
                </div>
                <div>
                  <span className="text-gray-500">Gênero:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.gender}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Preço Venda:</span>
                  <p className="font-semibold text-store-green-600">R$ {product.price.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Preço Custo:</span>
                  <p className="font-semibold text-gray-600">R$ {product.costPrice.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">Estoque:</span>
                  <span className={`ml-2 font-semibold ${
                    product.quantity <= 5 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {product.quantity}
                  </span>
                </div>
                <ProfitMarginDisplay 
                  salePrice={product.price} 
                  costPrice={product.costPrice}
                  className="text-xs"
                />
              </div>
              
              <div className="text-xs">
                <span className="text-gray-500">Código:</span>
                <span className="ml-2 font-mono">{product.barcode}</span>
              </div>
              
              {canEdit && (
                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(product)}
                    className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDuplicate(product)}
                    className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Duplicar
                  </Button>
                  {canDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(product)}
                      className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
