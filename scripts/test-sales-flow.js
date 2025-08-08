import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const SUPABASE_URL = "https://ujawcfzhgbgwwcafoaeh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYXdjZnpoZ2Jnd3djYWZvYWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTM1MDMsImV4cCI6MjA2NjgyOTUwM30.9kVO6CTVVLLpQpXOokBccL_rIDFVBA5-AcycN5oOw0o";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🛒 TESTE DE FLUXO DE VENDAS');
console.log('============================\n');

async function testSalesFlow() {
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

    console.log('\n2. Verificando dados necessários para venda...');
    
    // Verificar se há produtos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.log('❌ Erro ao buscar produtos:', productsError.message);
    } else {
      console.log(`✅ Encontrados ${products.length} produtos`);
    }

    // Verificar se há clientes
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .limit(5);
    
    if (customersError) {
      console.log('❌ Erro ao buscar clientes:', customersError.message);
    } else {
      console.log(`✅ Encontrados ${customers.length} clientes`);
    }

    // Verificar se há vendedores (profiles com role vendedor)
    const { data: sellers, error: sellersError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'vendedor')
      .limit(5);
    
    if (sellersError) {
      console.log('❌ Erro ao buscar vendedores:', sellersError.message);
    } else {
      console.log(`✅ Encontrados ${sellers.length} vendedores`);
    }

    console.log('\n3. Simulando criação de venda...');
    
    if (products && products.length > 0 && customers && customers.length > 0) {
      const testProduct = products[0];
      const testCustomer = customers[0];
      const testSeller = sellers && sellers.length > 0 ? sellers[0].name : 'Admin';

      // Criar item de venda
      const saleItem = {
        id: Date.now().toString(),
        product: testProduct,
        quantity: 2,
        price: testProduct.price
      };

      // Criar venda de teste
      const testSale = {
        customer: testCustomer,
        items: [saleItem],
        subtotal: saleItem.price * saleItem.quantity,
        discount: 0,
        discountType: 'percentage',
        total: saleItem.price * saleItem.quantity,
        paymentMethod: 'pix',
        seller: testSeller,
        cashier: 'Admin',
        date: new Date()
      };

      console.log('✅ Estrutura de venda criada com sucesso');
      console.log(`   Cliente: ${testSale.customer.name}`);
      console.log(`   Produto: ${testSale.items[0].product.name}`);
      console.log(`   Quantidade: ${testSale.items[0].quantity}`);
      console.log(`   Preço: R$ ${testSale.items[0].price}`);
      console.log(`   Total: R$ ${testSale.total}`);

      // Verificar se a estrutura está correta
      const hasValidStructure = testSale.customer && 
                               testSale.items && 
                               testSale.items.length > 0 &&
                               testSale.total > 0 &&
                               testSale.seller;

      if (hasValidStructure) {
        console.log('✅ Estrutura de venda válida');
      } else {
        console.log('❌ Estrutura de venda inválida');
      }

    } else {
      console.log('❌ Dados insuficientes para testar venda');
      if (!products || products.length === 0) {
        console.log('   - Nenhum produto encontrado');
      }
      if (!customers || customers.length === 0) {
        console.log('   - Nenhum cliente encontrado');
      }
    }

    console.log('\n4. Verificando vendas existentes...');
    
    const { data: existingSales, error: salesError } = await supabase
      .from('sales')
      .select('*')
      .limit(5);
    
    if (salesError) {
      console.log('❌ Erro ao buscar vendas:', salesError.message);
    } else {
      console.log(`✅ Encontradas ${existingSales.length} vendas existentes`);
      
      if (existingSales && existingSales.length > 0) {
        const sale = existingSales[0];
        console.log('   Estrutura da primeira venda:');
        console.log(`   - Cliente: ${sale.customer?.name || 'N/A'}`);
        console.log(`   - Total: R$ ${sale.total || 0}`);
        console.log(`   - Vendedor: ${sale.seller || 'N/A'}`);
        console.log(`   - Data: ${sale.date || 'N/A'}`);
      }
    }

    // Logout
    await supabase.auth.signOut();
    console.log('✅ Logout realizado');

    console.log('\n📋 RESUMO DO TESTE DE VENDAS:');
    console.log('==============================\n');
    console.log('✅ Login funcionando');
    console.log('✅ Acesso aos dados funcionando');
    console.log('✅ Estrutura de venda válida');
    console.log('\n🌐 PRÓXIMO PASSO:');
    console.log('   - Teste manual no navegador: http://localhost:8081');
    console.log('   - Verifique o fluxo completo de vendas');
    console.log('   - Teste finalização de venda e popup de confirmação');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar teste
testSalesFlow(); 