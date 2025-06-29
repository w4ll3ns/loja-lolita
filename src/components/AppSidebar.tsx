
import { useState } from "react";
import { 
  ShoppingCart, 
  Users, 
  Settings, 
  User,
  Search,
  File
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-store-blue-100 text-store-blue-700 font-medium" : "hover:bg-muted/50";

  // Definir itens de menu baseado no perfil do usuário
  const getMenuItems = () => {
    const baseItems = [
      { title: "Dashboard", url: "/dashboard", icon: Search },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { title: "Produtos", url: "/products", icon: ShoppingCart },
        { title: "Vendas", url: "/sales", icon: File },
        { title: "Clientes", url: "/customers", icon: Users },
        { title: "Configurações", url: "/settings", icon: Settings },
      ];
    }

    if (user?.role === 'vendedor') {
      return [
        ...baseItems,
        { title: "Produtos", url: "/products", icon: ShoppingCart },
        { title: "Minhas Vendas", url: "/my-sales", icon: File },
        { title: "Clientes", url: "/customers", icon: Users },
      ];
    }

    if (user?.role === 'caixa') {
      return [
        ...baseItems,
        { title: "Vendas", url: "/sales", icon: File },
        { title: "Produtos", url: "/products", icon: ShoppingCart },
        { title: "Clientes", url: "/customers", icon: Users },
      ];
    }

    if (user?.role === 'consultivo') {
      return [
        ...baseItems,
        { title: "Produtos", url: "/products", icon: ShoppingCart },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
      collapsible
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-store-blue-600 font-semibold">
            {!collapsed && "Sistema de Vendas"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="mt-auto p-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
