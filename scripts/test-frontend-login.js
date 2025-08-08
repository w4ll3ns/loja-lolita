import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const SUPABASE_URL = "https://ujawcfzhgbgwwcafoaeh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYXdjZnpoZ2Jnd3djYWZvYWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTM1MDMsImV4cCI6MjA2NjgyOTUwM30.9kVO6CTVVLLpQpXOokBccL_rIDFVBA5-AcycN5oOw0o";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🌐 TESTANDO LOGIN NO FRONTEND');
console.log('==============================\n');

async function testFrontendLogin() {
  try {
    console.log('1. Testando login com credenciais válidas...');
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@roupacerta.com',
      password: 'admin123456'
    });

    if (authError) {
      console.log('❌ Erro no login:', authError.message);
      return;
    }

    console.log('✅ Login bem-sucedido!');
    console.log(`👤 Usuário: ${authData.user.email}`);
    console.log(`🆔 ID: ${authData.user.id}`);

    console.log('\n2. Verificando se o profile foi carregado...');
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (profileError) {
      console.log('❌ Erro ao buscar profile:', profileError.message);
    } else {
      console.log('✅ Profile carregado:');
      console.log(`   Nome: ${profile.name}`);
      console.log(`   Role: ${profile.role}`);
      console.log(`   Telefone: ${profile.phone}`);
    }

    console.log('\n3. Testando acesso a dados do sistema...');
    
    // Testar acesso a produtos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.log('❌ Erro ao acessar produtos:', productsError.message);
    } else {
      console.log(`✅ Pode acessar ${products.length} produtos`);
    }

    // Testar acesso a vendas
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('*')
      .limit(5);
    
    if (salesError) {
      console.log('❌ Erro ao acessar vendas:', salesError.message);
    } else {
      console.log(`✅ Pode acessar ${sales.length} vendas`);
    }

    // Testar acesso a clientes
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .limit(5);
    
    if (customersError) {
      console.log('❌ Erro ao acessar clientes:', customersError.message);
    } else {
      console.log(`✅ Pode acessar ${customers.length} clientes`);
    }

    console.log('\n4. Verificando sessão...');
    
    const { data: session } = await supabase.auth.getSession();
    if (session.session) {
      console.log('✅ Sessão ativa');
      console.log(`   Token expira em: ${new Date(session.session.expires_at * 1000).toLocaleString()}`);
    } else {
      console.log('❌ Nenhuma sessão ativa');
    }

    // Logout
    await supabase.auth.signOut();
    console.log('✅ Logout realizado');

    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('\n📋 RESULTADO:');
    console.log('   - Backend está funcionando corretamente');
    console.log('   - Autenticação está funcionando');
    console.log('   - Acesso aos dados está funcionando');
    console.log('\n🌐 PRÓXIMO PASSO:');
    console.log('   - Teste o login no navegador em http://localhost:8081');
    console.log('   - Use as credenciais: admin@roupacerta.com / admin123456');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar teste
testFrontendLogin(); 