const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const SUPABASE_URL = "https://ujawcfzhgbgwwcafoaeh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYXdjZnpoZ2Jnd3djYWZvYWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTM1MDMsImV4cCI6MjA2NjgyOTUwM30.9kVO6CTVVLLpQpXOokBccL_rIDFVBA5-AcycN5oOw0o";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🧪 TESTANDO POLÍTICAS RLS');
console.log('==========================\n');

async function testRLSPolicies() {
  try {
    console.log('1. Testando acesso sem autenticação...');
    
    // Tentar acessar dados sem estar logado
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.log('✅ Política RLS funcionando: Acesso negado sem autenticação');
    } else {
      console.log('❌ ALERTA: Política RLS não está funcionando - dados acessíveis sem autenticação');
    }

    console.log('\n2. Testando login com usuário admin...');
    
    // Login com admin (substitua pelos dados reais)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@roupacerta.com', // Substitua pelo email real
      password: '123456' // Substitua pela senha real
    });

    if (authError) {
      console.log('❌ Erro no login:', authError.message);
      console.log('ℹ️ Execute o script create-admin-user.js primeiro');
      return;
    }

    console.log('✅ Login bem-sucedido como admin');
    console.log(`👤 Usuário: ${authData.user.email}`);

    console.log('\n3. Testando acesso como admin...');
    
    // Testar acesso a profiles como admin
    const { data: adminProfiles, error: adminProfilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
    
    if (adminProfilesError) {
      console.log('❌ Erro ao acessar profiles como admin:', adminProfilesError.message);
    } else {
      console.log(`✅ Admin pode ver ${adminProfiles.length} profiles`);
    }

    // Testar acesso a produtos como admin
    const { data: adminProducts, error: adminProductsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (adminProductsError) {
      console.log('❌ Erro ao acessar produtos como admin:', adminProductsError.message);
    } else {
      console.log(`✅ Admin pode ver ${adminProducts.length} produtos`);
    }

    // Testar acesso a vendas como admin
    const { data: adminSales, error: adminSalesError } = await supabase
      .from('sales')
      .select('*')
      .limit(5);
    
    if (adminSalesError) {
      console.log('❌ Erro ao acessar vendas como admin:', adminSalesError.message);
    } else {
      console.log(`✅ Admin pode ver ${adminSales.length} vendas`);
    }

    console.log('\n4. Testando logout...');
    await supabase.auth.signOut();
    console.log('✅ Logout realizado');

    console.log('\n5. Testando acesso após logout...');
    
    // Tentar acessar dados após logout
    const { data: postLogoutProfiles, error: postLogoutError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (postLogoutError) {
      console.log('✅ Política RLS funcionando: Acesso negado após logout');
    } else {
      console.log('❌ ALERTA: Política RLS não está funcionando - dados acessíveis após logout');
    }

    console.log('\n6. Testando funções de verificação...');
    
    // Testar função is_admin
    const { data: isAdminResult, error: isAdminError } = await supabase
      .rpc('is_admin');
    
    if (isAdminError) {
      console.log('❌ Erro ao testar função is_admin:', isAdminError.message);
    } else {
      console.log('✅ Função is_admin está disponível');
    }

    // Testar função is_seller
    const { data: isSellerResult, error: isSellerError } = await supabase
      .rpc('is_seller');
    
    if (isSellerError) {
      console.log('❌ Erro ao testar função is_seller:', isSellerError.message);
    } else {
      console.log('✅ Função is_seller está disponível');
    }

    console.log('\n🎉 TESTE DE POLÍTICAS RLS CONCLUÍDO!');
    console.log('\n📋 Resumo:');
    console.log('   - Verifique se todas as políticas estão funcionando');
    console.log('   - Se houver erros, execute o script apply-secure-rls-policies.sql');
    console.log('   - Teste com diferentes tipos de usuário (admin, vendedor, etc.)');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar teste
testRLSPolicies(); 