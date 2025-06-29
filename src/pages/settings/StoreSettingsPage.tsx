
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StoreSettingsPage = () => {
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState({
    name: 'Minha Loja',
    address: '',
    phone: '',
    email: '',
    instagram: '',
    facebook: '',
    hours: ''
  });

  const handleSave = () => {
    // Implementar salvamento
    console.log('Salvando configurações da loja:', storeData);
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
                onChange={(e) => setStoreData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome da loja"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Textarea
                id="address"
                value={storeData.address}
                onChange={(e) => setStoreData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Endereço completo da loja"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={storeData.phone}
                  onChange={(e) => setStoreData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={storeData.email}
                  onChange={(e) => setStoreData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="contato@minhaloja.com"
                />
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
                onChange={(e) => setStoreData(prev => ({ ...prev, instagram: e.target.value }))}
                placeholder="@minhaloja"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={storeData.facebook}
                onChange={(e) => setStoreData(prev => ({ ...prev, facebook: e.target.value }))}
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
                onChange={(e) => setStoreData(prev => ({ ...prev, hours: e.target.value }))}
                placeholder="Segunda a Sexta: 9h às 18h&#10;Sábado: 9h às 15h&#10;Domingo: Fechado"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="w-full md:w-auto">
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoreSettingsPage;
