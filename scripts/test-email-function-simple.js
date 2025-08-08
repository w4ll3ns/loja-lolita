// Script para testar a função de email de forma simples
// Execute este script no console do navegador

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://ujawcfzhgbgwwcafoaeh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYXdjZnpoZ2Jnd3djYWZvYWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTM1MDMsImV4cCI6MjA2NjgyOTUwM30.9kVO6CTVVLLpQpXOokBccL_rIDFVBA5-AcycN5oOw0o";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailFunctionSimple() {
  console.log('🧪 Testando função de email de forma simples...');

  try {
    // 1. Buscar profiles
    console.log('1. Buscando profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(3);

    if (profilesError) {
      console.error('❌ Erro ao buscar profiles:', profilesError);
      return;
    }

    console.log(`✅ Encontrados ${profiles.length} profiles`);

    if (profiles.length === 0) {
      console.log('ℹ️ Nenhum profile encontrado');
      return;
    }

    // 2. Testar a função get_user_email
    const testUserId = profiles[0].user_id;
    console.log(`\n2. Testando função get_user_email para user_id: ${testUserId}`);
    
    const { data: emailResult, error: emailError } = await supabase
      .rpc('get_user_email', { user_id_param: testUserId });

    console.log('Resultado da função get_user_email:', { emailResult, emailError });

    if (emailError) {
      console.log('❌ Função get_user_email não está disponível');
      console.log('ℹ️ Execute o script apply-email-function.sql no Supabase');
    } else {
      console.log(`✅ Email encontrado: ${emailResult || 'Não encontrado'}`);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Execute o teste
testEmailFunctionSimple(); 