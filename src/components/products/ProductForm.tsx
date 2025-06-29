import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { MaskedInput } from '@/components/ui/masked-input';
import { ProfitMarginDisplay } from '@/components/ProfitMarginDisplay';
import { Plus } from 'lucide-react';
import { Product } from '@/types/store';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  product: {
    name: string;
    description: string;
    price: string;
    costPrice: string;
    category: string;
    collection: string;
    size: string;
    supplier: string;
    brand: string;
    quantity: string;
    barcode: string;
    color: string;
    gender: string;
  };
  setProduct: (product: any) => void;
  categories: string[];
  collections: string[];
  suppliers: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  genders: string[];
  title: string;
  canAddStructuralData: boolean;
  onAddCategory: () => void;
  onAddCollection: () => void;
  onAddBrand: () => void;
  onAddSupplier: () => void;
  onAddColor: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  setProduct,
  categories,
  collections,
  suppliers,
  brands,
  colors,
  sizes,
  genders,
  title,
  canAddStructuralData,
  onAddCategory,
  onAddCollection,
  onAddBrand,
  onAddSupplier,
  onAddColor
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              placeholder="Nome do produto"
            />
          </div>
          
          {/* Sale Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Preço de Venda *</Label>
            <MaskedInput
              id="price"
              mask="currency"
              value={product.price}
              onChange={(value) => {
                const numericValue = value.replace(/[^\d,]/g, '').replace(',', '.');
                setProduct({ ...product, price: numericValue });
              }}
              placeholder="R$ 0,00"
            />
          </div>
          
          {/* Cost Price */}
          <div className="space-y-2">
            <Label htmlFor="costPrice">Preço de Custo *</Label>
            <MaskedInput
              id="costPrice"
              mask="currency"
              value={product.costPrice}
              onChange={(value) => {
                const numericValue = value.replace(/[^\d,]/g, '').replace(',', '.');
                setProduct({ ...product, costPrice: numericValue });
              }}
              placeholder="R$ 0,00"
            />
          </div>

          {/* Profit Margin Display */}
          {product.price && product.costPrice && (
            <div className="col-span-3 p-3 bg-gray-50 rounded-lg">
              <ProfitMarginDisplay 
                salePrice={parseFloat(product.price) || 0} 
                costPrice={parseFloat(product.costPrice) || 0}
              />
            </div>
          )}

          {/* Gênero */}
          <div className="col-span-3 space-y-2">
            <Label>Gênero *</Label>
            <RadioGroup
              value={product.gender}
              onValueChange={(value) => setProduct({ ...product, gender: value })}
              className="flex flex-row gap-6"
            >
              {genders.map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <RadioGroupItem value={gender} id={gender} />
                  <Label htmlFor={gender}>{gender}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          {/* Categoria com opção de adicionar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="category">Categoria *</Label>
              {canAddStructuralData && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onAddCategory}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Nova
                </Button>
              )}
            </div>
            <Select onValueChange={(value) => setProduct({ ...product, category: value })} value={product.category}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cor com opção de adicionar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="color">Cor *</Label>
              {canAddStructuralData && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onAddColor}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Nova
                </Button>
              )}
            </div>
            <Select onValueChange={(value) => setProduct({ ...product, color: value })} value={product.color}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma cor" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {colors.map((color) => (
                  <SelectItem key={color} value={color}>{color}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Coleção com opção de adicionar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="collection">Coleção</Label>
              {canAddStructuralData && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onAddCollection}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Nova
                </Button>
              )}
            </div>
            <Select onValueChange={(value) => setProduct({ ...product, collection: value })} value={product.collection}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma coleção" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {collections.map((col) => (
                  <SelectItem key={col} value={col}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Tamanho</Label>
            <Select onValueChange={(value) => setProduct({ ...product, size: value })} value={product.size}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tamanho" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              value={product.quantity}
              onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
              placeholder="0"
            />
          </div>

          {/* Marca com opção de adicionar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="brand">Marca</Label>
              {canAddStructuralData && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onAddBrand}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Nova
                </Button>
              )}
            </div>
            <Select onValueChange={(value) => setProduct({ ...product, brand: value })} value={product.brand}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma marca" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fornecedor com opção de adicionar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="supplier">Fornecedor</Label>
              {canAddStructuralData && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onAddSupplier}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Novo
                </Button>
              )}
            </div>
            <Select onValueChange={(value) => setProduct({ ...product, supplier: value })} value={product.supplier}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um fornecedor" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-3 space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              placeholder="Descrição do produto"
            />
          </div>
          <div className="col-span-3 space-y-2">
            <Label htmlFor="barcode">Código de Barras</Label>
            <Input
              id="barcode"
              value={product.barcode}
              onChange={(e) => setProduct({ ...product, barcode: e.target.value })}
              placeholder="Deixe vazio para gerar automaticamente"
              className={!product.barcode ? 'border-orange-300 bg-orange-50' : ''}
            />
            {!product.barcode && (
              <p className="text-xs text-orange-600">⚠️ Código de barras deve ser único para cada produto</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave} className="bg-store-blue-600 hover:bg-store-blue-700">
            {title.includes('Adicionar') ? 'Adicionar Produto' : 'Salvar Alterações'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
