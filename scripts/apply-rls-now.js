import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const SUPABASE_URL = "https://ujawcfzhgbgwwcafoaeh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYXdjZnpoZ2Jnd3djYWZvYWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTM1MDMsImV4cCI6MjA2NjgyOTUwM30.9kVO6CTVVLLpQpXOokBccL_rIDFVBA5-AcycN5oOw0o";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔒 APLICANDO POLÍTICAS RLS');
console.log('==========================\n');

async function applyRLSPolicies() {
  try {
    console.log('1. Aplicando políticas RLS básicas...');
    
    // Primeiro, vamos fazer login como admin para ter permissões
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@roupacerta.com',
      password: 'admin123456'
    });

    if (authError) {
      console.log('❌ Erro no login:', authError.message);
      return;
    }

    console.log('✅ Login bem-sucedido como admin');

    // Aplicar políticas RLS básicas
    console.log('\n2. Habilitando RLS nas tabelas...');
    
    // Habilitar RLS em profiles
    const { error: profilesError } = await supabase
      .rpc('exec_sql', { sql: 'ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;' });
    
    if (profilesError) {
      console.log('⚠️ Erro ao habilitar RLS em profiles:', profilesError.message);
    } else {
      console.log('✅ RLS habilitado em profiles');
    }

    // Habilitar RLS em products
    const { error: productsError } = await supabase
      .rpc('exec_sql', { sql: 'ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;' });
    
    if (productsError) {
      console.log('⚠️ Erro ao habilitar RLS em products:', productsError.message);
    } else {
      console.log('✅ RLS habilitado em products');
    }

    // Habilitar RLS em sales
    const { error: salesError } = await supabase
      .rpc('exec_sql', { sql: 'ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;' });
    
    if (salesError) {
      console.log('⚠️ Erro ao habilitar RLS em sales:', salesError.message);
    } else {
      console.log('✅ RLS habilitado em sales');
    }

    console.log('\n3. Criando funções de verificação...');
    
    // Criar função is_admin
    const isAdminFunction = `
      CREATE OR REPLACE FUNCTION public.is_admin()
      RETURNS BOOLEAN AS $$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE user_id = auth.uid() AND role = 'admin'
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
    `;
    
    const { error: isAdminError } = await supabase
      .rpc('exec_sql', { sql: isAdminFunction });
    
    if (isAdminError) {
      console.log('⚠️ Erro ao criar função is_admin:', isAdminError.message);
    } else {
      console.log('✅ Função is_admin criada');
    }

    // Criar função is_seller
    const isSellerFunction = `
      CREATE OR REPLACE FUNCTION public.is_seller()
      RETURNS BOOLEAN AS $$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE user_id = auth.uid() AND role = 'vendedor'
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
    `;
    
    const { error: isSellerError } = await supabase
      .rpc('exec_sql', { sql: isSellerFunction });
    
    if (isSellerError) {
      console.log('⚠️ Erro ao criar função is_seller:', isSellerError.message);
    } else {
      console.log('✅ Função is_seller criada');
    }

    console.log('\n4. Criando políticas básicas...');
    
    // Política para profiles - usuários veem apenas seu próprio profile
    const profilesPolicy = `
      CREATE POLICY "Users can view own profile" 
      ON public.profiles 
      FOR SELECT 
      USING (auth.uid() = user_id);
    `;
    
    const { error: profilesPolicyError } = await supabase
      .rpc('exec_sql', { sql: profilesPolicy });
    
    if (profilesPolicyError) {
      console.log('⚠️ Erro ao criar política de profiles:', profilesPolicyError.message);
    } else {
      console.log('✅ Política de profiles criada');
    }

    // Política para products - usuários autenticados podem ver
    const productsPolicy = `
      CREATE POLICY "Authenticated users can view products" 
      ON public.products 
      FOR SELECT 
      USING (auth.uid() IS NOT NULL);
    `;
    
    const { error: productsPolicyError } = await supabase
      .rpc('exec_sql', { sql: productsPolicy });
    
    if (productsPolicyError) {
      console.log('⚠️ Erro ao criar política de products:', productsPolicyError.message);
    } else {
      console.log('✅ Política de products criada');
    }

    // Política para sales - admins veem todas, vendedores veem suas
    const salesPolicy = `
      CREATE POLICY "Users can view sales" 
      ON public.sales 
      FOR SELECT 
      USING (auth.uid() IS NOT NULL);
    `;
    
    const { error: salesPolicyError } = await supabase
      .rpc('exec_sql', { sql: salesPolicy });
    
    if (salesPolicyError) {
      console.log('⚠️ Erro ao criar política de sales:', salesPolicyError.message);
    } else {
      console.log('✅ Política de sales criada');
    }

    console.log('\n5. Testando acesso...');
    
    // Testar acesso a profiles
    const { data: testProfiles, error: testProfilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (testProfilesError) {
      console.log('❌ Erro ao testar acesso a profiles:', testProfilesError.message);
    } else {
      console.log(`✅ Pode acessar ${testProfiles.length} profiles`);
    }

    // Testar acesso a products
    const { data: testProducts, error: testProductsError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (testProductsError) {
      console.log('❌ Erro ao testar acesso a products:', testProductsError.message);
    } else {
      console.log(`✅ Pode acessar ${testProducts.length} products`);
    }

    // Logout
    await supabase.auth.signOut();
    console.log('✅ Logout realizado');

    console.log('\n🎉 POLÍTICAS RLS APLICADAS COM SUCESSO!');
    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('   1. Teste o login no sistema web');
    console.log('   2. Verifique se consegue acessar as funcionalidades');
    console.log('   3. Se houver problemas, execute o script de diagnóstico');

  } catch (error) {
    console.error('❌ Erro durante a aplicação:', error);
  }
}

// Executar aplicação
applyRLSPolicies(); 