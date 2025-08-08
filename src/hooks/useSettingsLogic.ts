
import { StoreSettings, NotificationSettings, SecuritySettings, RoleSettings } from '@/types/store';

export const useSettingsLogic = (state: {
  storeSettings: StoreSettings;
  setStoreSettings: (fn: (prev: StoreSettings) => StoreSettings) => void;
  notificationSettings: NotificationSettings;
  setNotificationSettings: (fn: (prev: NotificationSettings) => NotificationSettings) => void;
  securitySettings: SecuritySettings;
  setSecuritySettings: (fn: (prev: SecuritySettings) => SecuritySettings) => void;
  roleSettings: RoleSettings;
  setRoleSettings: (fn: (prev: RoleSettings) => RoleSettings) => void;
  importedXmlHashes: string[];
  setImportedXmlHashes: (fn: (prev: string[]) => string[]) => void;
}) => {
  const {
    storeSettings, setStoreSettings,
    notificationSettings, setNotificationSettings,
    securitySettings, setSecuritySettings,
    roleSettings, setRoleSettings,
    importedXmlHashes, setImportedXmlHashes
  } = state;

  const updateStoreSettings = (settings: Partial<StoreSettings>) => {
    setStoreSettings(prev => ({ ...prev, ...settings }));
  };

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }));
  };

  const updateSecuritySettings = (settings: Partial<SecuritySettings>) => {
    setSecuritySettings(prev => ({ ...prev, ...settings }));
  };

  const updateRoleSettings = (settings: RoleSettings) => {
    setRoleSettings(() => settings);
  };

  const isXmlAlreadyImported = (xmlHash: string): boolean => {
    return importedXmlHashes.includes(xmlHash);
  };

  const markXmlAsImported = (xmlHash: string) => {
    setImportedXmlHashes(prev => [...prev, xmlHash]);
  };

  return {
    updateStoreSettings,
    updateNotificationSettings,
    updateSecuritySettings,
    updateRoleSettings,
    isXmlAlreadyImported,
    markXmlAsImported
  };
};
