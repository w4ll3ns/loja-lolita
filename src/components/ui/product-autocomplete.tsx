
import React, { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';
import { Product } from '@/contexts/StoreContext';
import { Badge } from './badge';

interface ProductAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  products: Product[];
  placeholder?: string;
  className?: string;
  onProductSelect?: (product: Product) => void;
  onCreateTemporary?: (barcode: string) => void;
}

export const ProductAutocomplete: React.FC<ProductAutocompleteProps> = ({
  value,
  onChange,
  products,
  placeholder,
  className,
  onProductSelect,
  onCreateTemporary
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && value.length >= 2) {
      const filtered = products.filter(product =>
        product.barcode.toLowerCase().includes(value.toLowerCase()) ||
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
      setIsOpen(filtered.length > 0 || value.length >= 8);
    } else {
      setFilteredProducts([]);
      setIsOpen(false);
    }
  }, [value, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleProductClick = (product: Product) => {
    onChange('');
    onProductSelect?.(product);
    setIsOpen(false);
  };

  const handleCreateTemporary = () => {
    if (value.length >= 8) {
      onCreateTemporary?.(value);
      onChange('');
      setIsOpen(false);
    }
  };

  const showCreateOption = value.length >= 8 && filteredProducts.length === 0;

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={cn("font-mono", className)}
      />
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              onClick={() => handleProductClick(product)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500 font-mono">{product.barcode}</p>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Estoque: {product.quantity}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">R$ {product.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
          
          {showCreateOption && (
            <div
              className="p-3 bg-yellow-50 border-yellow-200 cursor-pointer hover:bg-yellow-100"
              onClick={handleCreateTemporary}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm text-yellow-800">
                    Criar produto temporário
                  </p>
                  <p className="text-xs text-yellow-600">
                    Código: {value} - Produto será criado para edição posterior
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {value.length >= 2 && filteredProducts.length === 0 && !showCreateOption && (
            <div className="p-3 text-center text-gray-500 text-sm">
              Nenhum produto encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
};
