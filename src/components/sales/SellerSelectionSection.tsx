
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';

interface SellerSelectionSectionProps {
  selectedSeller: string;
  onSellerChange: (sellerId: string) => void;
}

export const SellerSelectionSection = ({
  selectedSeller,
  onSellerChange
}: SellerSelectionSectionProps) => {
  const { sellers, users } = useStore();
  
  // Combinar vendedores da lista de sellers com usuários que são vendedores ou caixa
  const sellerUsers = users.filter(user => user.role === 'vendedor' || user.role === 'caixa');
  const allSellers = [
    ...sellers.filter(s => s.active).map(s => ({ id: s.id, name: s.name })),
    ...sellerUsers.map(u => ({ id: u.id, name: u.name }))
  ];

  // Remover duplicatas baseado no nome
  const uniqueSellers = allSellers.filter((seller, index, self) => 
    index === self.findIndex(s => s.name === seller.name)
  );

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
