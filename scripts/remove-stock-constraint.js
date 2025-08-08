import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const SUPABASE_URL = "https://ujawcfzhgbgwwcafoaeh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYXdjZnpoZ2Jnd3djYWZvYWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTM1MDMsImV4cCI6MjA2NjgyOTUwM30.9kVO6CTVVLLpQpXOokBccL_rIDFVBA5-AcycN5oOw0o";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔧 REMOVENDO CONSTRAINT DE ESTOQUE');
console.log('===================================\n');

async function removeStockConstraint() {
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

    console.log('✅ Login bem-sucedido');

    console.log('\n2. Verificando constraint atual...');
    
    // Verificar se existe a constraint
    const { data: constraints, error: constraintError } = await supabase
      .rpc('exec_sql', {
        sql_query: `
          SELECT 
            constraint_name,
            constraint_type,
            check_clause
          FROM information_schema.check_constraints 
          WHERE constraint_name = 'products_quantity_check'
        `
      });

    if (constraintError) {
      console.log('❌ Erro ao verificar constraints:', constraintError.message);
      console.log('   Tentando método alternativo...');
    } else {
      console.log('✅ Constraints encontradas:', constraints);
    }

    console.log('\n3. Removendo constraint...');
    
    // Tentar remover a constraint
    const { data: dropResult, error: dropError } = await supabase
      .rpc('exec_sql', {
        sql_query: `
          ALTER TABLE public.products 
          DROP CONSTRAINT IF EXISTS products_quantity_check
        `
      });

    if (dropError) {
      console.log('❌ Erro ao remover constraint:', dropError.message);
      console.log('   Tentando método alternativo...');
    } else {
      console.log('✅ Constraint removida com sucesso');
    }

    console.log('\n4. Testando atualização com valor negativo...');
    
    // Buscar um produto para teste
    const { data: testProduct, error: productError } = await supabase
      .from('products')
      .select('*')
      .gt('quantity', 0)
      .limit(1)
      .single();
    
    if (productError) {
      console.log('❌ Erro ao buscar produto:', productError.message);
      return;
    }

    console.log(`✅ Produto encontrado: ${testProduct.name}`);
    console.log(`   Estoque atual: ${testProduct.quantity}`);

    // Tentar atualizar para valor negativo
    const { data: updateResult, error: updateError } = await supabase
      .from('products')
      .update({ 
        quantity: -1,
        updated_at: new Date().toISOString()
      })
      .eq('id', testProduct.id)
      .select();

    if (updateError) {
      console.log('❌ Erro ao atualizar para valor negativo:', updateError.message);
      console.log('   A constraint ainda está ativa');
    } else {
      console.log('✅ Produto atualizado para valor negativo!');
      console.log(`   Novo estoque: ${updateResult[0].quantity}`);
    }

    console.log('\n5. Verificando se a atualização funcionou...');
    
    const { data: updatedProduct, error: checkError } = await supabase
      .from('products')
      .select('*')
      .eq('id', testProduct.id)
      .single();

    if (checkError) {
      console.log('❌ Erro ao verificar produto:', checkError.message);
    } else {
      console.log(`✅ Produto verificado: ${updatedProduct.name}`);
      console.log(`   Estoque atual: ${updatedProduct.quantity}`);
      
      if (updatedProduct.quantity < 0) {
        console.log('🎉 SUCESSO! Estoque negativo funcionando!');
      } else {
        console.log('❌ Estoque não ficou negativo');
      }
    }

    // Restaurar o valor original
    console.log('\n6. Restaurando valor original...');
    
    const { error: restoreError } = await supabase
      .from('products')
      .update({ 
        quantity: testProduct.quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', testProduct.id);

    if (restoreError) {
      console.log('❌ Erro ao restaurar valor:', restoreError.message);
    } else {
      console.log('✅ Valor original restaurado');
    }

    // Logout
    await supabase.auth.signOut();
    console.log('✅ Logout realizado');

    console.log('\n📋 RESUMO:');
    console.log('==========\n');
    
    if (updatedProduct && updatedProduct.quantity < 0) {
      console.log('✅ Constraint removida com sucesso');
      console.log('✅ Estoque negativo funcionando');
      console.log('✅ Sistema pronto para uso');
    } else {
      console.log('❌ Constraint ainda está ativa');
      console.log('⚠️ Execute manualmente no SQL Editor:');
      console.log('   ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_quantity_check;');
    }

    console.log('\n🌐 PRÓXIMO PASSO:');
    console.log('==================\n');
    console.log('1. Teste manual no navegador: http://localhost:8081');
    console.log('2. Tente vender produtos com estoque baixo');
    console.log('3. Verifique se o estoque fica negativo');
    console.log('4. Confirme se os avisos aparecem');

  } catch (error) {
    console.error('❌ Erro durante o processo:', error);
  }
}

// Executar script
removeStockConstraint(); 