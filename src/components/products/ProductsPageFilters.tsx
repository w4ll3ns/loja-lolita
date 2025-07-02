
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ProductsPageFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const ProductsPageFilters: React.FC<ProductsPageFiltersProps> = ({
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Buscar produtos por nome, categoria ou código de barras..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 text-sm"
      />
    </div>
  );
};
