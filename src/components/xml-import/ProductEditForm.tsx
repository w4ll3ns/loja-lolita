
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfitMarginDisplay } from '@/components/ProfitMarginDisplay';
import { XmlProduct } from '@/types/xml-import';

interface ProductEditFormProps {
  product: XmlProduct;
  categories: string[];
  suppliers: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  genders: string[];
  onUpdateField: (field: keyof XmlProduct, value: any) => void;
}

export const ProductEditForm: React.FC<ProductEditFormProps> = ({
  product,
  categories,
  suppliers,
  brands,
  colors,
  sizes,
  genders,
  onUpdateField
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Informações básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome do Produto *</Label>
            <Input
              value={product.editableName}
              onChange={(e) => onUpdateField('editableName', e.target.value)}
              placeholder="Nome do produto"
            />
          </div>

          <div className="space-y-2">
            <Label>Código de Barras</Label>
            <Input
              value={product.editableBarcode}
              onChange={(e) => onUpdateField('editableBarcode', e.target.value)}
              placeholder="Código de barras"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quantidade *</Label>
              <Input
                type="number"
                value={product.editableQuantity}
                onChange={(e) => onUpdateField('editableQuantity', e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Unidade</Label>
              <Input
                value={product.editableUnit}
                onChange={(e) => onUpdateField('editableUnit', e.target.value)}
                placeholder="UN"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preços e margem */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preços e Margem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preço de Custo *</Label>
            <Input
              type="number"
              step="0.01"
              value={product.editableCostPrice}
              onChange={(e) => onUpdateField('editableCostPrice', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Preço de Venda *</Label>
            <Input
              type="number"
              step="0.01"
              value={product.editableSalePrice}
              onChange={(e) => onUpdateField('editableSalePrice', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <Label className="text-sm font-medium">Margem de Lucro</Label>
            <ProfitMarginDisplay 
              salePrice={parseFloat(product.editableSalePrice) || 0}
              costPrice={parseFloat(product.editableCostPrice) || 0}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Classificação */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Classificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Categoria *</Label>
            <Select
              value={product.editableCategory}
              onValueChange={(value) => onUpdateField('editableCategory', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tamanho</Label>
            <Select
              value={product.editableSize}
              onValueChange={(value) => onUpdateField('editableSize', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tamanho" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Gênero *</Label>
            <Select
              value={product.editableGender}
              onValueChange={(value) => onUpdateField('editableGender', value as 'Masculino' | 'Feminino' | 'Unissex')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o gênero" />
              </SelectTrigger>
              <SelectContent>
                {genders.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Fornecedor e Marca */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fornecedor e Marca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Fornecedor</Label>
            <Select
              value={product.editableSupplier}
              onValueChange={(value) => onUpdateField('editableSupplier', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um fornecedor" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier} value={supplier}>
                    {supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Marca</Label>
            <Select
              value={product.editableBrand}
              onValueChange={(value) => onUpdateField('editableBrand', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma marca" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <Select
              value={product.editableColor}
              onValueChange={(value) => onUpdateField('editableColor', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma cor" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
