
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Plus } from 'lucide-react';
import { ProfitMarginDisplay } from '@/components/ProfitMarginDisplay';
import { XmlProduct } from '@/types/xml-import';

interface ProductPreviewTableProps {
  products: XmlProduct[];
  categories: string[];
  sizes: string[];
  genders: string[];
  onToggleSelection: (index: number) => void;
  onUpdateField: (index: number, field: keyof XmlProduct, value: any) => void;
  onEditProduct: (index: number) => void;
  onPriceChange: (index: number, field: 'editableCostPrice' | 'editableSalePrice', value: string) => void;
  onAddNewCategory: (index: number) => void;
  showNewCategoryInput: { [key: number]: boolean };
  setShowNewCategoryInput: (value: { [key: number]: boolean }) => void;
  newCategoryName: string;
  setNewCategoryName: (value: string) => void;
}

export const ProductPreviewTable: React.FC<ProductPreviewTableProps> = ({
  products,
  categories,
  sizes,
  genders,
  onToggleSelection,
  onUpdateField,
  onEditProduct,
  onPriceChange,
  onAddNewCategory,
  showNewCategoryInput,
  setShowNewCategoryInput,
  newCategoryName,
  setNewCategoryName
}) => {
  return (
    <div className="border rounded-lg max-h-96 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={products.every(p => p.selected)}
                onCheckedChange={(checked) => {
                  products.forEach((_, index) => {
                    onToggleSelection(index);
                  });
                }}
              />
            </TableHead>
            <TableHead className="min-w-48">Produto</TableHead>
            <TableHead className="min-w-32">Código</TableHead>
            <TableHead className="min-w-32">Preço Custo</TableHead>
            <TableHead className="min-w-32">Preço Venda</TableHead>
            <TableHead className="min-w-32">Margem</TableHead>
            <TableHead className="min-w-32">Categoria</TableHead>
            <TableHead className="min-w-24">Tamanho</TableHead>
            <TableHead className="min-w-28">Gênero</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => {
            const salePrice = parseFloat(product.editableSalePrice) || 0;
            const costPrice = parseFloat(product.editableCostPrice) || 0;
            
            return (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox 
                    checked={product.selected}
                    onCheckedChange={() => onToggleSelection(index)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={product.editableName}
                    onChange={(e) => onUpdateField(index, 'editableName', e.target.value)}
                    className="min-w-44"
                    placeholder="Nome do produto"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={product.editableBarcode}
                    onChange={(e) => onUpdateField(index, 'editableBarcode', e.target.value)}
                    className="font-mono text-xs"
                    placeholder="Código"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={product.editableCostPrice}
                    onChange={(e) => onPriceChange(index, 'editableCostPrice', e.target.value)}
                    placeholder="0,00"
                    className="text-right"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={product.editableSalePrice}
                    onChange={(e) => onPriceChange(index, 'editableSalePrice', e.target.value)}
                    placeholder="0,00"
                    className="text-right"
                  />
                </TableCell>
                <TableCell>
                  <ProfitMarginDisplay 
                    salePrice={salePrice} 
                    costPrice={costPrice}
                    className="text-xs"
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Select
                      value={product.editableCategory}
                      onValueChange={(value) => {
                        if (value === 'add-new') {
                          setShowNewCategoryInput(prev => ({ ...prev, [index]: true }));
                        } else {
                          onUpdateField(index, 'editableCategory', value);
                        }
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                        <SelectItem value="add-new">
                          <div className="flex items-center gap-2">
                            <Plus className="h-3 w-3" />
                            <span>Adicionar novo</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {showNewCategoryInput[index] && (
                      <div className="flex gap-1">
                        <Input
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Nova categoria"
                          className="text-xs"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              onAddNewCategory(index);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={() => onAddNewCategory(index)}
                          className="px-2"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={product.editableSize}
                    onValueChange={(value) => onUpdateField(index, 'editableSize', value)}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={product.editableGender}
                    onValueChange={(value) => onUpdateField(index, 'editableGender', value as 'Masculino' | 'Feminino' | 'Unissex')}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditProduct(index)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edição avançada"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
