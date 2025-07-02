
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  // Redirecionar baseado no perfil do usuário
  if (!user) {
    return <Navigate to="/products" replace />;
  }

  switch (user.role) {
    case 'admin':
    case 'caixa':
    case 'consultivo':
      return <Navigate to="/dashboard" replace />;
    case 'vendedor':
      return <Navigate to="/products" replace />;
    default:
      return <Navigate to="/products" replace />;
  }
};

export default Index;
