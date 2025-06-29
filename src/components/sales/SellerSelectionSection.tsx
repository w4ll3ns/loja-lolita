
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';

interface SellerSelectionSectionProps {
  selectedSeller: string;
  sellers: any[];
  onSellerChange: (sellerId: string) => void;
}

export const SellerSelectionSection = ({
  selectedSeller,
  sellers,
  onSellerChange
}: SellerSelectionSectionProps) => {
  const activeSellers = sellers.filter(s => s.active);

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
            {activeSellers.map((seller) => (
              <SelectItem key={seller.id} value={seller.id}>
                {seller.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
