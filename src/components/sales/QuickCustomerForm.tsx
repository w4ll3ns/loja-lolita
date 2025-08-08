
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomers } from '@/contexts/CustomersContext';
import { useToast } from '@/hooks/use-toast';
import { User, X } from 'lucide-react';

interface QuickCustomerFormProps {
  onClose: () => void;
  onCustomerCreated: (customer: any) => void;
  initialName?: string;
}

export const QuickCustomerForm = ({ onClose, onCustomerCreated, initialName = '' }: QuickCustomerFormProps) => {
  const { addCustomer } = useCustomers();
  const { toast } = useToast();
  
  const [customerData, setCustomerData] = useState({
    name: initialName,
    whatsapp: '',
    gender: 'M' as 'M' | 'F' | 'Outro',
    city: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerData.name || !customerData.whatsapp) {
      toast({
        title: "Erro",
        description: "Nome e WhatsApp são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newCustomer = { ...customerData, wantedToRegister: true };
    addCustomer(newCustomer);
    
    const customerWithId = { ...newCustomer, id: Date.now().toString() };
    onCustomerCreated(customerWithId);
    
    toast({
      title: "Sucesso",
      description: "Cliente cadastrado com sucesso!",
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Cadastro Rápido
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input
              placeholder="Nome completo"
              value={customerData.name}
              onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>WhatsApp *</Label>
            <MaskedInput
              mask="whatsapp"
              placeholder="(11) 99999-9999"
              value={customerData.whatsapp}
              onChange={(value) => setCustomerData({ ...customerData, whatsapp: value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Sexo</Label>
            <Select onValueChange={(value: 'M' | 'F' | 'Outro') => setCustomerData({ ...customerData, gender: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Feminino</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Cidade</Label>
            <Autocomplete
              placeholder="Digite a cidade"
              value={customerData.city}
              onChange={(value) => setCustomerData({ ...customerData, city: value })}
              suggestions={cities}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-store-green-600 hover:bg-store-green-700">
              Cadastrar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
