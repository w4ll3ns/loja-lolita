import { BrowserRouter as Router, Navigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { StoreProvider } from '@/contexts/StoreContext';
import LoginPage from '@/components/LoginPage';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import ProductsPage from '@/pages/ProductsPage';
import SalesPage from '@/pages/SalesPage';
import MySalesPage from '@/pages/MySalesPage';
import CustomersPage from '@/pages/CustomersPage';
import ManagementIndexPage from '@/pages/management/ManagementIndexPage';
import CategoriesManagementPage from '@/pages/management/CategoriesManagementPage';
import ColorsManagementPage from '@/pages/management/ColorsManagementPage';
import CollectionsManagementPage from '@/pages/management/CollectionsManagementPage';
import BrandsManagementPage from '@/pages/management/BrandsManagementPage';
import SuppliersManagementPage from '@/pages/management/SuppliersManagementPage';
import SizesManagementPage from '@/pages/management/SizesManagementPage';
import SettingsPage from '@/pages/SettingsPage';
import StoreSettingsPage from '@/pages/settings/StoreSettingsPage';
import UsersSettingsPage from '@/pages/settings/UsersSettingsPage';
import NotificationsSettingsPage from '@/pages/settings/NotificationsSettingsPage';
import SecuritySettingsPage from '@/pages/settings/SecuritySettingsPage';
import NotFound from '@/pages/NotFound';
import './App.css';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/sales" element={<SalesPage />} />
      <Route path="/my-sales" element={<MySalesPage />} />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/management" element={<ManagementIndexPage />} />
      <Route path="/management/categories" element={<CategoriesManagementPage />} />
      <Route path="/management/colors" element={<ColorsManagementPage />} />
      <Route path="/management/collections" element={<CollectionsManagementPage />} />
      <Route path="/management/brands" element={<BrandsManagementPage />} />
      <Route path="/management/suppliers" element={<SuppliersManagementPage />} />
      <Route path="/management/sizes" element={<SizesManagementPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/settings/store" element={<StoreSettingsPage />} />
      <Route path="/settings/users" element={<UsersSettingsPage />} />
      <Route path="/settings/notifications" element={<NotificationsSettingsPage />} />
      <Route path="/settings/security" element={<SecuritySettingsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <StoreProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <SidebarProvider>
              <div className="flex h-screen antialiased text-gray-900">
                <AppSidebar />
                <MobileNavigation />
                <main className="flex-1 p-4">
                  <AppRoutes />
                </main>
              </div>
            </SidebarProvider>
            <Toaster />
          </Router>
        </QueryClientProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
