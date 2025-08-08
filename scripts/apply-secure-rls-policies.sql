-- =====================================================
-- SCRIPT: Aplicar Políticas RLS Seguras
-- DESCRIÇÃO: Implementa políticas de segurança restritivas
-- DATA: $(date)
-- =====================================================

-- Remover políticas permissivas existentes
DROP POLICY IF EXISTS "Allow all operations" ON public.products;
DROP POLICY IF EXISTS "Allow all operations" ON public.customers;
DROP POLICY IF EXISTS "Allow all operations" ON public.sellers;
DROP POLICY IF EXISTS "Allow all operations" ON public.users;
DROP POLICY IF EXISTS "Allow all operations" ON public.sales;
DROP POLICY IF EXISTS "Allow all operations" ON public.sale_items;
DROP POLICY IF EXISTS "Allow all operations" ON public.delete_logs;
DROP POLICY IF EXISTS "Allow all operations" ON public.store_settings;
DROP POLICY IF EXISTS "Allow all operations" ON public.notification_settings;
DROP POLICY IF EXISTS "Allow all operations" ON public.security_settings;
DROP POLICY IF EXISTS "Allow all operations" ON public.role_permissions;
DROP POLICY IF EXISTS "Allow all operations" ON public.categories;
DROP POLICY IF EXISTS "Allow all operations" ON public.collections;
DROP POLICY IF EXISTS "Allow all operations" ON public.suppliers;
DROP POLICY IF EXISTS "Allow all operations" ON public.brands;
DROP POLICY IF EXISTS "Allow all operations" ON public.colors;
DROP POLICY IF EXISTS "Allow all operations" ON public.sizes;
DROP POLICY IF EXISTS "Allow all operations" ON public.cities;
DROP POLICY IF EXISTS "Allow all operations" ON public.imported_xml_hashes;

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
-- POLÍTICAS PARA PROFILES
-- =====================================================

-- Usuários podem ver apenas seu próprio profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Usuários podem atualizar apenas seu próprio profile
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
-- POLÍTICAS PARA PRODUTOS
-- =====================================================

-- Apenas usuários autenticados podem ver produtos
CREATE POLICY "Authenticated users can view products" 
ON public.products 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Apenas admins podem inserir produtos
CREATE POLICY "Admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (public.is_admin());

-- Apenas admins podem atualizar produtos
CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
USING (public.is_admin());

-- Apenas admins podem deletar produtos
CREATE POLICY "Admins can delete products" 
ON public.products 
FOR DELETE 
USING (public.is_admin());

-- =====================================================
-- POLÍTICAS PARA VENDAS
-- =====================================================

-- Admins podem ver todas as vendas
CREATE POLICY "Admins can view all sales" 
ON public.sales 
FOR SELECT 
USING (public.is_admin());

-- Vendedores podem ver apenas suas próprias vendas
CREATE POLICY "Sellers can view own sales" 
ON public.sales 
FOR SELECT 
USING (
  public.is_seller() AND 
  seller_id = auth.uid()
);

-- Admins podem inserir vendas
CREATE POLICY "Admins can insert sales" 
ON public.sales 
FOR INSERT 
WITH CHECK (public.is_admin());

-- Vendedores podem inserir vendas para si
CREATE POLICY "Sellers can insert own sales" 
ON public.sales 
FOR INSERT 
WITH CHECK (
  public.is_seller() AND 
  seller_id = auth.uid()
);

-- Admins podem atualizar vendas
CREATE POLICY "Admins can update sales" 
ON public.sales 
FOR UPDATE 
USING (public.is_admin());

-- Vendedores podem atualizar apenas suas vendas
CREATE POLICY "Sellers can update own sales" 
ON public.sales 
FOR UPDATE 
USING (
  public.is_seller() AND 
  seller_id = auth.uid()
);

-- =====================================================
-- POLÍTICAS PARA ITENS DE VENDA
-- =====================================================

-- Admins podem ver todos os itens
CREATE POLICY "Admins can view all sale items" 
ON public.sale_items 
FOR SELECT 
USING (public.is_admin());

