
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSales } from '@/contexts/SalesContext';

interface SellerSelectionSectionProps {
  selectedSeller: string;
  onSellerChange: (sellerId: string) => void;
}

export const SellerSelectionSection = ({
  selectedSeller,
  onSellerChange
}: SellerSelectionSectionProps) => {
  const { user } = useAuth();
  const { sellers } = useSales();
  
  // Usar apenas vendedores da tabela users (que agora são carregados como sellers)
  const uniqueSellers = (sellers || []).filter(s => s.active).map(s => ({ id: s.id, name: s.name }));

  // Debug logs
  console.log('SellerSelectionSection Debug:', {
    sellers: sellers,
    sellersLength: sellers?.length,
    user: user,
    uniqueSellers: uniqueSellers
  });

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <User className="h-5 w-5" />
        Vendedor
      </h3>
      
      <div className="space-y-2">
        <Label>Vendedor Responsável</Label>
        <Select onValueChange={onSellerChange} value={selectedSeller}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o vendedor" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {uniqueSellers.map((seller) => (
              <SelectItem key={seller.id} value={seller.name}>
                {seller.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
