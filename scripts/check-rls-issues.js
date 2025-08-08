import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const SUPABASE_URL = "https://ujawcfzhgbgwwcafoaeh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYXdjZnpoZ2Jnd3djYWZvYWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTM1MDMsImV4cCI6MjA2NjgyOTUwM30.9kVO6CTVVLLpQpXOokBccL_rIDFVBA5-AcycN5oOw0o";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 VERIFICANDO PROBLEMAS DE RLS');
console.log('================================\n');

async function checkRLSIssues() {
  try {
    console.log('1. Verificando se as políticas RLS estão ativas...');
    
    // Tentar acessar profiles sem autenticação
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.log('✅ Política RLS está funcionando (acesso negado sem auth)');
      console.log('   Erro:', profilesError.message);
    } else {
      console.log('❌ ALERTA: Política RLS não está funcionando!');
      console.log('   Dados acessíveis sem autenticação');
    }

    console.log('\n2. Verificando se as funções de RLS existem...');
    
    // Testar função is_admin
    const { data: isAdminResult, error: isAdminError } = await supabase
      .rpc('is_admin');
    
    if (isAdminError) {
      console.log('❌ Função is_admin não existe ou não está acessível');
      console.log('   Erro:', isAdminError.message);
    } else {
      console.log('✅ Função is_admin está disponível');
    }

    // Testar função is_seller
    const { data: isSellerResult, error: isSellerError } = await supabase
      .rpc('is_seller');
    
    if (isSellerError) {
      console.log('❌ Função is_seller não existe ou não está acessível');
      console.log('   Erro:', isSellerError.message);
    } else {
      console.log('✅ Função is_seller está disponível');
    }

    console.log('\n3. Verificando se há usuários no sistema...');
    
    // Tentar login com credenciais padrão
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@roupacerta.com',
      password: '123456'
    });

    if (authError) {
      console.log('❌ Erro no login:', authError.message);
      console.log('ℹ️ Execute o script create-admin-user.js primeiro');
    } else {
      console.log('✅ Login bem-sucedido');
      console.log(`👤 Usuário: ${authData.user.email}`);
      
      // Testar acesso a dados como usuário autenticado
      console.log('\n4. Testando acesso a dados como usuário autenticado...');
      
      const { data: userProfiles, error: userProfilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);
      
      if (userProfilesError) {
        console.log('❌ Erro ao acessar profiles:', userProfilesError.message);
      } else {
        console.log(`✅ Pode acessar ${userProfiles.length} profiles`);
      }

      // Testar acesso a produtos
      const { data: userProducts, error: userProductsError } = await supabase
        .from('products')
        .select('*')
        .limit(5);
      
      if (userProductsError) {
        console.log('❌ Erro ao acessar produtos:', userProductsError.message);
      } else {
        console.log(`✅ Pode acessar ${userProducts.length} produtos`);
      }

      // Logout
      await supabase.auth.signOut();
      console.log('✅ Logout realizado');
    }

    console.log('\n📋 DIAGNÓSTICO:');
    console.log('   - Se as políticas RLS estão muito restritivas, pode estar bloqueando acesso legítimo');
    console.log('   - Verifique se as funções is_admin e is_seller foram criadas corretamente');
    console.log('   - Confirme se há usuários válidos no sistema');
    console.log('   - Teste com diferentes tipos de usuário (admin, vendedor)');

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  }
}

// Executar verificação
checkRLSIssues(); 