
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password);
    
    if (!success) {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-store-blue-50 to-store-green-50 p-4">
      <Card className="w-full max-w-sm sm:max-w-md animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto p-3 bg-store-blue-100 rounded-full w-fit">
            <ShoppingCart className="h-8 w-8 text-store-blue-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold gradient-bg bg-clip-text text-transparent">
              Sistema de Vendas
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Faça login para acessar o sistema
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
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
                className="h-11"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 bg-store-blue-600 hover:bg-store-blue-700 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          
          <div className="p-4 bg-muted/50 rounded-lg border">
            <p className="font-semibold mb-3 text-sm">Contas de teste:</p>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-medium text-muted-foreground">Admin:</span>
                <span className="font-mono">admin@loja.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-muted-foreground">Vendedor:</span>
                <span className="font-mono">vendedor@loja.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-muted-foreground">Caixa:</span>
                <span className="font-mono">caixa@loja.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-muted-foreground">Consultivo:</span>
                <span className="font-mono">consulta@loja.com</span>
              </div>
              <div className="mt-2 pt-2 border-t border-muted-foreground/20">
                <p className="text-center text-muted-foreground">
                  <span className="font-medium">Senha para todos:</span> 123456
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
