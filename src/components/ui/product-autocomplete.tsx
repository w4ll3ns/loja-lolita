
import React, { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { Product } from '@/contexts/StoreContext';
import { Badge } from './badge';
import { AlertTriangle, Plus } from 'lucide-react';

interface ProductAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  products: Product[];
  placeholder?: string;
  className?: string;
  onProductSelect?: (product: Product) => void;
  onCreateTemporary?: (barcode: string, price: number) => void;
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
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [tempPrice, setTempPrice] = useState('');
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
      setShowManualEntry(false);
    }
  }, [value, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowManualEntry(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowManualEntry(false);
  };

  const handleProductClick = (product: Product) => {
    onChange('');
    onProductSelect?.(product);
    setIsOpen(false);
  };

  const handleShowManualEntry = () => {
    setShowManualEntry(true);
    setTempPrice('');
  };

  const handleCreateTemporary = () => {
    const price = parseFloat(tempPrice);
    if (value.length >= 8 && price > 0) {
      onCreateTemporary?.(value, price);
      onChange('');
      setIsOpen(false);
      setShowManualEntry(false);
      setTempPrice('');
    }
  };

  const showCreateOption = value.length >= 8 && filteredProducts.length === 0;

  // Função para calcular estoque real
  const getRealStock = (product: Product) => {
    const baseStock = product.quantity || 0;
    const negativeStock = product.negative_stock || 0;
    return baseStock - negativeStock;
  };

  // Função para obter a cor do badge de estoque
  const getStockBadgeVariant = (product: Product) => {
    const realStock = getRealStock(product);
    if (realStock < 0) return 'destructive';
    if (realStock <= 3) return 'secondary';
    return 'outline';
  };

  // Função para obter o texto do estoque
  const getStockText = (product: Product) => {
    const realStock = getRealStock(product);
    if (realStock < 0) {
      return `Estoque: ${realStock} (neg: ${product.negative_stock})`;
    }
    return `Estoque: ${realStock}`;
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={cn("font-mono", className)}
      />
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
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
                    <Badge variant={getStockBadgeVariant(product)} className="text-xs">
                      {getStockText(product)}
                    </Badge>
                    {product.category === 'Temporário' && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Incompleto
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">R$ {product.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
          
          {showCreateOption && !showManualEntry && (
            <div
              className="p-3 bg-yellow-50 border-yellow-200 cursor-pointer hover:bg-yellow-100"
              onClick={handleShowManualEntry}
            >
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="font-medium text-sm text-yellow-800">
                    Adicionar produto não cadastrado
                  </p>
                  <p className="text-xs text-yellow-600">
                    Código: {value} - Informe o preço para adicionar à venda
                  </p>
                </div>
              </div>
            </div>
          )}

          {showManualEntry && (
            <div className="p-3 bg-orange-50 border-orange-200">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="h-4 w-4" />
                  <p className="font-medium text-sm">Produto não cadastrado</p>
                </div>
                <div>
                  <p className="text-xs text-orange-600 mb-2">
                    Código: <span className="font-mono font-bold">{value}</span>
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Preço (R$)"
                      value={tempPrice}
                      onChange={(e) => setTempPrice(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <Button
                      onClick={handleCreateTemporary}
                      disabled={!tempPrice || parseFloat(tempPrice) <= 0}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Adicionar à Venda
                    </Button>
                  </div>
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
