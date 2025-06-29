
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, Store, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';

const StoreSettingsPage = () => {
  const navigate = useNavigate();
  const { storeSettings, updateStoreSettings } = useStore();
  const { toast } = useToast();
  const [storeData, setStoreData] = useState(storeSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sincronizar com o contexto quando as configurações mudarem
  useEffect(() => {
    setStoreData(storeSettings);
  }, [storeSettings]);

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!storeData.name.trim()) {
      newErrors.name = 'Nome da loja é obrigatório';
    }

    if (storeData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storeData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (storeData.phone && !/^[\d\s\(\)\-\+]+$/.test(storeData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos destacados em vermelho.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simular salvamento (em um cenário real, seria uma chamada à API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Salvar no contexto
      updateStoreSettings(storeData);
      
      toast({
        title: "✅ Configurações salvas com sucesso",
        description: "As informações da loja foram atualizadas.",
      });

      console.log('Configurações da loja salvas:', storeData);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Verifique sua conexão ou tente novamente.",
        variant: "destructive",
      });
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setStoreData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações da Loja</h1>
          <p className="text-muted-foreground">
            Configure as informações básicas da sua loja
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Nome da Loja *</Label>
              <Input
                id="storeName"
                value={storeData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Digite o nome da loja"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Textarea
                id="address"
                value={storeData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Endereço completo da loja"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={storeData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={storeData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contato@minhaloja.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={storeData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                placeholder="@minhaloja"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={storeData.facebook}
                onChange={(e) => handleInputChange('facebook', e.target.value)}
                placeholder="facebook.com/minhaloja"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logotipo</CardTitle>
            <CardDescription>Faça upload do logotipo da sua loja</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">Clique para fazer upload ou arraste a imagem aqui</p>
              <p className="text-xs text-gray-500">PNG, JPG até 2MB</p>
              <Button variant="outline" className="mt-4">
                Selecionar Arquivo
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horário de Funcionamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="hours">Horários</Label>
              <Textarea
                id="hours"
                value={storeData.hours}
                onChange={(e) => handleInputChange('hours', e.target.value)}
                placeholder="Segunda a Sexta: 9h às 18h&#10;Sábado: 9h às 15h&#10;Domingo: Fechado"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            className="w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoreSettingsPage;
