
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Search, Edit, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { QuickCustomerForm } from '@/components/sales/QuickCustomerForm';
import { useCustomers } from '@/contexts/CustomersContext';
import { useToast } from '@/hooks/use-toast';

const CustomersPage = () => {
  const { customers } = useCustomers();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar apenas clientes reais (não genéricos)
  const realCustomers = customers.filter(customer => !customer.isGeneric);

  // Filtrar clientes baseado no termo de busca
  const filteredCustomers = realCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.whatsapp.includes(searchTerm.replace(/\D/g, ''))
  );

  const handleCustomerCreated = (customer: any) => {
    setIsModalOpen(false);
    toast({
      title: "Sucesso",
      description: "Cliente cadastrado com sucesso ✅",
    });
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'M': return 'Masculino';
      case 'F': return 'Feminino';
      default: return 'Outro';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie todos os clientes cadastrados no sistema
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar clientes..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Clientes ({filteredCustomers.length})
            </CardTitle>
            <CardDescription>
              Visualize e gerencie todos os clientes cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                {realCustomers.length === 0 ? (
                  <>
                    <p>Nenhum cliente cadastrado ainda.</p>
                    <p className="text-sm">Clique em "Novo Cliente" para começar.</p>
                  </>
                ) : (
                  <p>Nenhum cliente encontrado com o termo "{searchTerm}".</p>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredCustomers.map((customer) => (
                  <Card key={customer.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{customer.name}</h3>
                            <Badge variant="secondary">
                              {getGenderLabel(customer.gender)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {customer.whatsapp}
                            </div>
                            {customer.city && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {customer.city}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
          </DialogHeader>
          <QuickCustomerForm
            onClose={() => setIsModalOpen(false)}
            onCustomerCreated={handleCustomerCreated}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomersPage;
