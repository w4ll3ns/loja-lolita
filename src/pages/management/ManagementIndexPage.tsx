
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { Tag, Palette, Layers, Award, Truck, Ruler } from 'lucide-react';

const ManagementIndexPage = () => {
  const navigate = useNavigate();
  const { categories, colors, collections, brands, suppliers, sizes } = useStore();

  const managementItems = [
    {
      title: 'Categorias',
      description: 'Gerencie as categorias de produtos',
      icon: Tag,
      count: categories.length,
      path: '/management/categories',
      color: 'bg-blue-500'
    },
    {
      title: 'Cores',
      description: 'Gerencie as cores dos produtos',
      icon: Palette,
      count: colors.length,
      path: '/management/colors',
      color: 'bg-purple-500'
    },
    {
      title: 'Coleções',
      description: 'Gerencie as coleções de produtos',
      icon: Layers,
      count: collections.length,
      path: '/management/collections',
      color: 'bg-green-500'
    },
    {
      title: 'Marcas',
      description: 'Gerencie as marcas dos produtos',
      icon: Award,
      count: brands.length,
      path: '/management/brands',
      color: 'bg-orange-500'
    },
    {
      title: 'Fornecedores',
      description: 'Gerencie os fornecedores',
      icon: Truck,
      count: suppliers.length,
      path: '/management/suppliers',
      color: 'bg-red-500'
    },
    {
      title: 'Tamanhos',
      description: 'Gerencie os tamanhos dos produtos',
      icon: Ruler,
      count: sizes.length,
      path: '/management/sizes',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento</h1>
        <p className="text-gray-600">Gerencie os dados estruturais do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Card key={item.path} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${item.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-600">{item.count}</span>
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate(item.path)}
                  className="w-full bg-store-blue-600 hover:bg-store-blue-700"
                >
                  Gerenciar {item.title}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ManagementIndexPage;
