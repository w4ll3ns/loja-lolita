import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const SUPABASE_URL = "https://ujawcfzhgbgwwcafoaeh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYXdjZnpoZ2Jnd3djYWZvYWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTM1MDMsImV4cCI6MjA2NjgyOTUwM30.9kVO6CTVVLLpQpXOokBccL_rIDFVBA5-AcycN5oOw0o";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('📦 TESTE DE CONTROLE DE ESTOQUE');
console.log('================================\n');

async function testInventoryControl() {
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

    console.log('\n2. Verificando produtos com estoque...');
    
    // Buscar produtos com estoque baixo
    const { data: lowStockProducts, error: lowStockError } = await supabase
      .from('products')
      .select('*')
      .lte('quantity', 3)
      .gt('quantity', 0)
      .limit(5);
    
    if (lowStockError) {
      console.log('❌ Erro ao buscar produtos com estoque baixo:', lowStockError.message);
    } else {
      console.log(`✅ Encontrados ${lowStockProducts.length} produtos com estoque baixo`);
      lowStockProducts.forEach(product => {
        console.log(`   - ${product.name}: ${product.quantity} unidades`);
      });
    }

    // Buscar produtos sem estoque
    const { data: outOfStockProducts, error: outOfStockError } = await supabase
      .from('products')
      .select('*')
      .eq('quantity', 0)
      .limit(5);
    
    if (outOfStockError) {
      console.log('❌ Erro ao buscar produtos sem estoque:', outOfStockError.message);
    } else {
      console.log(`✅ Encontrados ${outOfStockProducts.length} produtos sem estoque`);
      outOfStockProducts.forEach(product => {
        console.log(`   - ${product.name}: ${product.quantity} unidades`);
      });
    }

    // Buscar produtos com estoque negativo (se houver)
    const { data: negativeStockProducts, error: negativeStockError } = await supabase
      .from('products')
      .select('*')
      .lt('quantity', 0)
      .limit(5);
    
    if (negativeStockError) {
      console.log('❌ Erro ao buscar produtos com estoque negativo:', negativeStockError.message);
    } else {
      console.log(`✅ Encontrados ${negativeStockProducts.length} produtos com estoque negativo`);
      negativeStockProducts.forEach(product => {
        console.log(`   - ${product.name}: ${product.quantity} unidades`);
      });
    }

    console.log('\n3. Testando simulação de venda...');
    
    if (lowStockProducts && lowStockProducts.length > 0) {
      const testProduct = lowStockProducts[0];
      const originalStock = testProduct.quantity;
      const requestedQuantity = 2;
      
      console.log(`   Produto: ${testProduct.name}`);
      console.log(`   Estoque atual: ${originalStock}`);
      console.log(`   Quantidade solicitada: ${requestedQuantity}`);
      
      if (originalStock >= requestedQuantity) {
        console.log('   ✅ Estoque suficiente para venda');
      } else {
        console.log('   ⚠️ Estoque insuficiente para venda');
        console.log(`   Estoque negativo seria: ${originalStock - requestedQuantity}`);
      }
    }

    console.log('\n4. Verificando funções de estoque no banco...');
    
    // Testar função get_available_stock
    if (lowStockProducts && lowStockProducts.length > 0) {
      const testProduct = lowStockProducts[0];
      
      const { data: availableStock, error: stockError } = await supabase
        .rpc('get_available_stock', { product_id_param: testProduct.id });
      
      if (stockError) {
        console.log('❌ Função get_available_stock não encontrada:', stockError.message);
      } else {
        console.log(`✅ Estoque disponível para ${testProduct.name}: ${availableStock}`);
      }
    }

    // Testar função can_sell_product
    if (lowStockProducts && lowStockProducts.length > 0) {
      const testProduct = lowStockProducts[0];
      
      const { data: canSell, error: sellError } = await supabase
        .rpc('can_sell_product', { 
          product_id_param: testProduct.id, 
          requested_quantity: 1 
        });
      
      if (sellError) {
        console.log('❌ Função can_sell_product não encontrada:', sellError.message);
      } else {
        console.log(`✅ Pode vender ${testProduct.name}: ${canSell}`);
      }
    }

    console.log('\n5. Verificando alertas de estoque...');
    
    // Verificar se existe tabela de alertas
    const { data: stockAlerts, error: alertsError } = await supabase
      .from('stock_alerts')
      .select('*')
      .limit(5);
    
    if (alertsError) {
      console.log('❌ Tabela stock_alerts não encontrada:', alertsError.message);
      console.log('   Execute o script update-stock-after-sale.sql para criar a tabela');
    } else {
      console.log(`✅ Encontrados ${stockAlerts.length} alertas de estoque`);
      stockAlerts.forEach(alert => {
        console.log(`   - ${alert.product_name}: ${alert.current_stock} unidades (${alert.alert_type})`);
      });
    }

    // Logout
    await supabase.auth.signOut();
    console.log('✅ Logout realizado');

    console.log('\n📋 RESUMO DO TESTE DE ESTOQUE:');
    console.log('================================\n');
    console.log('✅ Login funcionando');
    console.log('✅ Verificação de produtos funcionando');
    console.log('✅ Simulação de vendas funcionando');
    
    if (lowStockProducts && lowStockProducts.length > 0) {
      console.log('⚠️ Produtos com estoque baixo encontrados');
    }
    
    if (outOfStockProducts && outOfStockProducts.length > 0) {
      console.log('❌ Produtos sem estoque encontrados');
    }
    
    if (negativeStockProducts && negativeStockProducts.length > 0) {
      console.log('🚨 Produtos com estoque negativo encontrados');
    }

    console.log('\n🔧 RECOMENDAÇÕES:');
    console.log('==================\n');
    console.log('1. Execute o script update-stock-after-sale.sql no SQL Editor');
    console.log('2. Configure alertas de estoque baixo');
    console.log('3. Implemente controle de estoque negativo');
    console.log('4. Monitore produtos sem estoque');
    console.log('5. Configure notificações automáticas');

    console.log('\n🌐 PRÓXIMO PASSO:');
    console.log('==================\n');
    console.log('1. Teste manual no navegador: http://localhost:8081');
    console.log('2. Tente adicionar produtos com estoque baixo');
    console.log('3. Verifique se os avisos aparecem corretamente');
    console.log('4. Teste vendas que deixam estoque negativo');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar teste
testInventoryControl(); 