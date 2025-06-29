
import { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';
import { NotificationSettings } from '@/types/store';

export const useNotificationSettings = () => {
  const { notificationSettings, updateNotificationSettings, getLowStockProducts } = useStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(notificationSettings);

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Validations
      if (settings.lowStockQuantity < 0) {
        toast({
          title: "Erro de validação",
          description: "A quantidade mínima para alerta deve ser maior ou igual a 0",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (!settings.alertTime || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(settings.alertTime)) {
        toast({
          title: "Erro de validação",
          description: "Por favor, insira um horário válido (HH:MM)",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateNotificationSettings(settings);
      
      toast({
        title: "✅ Configurações salvas",
        description: "As configurações de notificações foram atualizadas com sucesso",
      });

      // Show low stock alert if enabled
      if (settings.lowStockAlert) {
        const lowStockProducts = getLowStockProducts();
        if (lowStockProducts.length > 0) {
          toast({
            title: "⚠️ Produtos com estoque baixo",
            description: `${lowStockProducts.length} produto(s) com estoque abaixo de ${settings.lowStockQuantity}`,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    settings,
    isLoading,
    handleSave,
    updateSetting
  };
};
