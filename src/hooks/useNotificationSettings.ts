import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  low_stock_alert: boolean;
  low_stock_quantity: number;
  thank_you_message: boolean;
  birthday_message: boolean;
  whatsapp_notifications: boolean;
  email_notifications: boolean;
  alert_frequency: 'realtime' | 'daily' | 'weekly';
  alert_time: string;
}

export const useNotificationSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    low_stock_alert: true,
    low_stock_quantity: 5,
    thank_you_message: true,
    birthday_message: false,
    whatsapp_notifications: true,
    email_notifications: false,
    alert_frequency: 'daily',
    alert_time: '09:00'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching notification settings:', error);
        return;
      }

      if (data) {
        setSettings({
          low_stock_alert: data.low_stock_alert,
          low_stock_quantity: data.low_stock_quantity,
          thank_you_message: data.thank_you_message,
          birthday_message: data.birthday_message,
          whatsapp_notifications: data.whatsapp_notifications,
          email_notifications: data.email_notifications,
          alert_frequency: data.alert_frequency,
          alert_time: data.alert_time
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Validations
      if (settings.low_stock_quantity < 0) {
        toast({
          title: "Erro de validação",
          description: "A quantidade mínima de estoque não pode ser negativa",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Verificar se já existe configuração
      const { data: existingData } = await supabase
        .from('notification_settings')
        .select('id')
        .single();

      let result;
      if (existingData) {
        // Atualizar
        result = await supabase
          .from('notification_settings')
          .update(settings)
          .eq('id', existingData.id);
      } else {
        // Inserir
        result = await supabase
          .from('notification_settings')
          .insert(settings);
      }

      if (result.error) {
        toast({
          title: "Erro ao salvar",
          description: result.error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "✅ Configurações salvas",
        description: "As configurações de notificações foram atualizadas no banco de dados.",
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast({
        title: "Erro ao salvar",
        description: "Erro interno ao salvar configurações",
        variant: "destructive",
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