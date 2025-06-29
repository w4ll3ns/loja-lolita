
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { StockAlertsSection } from '@/components/settings/StockAlertsSection';
import { AutomaticMessagesSection } from '@/components/settings/AutomaticMessagesSection';
import { NotificationChannelsSection } from '@/components/settings/NotificationChannelsSection';
import { FrequencyTimingSection } from '@/components/settings/FrequencyTimingSection';

const NotificationsSettingsPage = () => {
  const navigate = useNavigate();
  const { settings, isLoading, handleSave, updateSetting } = useNotificationSettings();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações de Notificações</h1>
          <p className="text-muted-foreground">
            Configure alertas e automações do sistema
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <StockAlertsSection settings={settings} onSettingChange={updateSetting} />
        <AutomaticMessagesSection settings={settings} onSettingChange={updateSetting} />
        <NotificationChannelsSection settings={settings} onSettingChange={updateSetting} />
        <FrequencyTimingSection settings={settings} onSettingChange={updateSetting} />

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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

export default NotificationsSettingsPage;
