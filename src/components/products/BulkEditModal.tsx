
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/contexts/StoreContext';

interface BulkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: Product[];
  onBulkUpdate: (updates: Partial<Product>) => void;
  categories: string[];
  suppliers: string[];
  sizes: string[];
  genders: string[];
}

export const BulkEditModal: React.FC<BulkEditModalProps> = ({
  isOpen,
  onClose,
  selectedProducts,
  onBulkUpdate,
  categories,
  suppliers,
  sizes,
  genders
}) => {
  const { toast } = useToast();
  const [updates, setUpdates] = useState({
    category: '',
    supplier: '',
    price: '',
    costPrice: '',
    gender: '' as 'Masculino' | 'Feminino' | 'Unissex' | '',
    size: ''
  });

  const [fieldsToUpdate, setFieldsToUpdate] = useState({
    category: false,
    supplier: false,
    price: false,
    costPrice: false,
    gender: false,
    size: false
  });

  const handleFieldToggle = (field: keyof typeof fieldsToUpdate) => {
    setFieldsToUpdate(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleUpdateChange = (field: keyof typeof updates, value: string) => {
    setUpdates(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBulkUpdate = () => {
    const finalUpdates: Partial<Product> = {};
    
    Object.entries(fieldsToUpdate).forEach(([field, shouldUpdate]) => {
      if (shouldUpdate) {
        const value = updates[field as keyof typeof updates];
        if (value) {
          if (field === 'price' || field === 'costPrice') {
            (finalUpdates as any)[field] = parseFloat(value);
          } else {
            (finalUpdates as any)[field] = value;
          }
        }
      }
    });

    if (Object.keys(finalUpdates).length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um campo para atualizar",
        variant: "destructive",
      });
      return;
    }

    onBulkUpdate(finalUpdates);
    
    toast({
      title: "Sucesso",
      description: `${selectedProducts.length} produtos atualizados com sucesso!`,
    });

    handleClose();
  };

  const handleClose = () => {
    setUpdates({
      category: '',
      supplier: '',
      price: '',
      costPrice: '',
      gender: '',
      size: ''
    });
    setFieldsToUpdate({
      category: false,
      supplier: false,
      price: false,
      costPrice: false,
      gender: false,
      size: false
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Edição em Lote ({selectedProducts.length} produtos selecionados)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Categoria */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="category"
              checked={fieldsToUpdate.category}
              onCheckedChange={() => handleFieldToggle('category')}
            />
            <div className="flex-1">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={updates.category}
                onValueChange={(value) => handleUpdateChange('category', value)}
                disabled={!fieldsToUpdate.category}
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
          </div>

          {/* Fornecedor */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="supplier"
              checked={fieldsToUpdate.supplier}
              onCheckedChange={() => handleFieldToggle('supplier')}
            />
            <div className="flex-1">
              <Label htmlFor="supplier">Fornecedor</Label>
              <Select
                value={updates.supplier}
                onValueChange={(value) => handleUpdateChange('supplier', value)}
                disabled={!fieldsToUpdate.supplier}
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
          </div>

          {/* Preço de Venda */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="price"
              checked={fieldsToUpdate.price}
              onCheckedChange={() => handleFieldToggle('price')}
            />
            <div className="flex-1">
              <Label htmlFor="price">Preço de Venda</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={updates.price}
                onChange={(e) => handleUpdateChange('price', e.target.value)}
                disabled={!fieldsToUpdate.price}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Preço de Custo */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="costPrice"
              checked={fieldsToUpdate.costPrice}
              onCheckedChange={() => handleFieldToggle('costPrice')}
            />
            <div className="flex-1">
              <Label htmlFor="costPrice">Preço de Custo</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                value={updates.costPrice}
                onChange={(e) => handleUpdateChange('costPrice', e.target.value)}
                disabled={!fieldsToUpdate.costPrice}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Gênero */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="gender"
              checked={fieldsToUpdate.gender}
              onCheckedChange={() => handleFieldToggle('gender')}
            />
            <div className="flex-1">
              <Label htmlFor="gender">Gênero</Label>
              <Select
                value={updates.gender}
                onValueChange={(value) => handleUpdateChange('gender', value)}
                disabled={!fieldsToUpdate.gender}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um gênero" />
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
          </div>

          {/* Tamanho */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="size"
              checked={fieldsToUpdate.size}
              onCheckedChange={() => handleFieldToggle('size')}
            />
            <div className="flex-1">
              <Label htmlFor="size">Tamanho</Label>
              <Select
                value={updates.size}
                onValueChange={(value) => handleUpdateChange('size', value)}
                disabled={!fieldsToUpdate.size}
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
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleBulkUpdate}>
            Aplicar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
