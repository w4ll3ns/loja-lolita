-- =====================================================
-- SCRIPT: Aplicar Políticas RLS Básicas
-- DESCRIÇÃO: Implementa políticas de segurança básicas
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delete_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Função para verificar se usuário é vendedor
CREATE OR REPLACE FUNCTION public.is_seller()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'vendedor'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =====================================================
-- POLÍTICAS BÁSICAS PARA PROFILES
-- =====================================================

-- Permitir que usuários vejam apenas seu próprio profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Permitir que usuários atualizem apenas seu próprio profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Permitir inserção durante signup
CREATE POLICY "Allow insert during signup" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Admins podem ver todos os profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin());

-- Admins podem atualizar todos os profiles
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.is_admin());

-- =====================================================
-- POLÍTICAS BÁSICAS PARA PRODUTOS
-- =====================================================

-- Usuários autenticados podem ver produtos
CREATE POLICY "Authenticated users can view products" 
ON public.products 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Apenas admins podem gerenciar produtos
CREATE POLICY "Admins can manage products" 
ON public.products 
FOR ALL 
USING (public.is_admin());

-- =====================================================
-- POLÍTICAS BÁSICAS PARA VENDAS
-- =====================================================

-- Vendedores veem apenas suas vendas
CREATE POLICY "Sellers can view own sales" 
ON public.sales 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    public.is_admin() OR 
    seller = (SELECT name FROM public.profiles WHERE user_id = auth.uid())
  )
);

-- Admins veem todas as vendas
CREATE POLICY "Admins can view all sales" 
ON public.sales 
FOR SELECT 
USING (public.is_admin());

-- Apenas admins podem gerenciar vendas
CREATE POLICY "Admins can manage sales" 
ON public.sales 
FOR ALL 
USING (public.is_admin());

-- =====================================================
-- POLÍTICAS BÁSICAS PARA CLIENTES
-- =====================================================

-- Usuários autenticados podem ver clientes
CREATE POLICY "Authenticated users can view customers" 
ON public.customers 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Apenas admins podem gerenciar clientes
CREATE POLICY "Admins can manage customers" 
ON public.customers 
FOR ALL 
USING (public.is_admin());

-- =====================================================
-- POLÍTICAS BÁSICAS PARA CONFIGURAÇÕES
-- =====================================================

-- Apenas admins podem gerenciar configurações
CREATE POLICY "Admins can manage settings" 
ON public.store_settings 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can manage notification settings" 
ON public.notification_settings 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can manage security settings" 
ON public.security_settings 
FOR ALL 
USING (public.is_admin());

-- =====================================================
-- POLÍTICAS BÁSICAS PARA DADOS ESTRUTURAIS
-- =====================================================

-- Apenas admins podem gerenciar dados estruturais
CREATE POLICY "Admins can manage categories" 
ON public.categories 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can manage collections" 
ON public.collections 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can manage suppliers" 
ON public.suppliers 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can manage brands" 
ON public.brands 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can manage colors" 
ON public.colors 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can manage sizes" 
ON public.sizes 
FOR ALL 
USING (public.is_admin());

-- =====================================================
-- POLÍTICAS BÁSICAS PARA LOGS E DEVOLUÇÕES
-- =====================================================

-- Apenas admins podem ver logs
CREATE POLICY "Admins can view logs" 
ON public.delete_logs 
FOR SELECT 
USING (public.is_admin());

-- Políticas para devoluções
CREATE POLICY "Authenticated users can view returns" 
ON public.returns 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage returns" 
ON public.returns 
FOR ALL 
USING (public.is_admin());

-- =====================================================
-- MENSAGEM DE CONFIRMAÇÃO
-- =====================================================

-- Verificar se as políticas foram aplicadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname; 