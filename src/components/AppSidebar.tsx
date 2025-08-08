
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  ShoppingBag, 
  BarChart3, 
  Settings,
  Database,
  LogOut,
  Trophy,
  ArrowLeftRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin']
  },
  {
    title: 'Produtos',
    url: '/products',
    icon: ShoppingCart,
    roles: ['admin', 'vendedor', 'caixa', 'consultivo']
  },
  {
    title: 'Vendas',
    url: '/sales',
    icon: ShoppingBag,
    roles: ['admin', 'caixa']
  },
  {
    title: 'Minhas Vendas',
    url: '/my-sales',
    icon: BarChart3,
    roles: ['vendedor', 'caixa']
  },
  {
    title: 'Relatórios de Vendedores',
    url: '/sellers-reports',
    icon: Trophy,
    roles: ['admin']
  },
  {
    title: 'Devoluções',
    url: '/returns',
    icon: ArrowLeftRight,
    roles: ['admin', 'caixa']
  },
  {
    title: 'Clientes',
    url: '/customers',
    icon: Users,
    roles: ['admin', 'caixa', 'consultivo']
  },
  {
    title: 'Gerenciamento',
    url: '/management',
    icon: Database,
    roles: ['admin']
  },
  {
    title: 'Configurações',
    url: '/settings',
    icon: Settings,
    roles: ['admin']
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isCollapsed = state === 'collapsed';
  
  const isActive = (path: string) => {
    if (path === '/management') {
      return location.pathname.startsWith('/management');
    }
    return location.pathname === path;
  };

  const filteredItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar className={cn("border-r", isCollapsed ? "w-14" : "w-60")} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navegação Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive: navIsActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-gray-900",
                          (navIsActive || isActive(item.url)) && "bg-gray-100 text-gray-900 font-medium"
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span>Sair</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
