
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { QuickCustomerForm } from '@/components/sales/QuickCustomerForm';
import { Users, Plus } from 'lucide-react';

interface CustomerSelectionSectionProps {
  selectedCustomer: any;
  customerSearch: string;
  customerSuggestions: any[];
  onCustomerSearch: (query: string) => void;
  onSelectCustomer: (customer: any) => void;
  onCustomerNotWantRegister: () => void;
}

export const CustomerSelectionSection = ({
  selectedCustomer,
  customerSearch,
  customerSuggestions,
  onCustomerSearch,
  onSelectCustomer,
  onCustomerNotWantRegister
}: CustomerSelectionSectionProps) => {
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Users className="h-5 w-5" />
        Cliente
      </h3>
      
      <div className="space-y-2">
        <Label>Buscar Cliente</Label>
        <div className="relative">
          <Input
            placeholder="Nome ou WhatsApp..."
            value={customerSearch}
            onChange={(e) => onCustomerSearch(e.target.value)}
          />
          {customerSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
              {customerSuggestions.map((customer) => (
                <div
                  key={customer.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => onSelectCustomer(customer)}
                >
                  <p className="font-medium text-sm">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">{customer.whatsapp}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedCustomer && (
        <div className="p-3 bg-green-50 border border-green-200 rounded">
          <p className="font-medium text-green-800 text-sm">Cliente Selecionado:</p>
          <p className="text-green-700 text-sm">{selectedCustomer.name} - {selectedCustomer.whatsapp}</p>
        </div>
      )}

      <div className="flex gap-2">
        <Popover open={showCustomerForm} onOpenChange={setShowCustomerForm}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              <Plus className="h-4 w-4 mr-1" />
              Novo Cliente
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <QuickCustomerForm
              onClose={() => setShowCustomerForm(false)}
              onCustomerCreated={onSelectCustomer}
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onCustomerNotWantRegister}
          className="flex-1"
        >
          Não Quis Cadastrar
        </Button>
      </div>
    </div>
  );
};
