
import { NavLink, useLocation } from "react-router-dom";
import { 
  ShoppingCart, 
  Package, 
  LayoutDashboard, 
  Users, 
  Settings,
  BarChart3,
  FileText
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;

  const getMenuItems = () => {
    if (user?.role === 'admin') {
      return [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, emoji: "📊" },
        { title: "Vendas", url: "/sales", icon: ShoppingCart, emoji: "🛒" },
        { title: "Estoque", url: "/products", icon: Package, emoji: "📦" },
        { title: "Clientes", url: "/customers", icon: Users, emoji: "👤" },
        { title: "Mais", url: "/settings", icon: Settings, emoji: "⚙️" },
      ];
    }

    if (user?.role === 'vendedor') {
      return [
        { title: "Estoque", url: "/products", icon: Package, emoji: "📦" },
        { title: "Minhas Vendas", url: "/my-sales", icon: FileText, emoji: "💼" },
      ];
    }

    if (user?.role === 'caixa') {
      return [
        { title: "Vendas", url: "/sales", icon: ShoppingCart, emoji: "🛒" },
        { title: "Estoque", url: "/products", icon: Package, emoji: "📦" },
        { title: "Minhas Vendas", url: "/my-sales", icon: FileText, emoji: "💼" },
        { title: "Clientes", url: "/customers", icon: Users, emoji: "👤" },
      ];
    }

    if (user?.role === 'consultivo') {
      return [
        { title: "Estoque", url: "/products", icon: Package, emoji: "📦" },
        { title: "Clientes", url: "/customers", icon: Users, emoji: "👤" },
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {menuItems.map((item) => {
          const isActive = currentPath === item.url;
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full min-w-0 transition-colors duration-200",
                "active:bg-gray-100 touch-manipulation",
                isActive 
                  ? "text-store-blue-600" 
                  : "text-gray-600 hover:text-store-blue-500"
              )}
            >
              <item.icon 
                className={cn(
                  "h-5 w-5 mb-1 transition-colors",
                  isActive ? "text-store-blue-600" : "text-gray-600"
                )} 
              />
              <span 
                className={cn(
                  "text-xs font-medium truncate transition-colors",
                  isActive ? "text-store-blue-600" : "text-gray-600"
                )}
              >
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
