
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, UserPlus } from 'lucide-react';
import SignupPage from './SignupPage';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { success, error } = await login(email, password);
    
    if (!success) {
      toast({
        title: "Erro no login",
        description: error || "Email ou senha incorretos",
        variant: "destructive",
      });
    }
  };

  if (showSignup) {
    return <SignupPage onBackToLogin={() => setShowSignup(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-store-blue-50 to-store-green-50 px-4 py-8">
      <Card className="w-full max-w-md min-w-[320px] sm:min-w-[400px] animate-fade-in shadow-lg">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto p-3 bg-store-blue-100 rounded-full w-fit">
            <ShoppingCart className="h-10 w-10 text-store-blue-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold gradient-bg bg-clip-text text-transparent">
              Sistema de Vendas
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-muted-foreground">
              Faça login para acessar o sistema
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base"
                autoComplete="current-password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-store-blue-600 hover:bg-store-blue-700 text-base font-medium transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          
          <Button
            variant="outline"
            onClick={() => setShowSignup(true)}
            className="w-full h-12 text-base font-medium"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Criar Nova Conta
          </Button>
          
          <div className="p-4 bg-muted/50 rounded-lg border border-muted">
            <p className="font-semibold mb-2 text-sm">Para testar o sistema:</p>
            <p className="text-xs text-muted-foreground">
              Crie uma conta ou use: <strong>wallen.santiago@live.com</strong> com senha <strong>123456</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
