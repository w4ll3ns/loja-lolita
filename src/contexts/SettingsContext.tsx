import React, { createContext, useContext, ReactNode } from 'react';
import { StoreSettings, NotificationSettings, SecuritySettings, RoleSettings } from '@/types/store';
import { useSettingsLogic } from '@/hooks/useSettingsLogic';
import { useSupabaseStore } from '@/hooks/useSupabaseStore';

interface SettingsContextType {
  // Data
  storeSettings: StoreSettings | null;
  notificationSettings: NotificationSettings | null;
  securitySettings: SecuritySettings | null;
  roleSettings: RoleSettings | null;
  
  // Operations
  updateStoreSettings: (settings: StoreSettings) => void;
  updateNotificationSettings: (settings: NotificationSettings) => void;
  updateSecuritySettings: (settings: SecuritySettings) => void;
  updateRoleSettings: (settings: RoleSettings) => void;
  
  // XML Import operations
  isXmlAlreadyImported: (hash: string) => boolean;
  markXmlAsImported: (hash: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const supabaseStore = useSupabaseStore();
  const settingsLogic = useSettingsLogic({
    storeSettings: supabaseStore.storeSettings,
    setStoreSettings: supabaseStore.setStoreSettings,
    notificationSettings: supabaseStore.notificationSettings,
    setNotificationSettings: supabaseStore.setNotificationSettings,
    securitySettings: supabaseStore.securitySettings,
    setSecuritySettings: supabaseStore.setSecuritySettings,
    roleSettings: null,
    setRoleSettings: () => {},
    importedXmlHashes: supabaseStore.importedXmlHashes,
    setImportedXmlHashes: supabaseStore.setImportedXmlHashes
  });

  const contextValue: SettingsContextType = {
    // Data
    storeSettings: supabaseStore.storeSettings,
    notificationSettings: supabaseStore.notificationSettings,
    securitySettings: supabaseStore.securitySettings,
    roleSettings: null,
    
    // Operations from logic hooks
    ...settingsLogic,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

