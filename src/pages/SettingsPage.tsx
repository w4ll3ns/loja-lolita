
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Store, Users, Bell, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();

  const settingsOptions = [
    {
      title: 'Loja',
      description: 'Configurações gerais da loja',
      icon: Store,
      path: '/settings/store',
      content: 'Configure informações básicas da loja, como nome, endereço e contato.'
    },
    {
      title: 'Usuários',
      description: 'Gerenciar usuários e permissões',
      icon: Users,
      path: '/settings/users',
      content: 'Adicione, edite ou remova usuários do sistema e configure suas permissões.'
    },
    {
      title: 'Notificações',
      description: 'Configurar alertas e notificações',
      icon: Bell,
      path: '/settings/notifications',
      content: 'Configure alertas de estoque baixo, vendas e outras notificações importantes.'
    },
    {
      title: 'Segurança',
      description: 'Configurações de segurança',
      icon: Shield,
      path: '/settings/security',
      content: 'Configure políticas de senha, autenticação e outras opções de segurança.'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Configure o sistema de acordo com suas necessidades
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {settingsOptions.map((option) => (
          <Card 
            key={option.title}
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:bg-accent/50"
            onClick={() => navigate(option.path)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <option.icon className="h-5 w-5" />
                {option.title}
              </CardTitle>
              <CardDescription>
                {option.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {option.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
