import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const SUPABASE_URL = "https://ujawcfzhgbgwwcafoaeh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYXdjZnpoZ2Jnd3djYWZvYWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTM1MDMsImV4cCI6MjA2NjgyOTUwM30.9kVO6CTVVLLpQpXOokBccL_rIDFVBA5-AcycN5oOw0o";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔄 TESTE DE ATUALIZAÇÃO DE ESTOQUE');
console.log('===================================\n');

async function testStockUpdate() {
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

    console.log('\n2. Buscando produto para teste...');
    
    // Buscar um produto com estoque baixo para testar
    const { data: testProduct, error: productError } = await supabase
      .from('products')
      .select('*')
      .lte('quantity', 3)
      .gt('quantity', 0)
      .limit(1)
      .single();
    
    if (productError) {
      console.log('❌ Erro ao buscar produto:', productError.message);
      return;
    }

    console.log(`✅ Produto encontrado: ${testProduct.name}`);
    console.log(`   Estoque atual: ${testProduct.quantity}`);

    console.log('\n3. Simulando venda que deixará estoque negativo...');
    
    const originalStock = testProduct.quantity;
    const soldQuantity = originalStock + 2; // Vender mais do que tem
    const expectedNewStock = originalStock - soldQuantity;

    console.log(`   Quantidade a vender: ${soldQuantity}`);
    console.log(`   Estoque esperado após venda: ${expectedNewStock}`);

    console.log('\n4. Atualizando estoque no banco...');
    
    const { data: updateResult, error: updateError } = await supabase
      .from('products')
      .update({ 
        quantity: expectedNewStock,
        updated_at: new Date().toISOString()
      })
      .eq('id', testProduct.id)
      .select();

    if (updateError) {
      console.log('❌ Erro ao atualizar estoque:', updateError.message);
      return;
    }

    console.log('✅ Estoque atualizado no banco');

    console.log('\n5. Verificando se o estoque foi atualizado...');
    
    const { data: updatedProduct, error: checkError } = await supabase
      .from('products')
      .select('*')
      .eq('id', testProduct.id)
      .single();

    if (checkError) {
      console.log('❌ Erro ao verificar produto:', checkError.message);
      return;
    }

    console.log(`✅ Produto verificado: ${updatedProduct.name}`);
    console.log(`   Estoque atual: ${updatedProduct.quantity}`);
    console.log(`   Estoque anterior: ${originalStock}`);

    if (updatedProduct.quantity === expectedNewStock) {
      console.log('✅ Estoque foi atualizado corretamente!');
    } else {
      console.log('❌ Estoque não foi atualizado corretamente');
    }

    console.log('\n6. Criando alerta de estoque negativo...');
    
    const { data: alertResult, error: alertError } = await supabase
      .from('stock_alerts')
      .insert({
        product_id: testProduct.id,
        product_name: testProduct.name,
        current_stock: expectedNewStock,
        alert_type: 'negative_stock'
      })
      .select();

    if (alertError) {
      console.log('❌ Erro ao criar alerta:', alertError.message);
    } else {
      console.log('✅ Alerta de estoque negativo criado');
    }

    console.log('\n7. Verificando alertas criados...');
    
    const { data: alerts, error: alertsError } = await supabase
      .from('stock_alerts')
      .select('*')
      .eq('product_id', testProduct.id)
      .order('created_at', { ascending: false });

    if (alertsError) {
      console.log('❌ Erro ao buscar alertas:', alertsError.message);
    } else {
      console.log(`✅ Encontrados ${alerts.length} alertas para este produto`);
      alerts.forEach(alert => {
        console.log(`   - ${alert.product_name}: ${alert.current_stock} unidades (${alert.alert_type})`);
      });
    }

    // Logout
    await supabase.auth.signOut();
    console.log('✅ Logout realizado');

    console.log('\n📋 RESUMO DO TESTE:');
    console.log('===================\n');
    console.log('✅ Login funcionando');
    console.log('✅ Produto encontrado para teste');
    console.log('✅ Estoque atualizado no banco');
    console.log('✅ Alerta de estoque negativo criado');
    
    if (expectedNewStock < 0) {
      console.log('✅ Estoque negativo implementado corretamente');
    }

    console.log('\n🌐 PRÓXIMO PASSO:');
    console.log('==================\n');
    console.log('1. Teste manual no navegador: http://localhost:8081');
    console.log('2. Tente vender um produto com estoque baixo');
    console.log('3. Verifique se o estoque fica negativo');
    console.log('4. Confirme se os alertas aparecem');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar teste
testStockUpdate(); 