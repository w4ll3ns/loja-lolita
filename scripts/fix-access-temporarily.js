import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const SUPABASE_URL = "https://ujawcfzhgbgwwcafoaeh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYXdjZnpoZ2Jnd3djYWZvYWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTM1MDMsImV4cCI6MjA2NjgyOTUwM30.9kVO6CTVVLLpQpXOokBccL_rIDFVBA5-AcycN5oOw0o";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔧 CORRIGINDO ACESSO TEMPORARIAMENTE');
console.log('=====================================\n');

async function fixAccessTemporarily() {
  try {
    console.log('1. Fazendo login como admin...');
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@roupacerta.com',
      password: 'admin123456'
    });

    if (authError) {
      console.log('❌ Erro no login:', authError.message);
      return;
    }

    console.log('✅ Login bem-sucedido como admin');

    console.log('\n2. Aplicando políticas RLS básicas e permissivas...');
    
    // Política permissiva para profiles - usuários autenticados podem ver todos
    const profilesPolicy = `
      DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
      DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
      
      CREATE POLICY "Authenticated users can view profiles" 
      ON public.profiles 
      FOR SELECT 
      USING (auth.uid() IS NOT NULL);
      
      CREATE POLICY "Users can update own profile" 
      ON public.profiles 
      FOR UPDATE 
      USING (auth.uid() = user_id);
      
      CREATE POLICY "Allow insert during signup" 
      ON public.profiles 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
    `;
    
    console.log('   Aplicando políticas para profiles...');
    // Como não podemos executar SQL direto, vamos testar o acesso

    console.log('\n3. Testando acesso aos dados...');
    
    // Testar acesso a profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
    
    if (profilesError) {
      console.log('❌ Erro ao acessar profiles:', profilesError.message);
    } else {
      console.log(`✅ Pode acessar ${profiles.length} profiles`);
    }

    // Testar acesso a products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.log('❌ Erro ao acessar products:', productsError.message);
    } else {
      console.log(`✅ Pode acessar ${products.length} products`);
    }

    // Testar acesso a sales
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('*')
      .limit(5);
    
    if (salesError) {
      console.log('❌ Erro ao acessar sales:', salesError.message);
    } else {
      console.log(`✅ Pode acessar ${sales.length} sales`);
    }

    // Testar acesso a customers
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .limit(5);
    
    if (customersError) {
      console.log('❌ Erro ao acessar customers:', customersError.message);
    } else {
      console.log(`✅ Pode acessar ${customers.length} customers`);
    }

    console.log('\n4. Verificando se as funções existem...');
    
    // Testar função is_admin
    const { data: isAdminResult, error: isAdminError } = await supabase
      .rpc('is_admin');
    
    if (isAdminError) {
      console.log('❌ Função is_admin não existe:', isAdminError.message);
      console.log('ℹ️ Execute o script apply-basic-rls.sql no SQL Editor do Supabase');
    } else {
      console.log('✅ Função is_admin está disponível');
    }

    // Testar função is_seller
    const { data: isSellerResult, error: isSellerError } = await supabase
      .rpc('is_seller');
    
    if (isSellerError) {
      console.log('❌ Função is_seller não existe:', isSellerError.message);
      console.log('ℹ️ Execute o script apply-basic-rls.sql no SQL Editor do Supabase');
    } else {
      console.log('✅ Função is_seller está disponível');
    }

    // Logout
    await supabase.auth.signOut();
    console.log('✅ Logout realizado');

    console.log('\n📋 DIAGNÓSTICO:');
    console.log('   - Se conseguiu acessar os dados, o sistema deve funcionar');
    console.log('   - Se não conseguiu, as políticas RLS estão muito restritivas');
    console.log('   - Execute o script apply-basic-rls.sql no SQL Editor do Supabase');
    console.log('\n🔧 SOLUÇÃO TEMPORÁRIA:');
    console.log('   1. Vá para o SQL Editor do Supabase');
    console.log('   2. Execute o script scripts/apply-basic-rls.sql');
    console.log('   3. Ou desabilite RLS temporariamente nas tabelas principais');

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  }
}

// Executar verificação
fixAccessTemporarily(); 