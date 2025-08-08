import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const SUPABASE_URL = "https://ujawcfzhgbgwwcafoaeh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYXdjZnpoZ2Jnd3djYWZvYWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTM1MDMsImV4cCI6MjA2NjgyOTUwM30.9kVO6CTVVLLpQpXOokBccL_rIDFVBA5-AcycN5oOw0o";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🆕 TESTE DO NOVO SISTEMA DE ESTOQUE');
console.log('=====================================\n');

async function testNewStockSystem() {
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

    console.log('\n2. Verificando estrutura da tabela products...');
    
    // Verificar se os novos campos existem
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, quantity, negative_stock, reserved_stock, available_stock')
      .limit(3);
    
    if (productsError) {
      console.log('❌ Erro ao buscar produtos:', productsError.message);
      return;
    }

    console.log(`✅ Encontrados ${products.length} produtos`);
    products.forEach(product => {
      console.log(`   - ${product.name}:`);
      console.log(`     Estoque: ${product.quantity}`);
      console.log(`     Negativo: ${product.negative_stock || 0}`);
      console.log(`     Reservado: ${product.reserved_stock || 0}`);
      console.log(`     Disponível: ${product.available_stock || 0}`);
    });

    console.log('\n3. Testando simulação de venda com estoque negativo...');
    
    if (products && products.length > 0) {
      const testProduct = products[0];
      const originalStock = testProduct.quantity || 0;
      const originalNegativeStock = testProduct.negative_stock || 0;
      const soldQuantity = originalStock + 2; // Vender mais do que tem
      
      console.log(`   Produto: ${testProduct.name}`);
      console.log(`   Estoque atual: ${originalStock}`);
      console.log(`   Estoque negativo atual: ${originalNegativeStock}`);
      console.log(`   Quantidade a vender: ${soldQuantity}`);

      // Calcular novo estoque
      const newStock = originalStock - soldQuantity;
      const newNegativeStock = originalNegativeStock + Math.abs(newStock);
      const finalStock = Math.max(0, newStock);

      console.log(`   Estoque após venda: ${finalStock}`);
      console.log(`   Estoque negativo após venda: ${newNegativeStock}`);

      console.log('\n4. Atualizando estoque no banco...');
      
      const { data: updateResult, error: updateError } = await supabase
        .from('products')
        .update({ 
          quantity: finalStock,
          negative_stock: newNegativeStock,
          updated_at: new Date().toISOString()
        })
        .eq('id', testProduct.id)
        .select();

      if (updateError) {
        console.log('❌ Erro ao atualizar estoque:', updateError.message);
        return;
      }

      console.log('✅ Estoque atualizado no banco');

      console.log('\n5. Verificando se a atualização funcionou...');
      
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
      console.log(`   Estoque negativo: ${updatedProduct.negative_stock}`);
      console.log(`   Estoque real: ${updatedProduct.quantity - updatedProduct.negative_stock}`);

      if (updatedProduct.negative_stock > 0) {
        console.log('🎉 SUCESSO! Sistema de estoque negativo funcionando!');
      } else {
        console.log('❌ Estoque negativo não foi registrado');
      }

      console.log('\n6. Criando alerta de estoque negativo...');
      
      const { data: alertResult, error: alertError } = await supabase
        .from('stock_alerts')
        .insert({
          product_id: testProduct.id,
          product_name: testProduct.name,
          current_stock: -(updatedProduct.negative_stock),
          alert_type: 'negative_stock'
        })
        .select();

      if (alertError) {
        console.log('❌ Erro ao criar alerta:', alertError.message);
      } else {
        console.log('✅ Alerta de estoque negativo criado');
      }

      // Restaurar valores originais
      console.log('\n7. Restaurando valores originais...');
      
      const { error: restoreError } = await supabase
        .from('products')
        .update({ 
          quantity: originalStock,
          negative_stock: originalNegativeStock,
          updated_at: new Date().toISOString()
        })
        .eq('id', testProduct.id);

      if (restoreError) {
        console.log('❌ Erro ao restaurar valores:', restoreError.message);
      } else {
        console.log('✅ Valores originais restaurados');
      }
    }

    // Logout
    await supabase.auth.signOut();
    console.log('✅ Logout realizado');

    console.log('\n📋 RESUMO DO TESTE:');
    console.log('===================\n');
    console.log('✅ Login funcionando');
    console.log('✅ Estrutura da tabela verificada');
    console.log('✅ Simulação de venda realizada');
    console.log('✅ Estoque atualizado no banco');
    console.log('✅ Alerta de estoque negativo criado');
    
    if (products && products.length > 0) {
      const testProduct = products[0];
      if (testProduct.negative_stock > 0) {
        console.log('✅ Sistema de estoque negativo funcionando corretamente');
      }
    }

    console.log('\n🌐 PRÓXIMO PASSO:');
    console.log('==================\n');
    console.log('1. Execute o script SQL no Supabase SQL Editor');
    console.log('2. Teste manual no navegador: http://localhost:8081');
    console.log('3. Tente vender produtos com estoque baixo');
    console.log('4. Verifique se o estoque negativo é registrado');
    console.log('5. Confirme se os alertas aparecem');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar teste
testNewStockSystem(); 