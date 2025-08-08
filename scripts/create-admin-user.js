import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const SUPABASE_URL = "https://ujawcfzhgbgwwcafoaeh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYXdjZnpoZ2Jnd3djYWZvYWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTM1MDMsImV4cCI6MjA2NjgyOTUwM30.9kVO6CTVVLLpQpXOokBccL_rIDFVBA5-AcycN5oOw0o";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('👤 CRIANDO USUÁRIO ADMIN');
console.log('========================\n');

async function createAdminUser() {
  try {
    const adminData = {
      email: 'admin@roupacerta.com',
      password: 'admin123456',
      name: 'Administrador',
      phone: '(11) 99999-9999',
      role: 'admin'
    };

    console.log('1. Criando usuário admin...');
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Senha: ${adminData.password}`);
    console.log(`   Nome: ${adminData.name}`);
    console.log(`   Role: ${adminData.role}`);

    const { data, error } = await supabase.auth.signUp({
      email: adminData.email,
      password: adminData.password,
      options: {
        data: {
          name: adminData.name,
          phone: adminData.phone,
          role: adminData.role
        }
      }
    });

    if (error) {
      console.log('❌ Erro ao criar usuário:', error.message);
      
      // Se o usuário já existe, tentar fazer login
      if (error.message.includes('already registered')) {
        console.log('\n2. Usuário já existe, testando login...');
        
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: adminData.email,
          password: adminData.password
        });

        if (loginError) {
          console.log('❌ Erro no login:', loginError.message);
          console.log('ℹ️ Tente usar uma senha diferente ou resetar a senha');
        } else {
          console.log('✅ Login bem-sucedido!');
          console.log(`👤 Usuário: ${loginData.user.email}`);
          
          // Verificar se o profile foi criado
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', loginData.user.id)
            .single();

          if (profileError) {
            console.log('❌ Erro ao buscar profile:', profileError.message);
          } else {
            console.log('✅ Profile encontrado:');
            console.log(`   Nome: ${profile.name}`);
            console.log(`   Role: ${profile.role}`);
            console.log(`   Telefone: ${profile.phone}`);
          }

          await supabase.auth.signOut();
          console.log('✅ Logout realizado');
        }
      }
    } else {
      console.log('✅ Usuário admin criado com sucesso!');
      console.log(`👤 ID: ${data.user?.id}`);
      console.log(`📧 Email: ${data.user?.email}`);
      
      // Verificar se o profile foi criado automaticamente
      setTimeout(async () => {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user?.id)
          .single();

        if (profileError) {
          console.log('❌ Erro ao buscar profile:', profileError.message);
        } else {
          console.log('✅ Profile criado automaticamente:');
          console.log(`   Nome: ${profile.name}`);
          console.log(`   Role: ${profile.role}`);
          console.log(`   Telefone: ${profile.phone}`);
        }
      }, 2000);
    }

    console.log('\n📋 CREDENCIAIS PARA TESTE:');
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Senha: ${adminData.password}`);
    console.log('\nℹ️ Use essas credenciais para fazer login no sistema');

  } catch (error) {
    console.error('❌ Erro durante a criação:', error);
  }
}

// Executar criação
createAdminUser(); 