-- Vendedores podem ver itens de suas vendas
CREATE POLICY "Sellers can view own sale items" 
ON public.sale_items 
FOR SELECT 
USING (
  public.is_seller() AND 
  EXISTS (
    SELECT 1 FROM public.sales 
    WHERE id = sale_items.sale_id AND seller_id = auth.uid()
  )
);

-- Admins podem inserir itens
CREATE POLICY "Admins can insert sale items" 
ON public.sale_items 
FOR INSERT 
WITH CHECK (public.is_admin());

-- Vendedores podem inserir itens em suas vendas
CREATE POLICY "Sellers can insert own sale items" 
ON public.sale_items 
FOR INSERT 
WITH CHECK (
  public.is_seller() AND 
  EXISTS (
    SELECT 1 FROM public.sales 
    WHERE id = sale_items.sale_id AND seller_id = auth.uid()
  )
);

-- =====================================================
-- POLÍTICAS PARA CLIENTES
-- =====================================================

-- Apenas usuários autenticados podem ver clientes
CREATE POLICY "Authenticated users can view customers" 
ON public.customers 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Apenas admins podem gerenciar clientes
CREATE POLICY "Admins can manage customers" 
ON public.customers 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =====================================================
-- POLÍTICAS PARA DADOS ESTRUTURAIS
-- =====================================================

-- Apenas admins podem gerenciar dados estruturais
CREATE POLICY "Admins can manage categories" 
ON public.categories 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage collections" 
ON public.collections 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage suppliers" 
ON public.suppliers 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage brands" 
ON public.brands 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage colors" 
ON public.colors 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage sizes" 
ON public.sizes 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =====================================================
-- POLÍTICAS PARA CONFIGURAÇÕES
-- =====================================================

-- Apenas admins podem gerenciar configurações
CREATE POLICY "Admins can manage store settings" 
ON public.store_settings 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage notification settings" 
ON public.notification_settings 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage security settings" 
ON public.security_settings 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =====================================================
-- POLÍTICAS PARA LOGS E AUDITORIA
-- =====================================================

-- Apenas admins podem ver logs
CREATE POLICY "Admins can view delete logs" 
ON public.delete_logs 
FOR SELECT 
USING (public.is_admin());

-- =====================================================
-- POLÍTICAS PARA RETURNS/DEVOLUÇÕES
-- =====================================================

-- Admins podem ver todas as devoluções
CREATE POLICY "Admins can view all returns" 
ON public.returns 
FOR SELECT 
USING (public.is_admin());

-- Vendedores podem ver devoluções de suas vendas
CREATE POLICY "Sellers can view own returns" 
ON public.returns 
FOR SELECT 
USING (
  public.is_seller() AND 
  EXISTS (
    SELECT 1 FROM public.sales 
    WHERE id = returns.sale_id AND seller_id = auth.uid()
  )
);

-- Admins podem gerenciar devoluções
CREATE POLICY "Admins can manage returns" 
ON public.returns 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Vendedores podem criar devoluções para suas vendas
CREATE POLICY "Sellers can create returns for own sales" 
ON public.returns 
FOR INSERT 
WITH CHECK (
  public.is_seller() AND 
  EXISTS (
    SELECT 1 FROM public.sales 
    WHERE id = returns.sale_id AND seller_id = auth.uid()
  )
);

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se todas as políticas foram criadas
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

-- Mensagem de conclusão
DO $$
BEGIN
  RAISE NOTICE '✅ Políticas RLS seguras aplicadas com sucesso!';
  RAISE NOTICE '📋 Resumo das políticas:';
  RAISE NOTICE '   - Profiles: Usuários veem apenas seus próprios, admins veem todos';
  RAISE NOTICE '   - Produtos: Apenas admins podem gerenciar';
  RAISE NOTICE '   - Vendas: Vendedores veem apenas suas vendas, admins veem todas';
  RAISE NOTICE '   - Clientes: Apenas admins podem gerenciar';
  RAISE NOTICE '   - Configurações: Apenas admins podem gerenciar';
  RAISE NOTICE '   - Logs: Apenas admins podem ver';
END $$; 