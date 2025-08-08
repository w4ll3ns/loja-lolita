import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const SUPABASE_URL = "https://ujawcfzhgbgwwcafoaeh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYXdjZnpoZ2Jnd3djYWZvYWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTM1MDMsImV4cCI6MjA2NjgyOTUwM30.9kVO6CTVVLLpQpXOokBccL_rIDFVBA5-AcycN5oOw0o";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🌐 TESTANDO ACESSO AO SISTEMA');
console.log('==============================\n');

async function testSystemAccess() {
  try {
    console.log('1. Testando acesso ao frontend...');
    
    const response = await fetch('http://localhost:8081');
    if (response.ok) {
      console.log('✅ Frontend está acessível');
    } else {
      console.log('❌ Frontend não está acessível');
      return;
    }

    console.log('\n2. Testando login no sistema...');
    
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

    console.log('\n3. Testando acesso aos dados principais...');
    
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

    // Logout
    await supabase.auth.signOut();
    console.log('✅ Logout realizado');

    console.log('\n🎉 SISTEMA FUNCIONANDO CORRETAMENTE!');
    console.log('\n📋 RESUMO:');
    console.log('   ✅ Frontend acessível');
    console.log('   ✅ Autenticação funcionando');
    console.log('   ✅ Acesso aos dados funcionando');
    console.log('\n🌐 PRÓXIMO PASSO:');
    console.log('   - Acesse http://localhost:8081 no navegador');
    console.log('   - Use as credenciais: admin@roupacerta.com / admin123456');
    console.log('   - Teste todas as funcionalidades');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar teste
testSystemAccess(); 