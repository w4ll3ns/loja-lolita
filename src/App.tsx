
import { BrowserRouter as Router, Navigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/components/ProtectedRoute';
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
    <SidebarProvider>
      <div className="flex h-screen antialiased text-gray-900 w-full">
        <AppSidebar />
        <MobileNavigation />
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Dashboard - apenas para admin */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Produtos - acessível para todos os perfis */}
            <Route path="/products" element={<ProductsPage />} />
            
            {/* Vendas - apenas admin e caixa */}
            <Route 
              path="/sales" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'caixa']}>
                  <SalesPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Minhas Vendas - vendedores e caixa */}
            <Route 
              path="/my-sales" 
              element={
                <ProtectedRoute allowedRoles={['vendedor', 'caixa']}>
                  <MySalesPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Clientes - admin, caixa e consultivo */}
            <Route 
              path="/customers" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'caixa', 'consultivo']}>
                  <CustomersPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Gerenciamento - apenas admin */}
            <Route 
              path="/management" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManagementIndexPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/management/categories" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CategoriesManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/management/colors" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ColorsManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/management/collections" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CollectionsManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/management/brands" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <BrandsManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/management/suppliers" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SuppliersManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/management/sizes" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SizesManagementPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Configurações - apenas admin */}
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings/store" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <StoreSettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings/users" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UsersSettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings/notifications" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <NotificationsSettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings/security" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SecuritySettingsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
}

function App() {
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <StoreProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <AppRoutes />
            <Toaster />
          </Router>
        </QueryClientProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
