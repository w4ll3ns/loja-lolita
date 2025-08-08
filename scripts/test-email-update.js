// Script para testar a atualização de email
// Execute este script no console do navegador

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ujawcfzhgbgwwcafoaeh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYXdjZnpoZ2Jnd3djYWZvYWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTM1MDMsImV4cCI6MjA2NjgyOTUwM30.9kVO6CTVVLLpQpXOokBccL_rIDFVBA5-AcycN5oOw0o";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailUpdate() {
  console.log('🧪 Testando atualização de email...');

  try {
    // 1. Buscar um usuário para testar
    console.log('1. Buscando usuário para teste...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError || !profiles || profiles.length === 0) {
      console.error('❌ Erro ao buscar profiles:', profilesError);
      return;
    }

    const testUser = profiles[0];
    console.log(`✅ Usuário encontrado: ${testUser.name} (ID: ${testUser.user_id})`);

    // 2. Buscar email atual
    console.log('2. Buscando email atual...');
    const { data: currentEmail, error: emailError } = await supabase
      .rpc('get_user_email', { user_id_param: testUser.user_id });

    if (emailError) {
      console.error('❌ Erro ao buscar email atual:', emailError);
      return;
    }

    console.log(`✅ Email atual: ${currentEmail || 'Não encontrado'}`);

    // 3. Testar atualização de email
    const newEmail = `teste${Date.now()}@exemplo.com`;
    console.log(`3. Testando atualização para: ${newEmail}`);
    
    const { data: updateResult, error: updateError } = await supabase
      .rpc('update_user_email', { 
        user_id_param: testUser.user_id, 
        new_email: newEmail 
      });

    if (updateError) {
      console.error('❌ Erro ao atualizar email:', updateError);
      return;
    }

    console.log(`✅ Resultado da atualização: ${updateResult}`);

    // 4. Verificar se o email foi atualizado
    console.log('4. Verificando se o email foi atualizado...');
    const { data: updatedEmail, error: verifyError } = await supabase
      .rpc('get_user_email', { user_id_param: testUser.user_id });

    if (verifyError) {
      console.error('❌ Erro ao verificar email atualizado:', verifyError);
      return;
    }

    console.log(`✅ Email após atualização: ${updatedEmail}`);

    if (updatedEmail === newEmail) {
      console.log('🎉 Email atualizado com sucesso!');
    } else {
      console.log('❌ Email não foi atualizado corretamente');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Execute o teste
testEmailUpdate(); 