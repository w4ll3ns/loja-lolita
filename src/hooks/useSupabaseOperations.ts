
import { supabase } from '@/integrations/supabase/client';
import { Product, Customer, Sale, User, Seller } from '@/types/store';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseOperations = () => {
  const { toast } = useToast();

  // Product operations
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        cost_price: productData.costPrice,
        category: productData.category,
        collection: productData.collection,
        size: productData.size,
        supplier: productData.supplier,
        brand: productData.brand,
        quantity: productData.quantity,
        image: productData.image,
        barcode: productData.barcode,
        color: productData.color,
        gender: productData.gender
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar produto",
        variant: "destructive"
      });
      return null;
    }

    toast({
      title: "Sucesso",
      description: "Produto adicionado com sucesso"
    });

    return data;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const { error } = await supabase
      .from('products')
      .update({
        ...(updates.name && { name: updates.name }),
        ...(updates.description && { description: updates.description }),
        ...(updates.price !== undefined && { price: updates.price }),
        ...(updates.costPrice !== undefined && { cost_price: updates.costPrice }),
        ...(updates.category && { category: updates.category }),
        ...(updates.collection && { collection: updates.collection }),
        ...(updates.size && { size: updates.size }),
        ...(updates.supplier && { supplier: updates.supplier }),
        ...(updates.brand && { brand: updates.brand }),
        ...(updates.quantity !== undefined && { quantity: updates.quantity }),
        ...(updates.image !== undefined && { image: updates.image }),
        ...(updates.barcode && { barcode: updates.barcode }),
        ...(updates.color && { color: updates.color }),
        ...(updates.gender && { gender: updates.gender })
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar produto",
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Sucesso",
      description: "Produto atualizado com sucesso"
    });

    return true;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir produto",
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Sucesso",
      description: "Produto excluído com sucesso"
    });

    return true;
  };

  // Customer operations
  const addCustomer = async (customerData: Omit<Customer, 'id'>) => {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: customerData.name,
        whatsapp: customerData.whatsapp,
        gender: customerData.gender,
        city: customerData.city,
        wanted_to_register: customerData.wantedToRegister,
        is_generic: customerData.isGeneric
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding customer:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar cliente",
        variant: "destructive"
      });
      return null;
    }

    toast({
      title: "Sucesso",
      description: "Cliente adicionado com sucesso"
    });

    return data;
  };

  // Sale operations
  const addSale = async (saleData: Omit<Sale, 'id' | 'date'>) => {
    try {
      // First, insert the sale
      const { data: saleRecord, error: saleError } = await supabase
        .from('sales')
        .insert({
          customer_id: saleData.customer.id,
          subtotal: saleData.subtotal,
          discount: saleData.discount,
          discount_type: saleData.discountType,
          total: saleData.total,
          payment_method: saleData.paymentMethod,
          seller: saleData.seller,
          cashier: saleData.cashier
        })
        .select()
        .single();

      if (saleError) {
        console.error('Error adding sale:', saleError);
        toast({
          title: "Erro",
          description: "Erro ao adicionar venda",
          variant: "destructive"
        });
        return null;
      }

      // Then, insert sale items
      const saleItems = saleData.items.map(item => ({
        sale_id: saleRecord.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) {
        console.error('Error adding sale items:', itemsError);
        // Rollback sale if items fail
        await supabase.from('sales').delete().eq('id', saleRecord.id);
        toast({
          title: "Erro",
          description: "Erro ao adicionar itens da venda",
          variant: "destructive"
        });
        return null;
      }

      // Update product quantities
      for (const item of saleData.items) {
        await supabase
          .from('products')
          .update({ 
            quantity: Math.max(0, item.product.quantity - item.quantity)
          })
          .eq('id', item.product.id);
      }

      toast({
        title: "Sucesso",
        description: "Venda realizada com sucesso"
      });

      return saleRecord;
    } catch (error) {
      console.error('Error in sale transaction:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar venda",
        variant: "destructive"
      });
      return null;
    }
  };

  // Add dropdown data - Fixed table name handling
  const addDropdownItem = async (tableName: string, name: string) => {
    // Map of valid table names to ensure type safety
    const validTables = {
      'categories': 'categories',
      'collections': 'collections', 
      'suppliers': 'suppliers',
      'brands': 'brands',
      'colors': 'colors',
      'sizes': 'sizes',
      'cities': 'cities'
    } as const;

    const table = validTables[tableName as keyof typeof validTables];
    
    if (!table) {
      console.error('Invalid table name:', tableName);
      return false;
    }

    const { error } = await supabase
      .from(table)
      .insert({ name });

    if (error) {
      console.error(`Error adding ${table} item:`, error);
      toast({
        title: "Erro",
        description: `Erro ao adicionar ${table}`,
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Sucesso",
      description: "Item adicionado com sucesso"
    });

    return true;
  };

  const generateUniqueId = () => {
    return crypto.randomUUID();
  };

  const searchCustomers = (customers: Customer[], query: string) => {
    if (!query.trim()) return customers;
    
    const searchTerm = query.toLowerCase();
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.whatsapp.includes(searchTerm)
    );
  };

  // Update dropdown data
  const updateDropdownItem = async (tableName: string, oldName: string, newName: string) => {
    const validTables = {
      'categories': 'categories',
      'collections': 'collections', 
      'suppliers': 'suppliers',
      'brands': 'brands',
      'colors': 'colors',
      'sizes': 'sizes',
      'cities': 'cities'
    } as const;

    const table = validTables[tableName as keyof typeof validTables];
    
    if (!table) {
      console.error('Invalid table name:', tableName);
      return false;
    }

    const { error } = await supabase
      .from(table)
      .update({ name: newName })
      .eq('name', oldName);

    if (error) {
      console.error(`Error updating ${table} item:`, error);
      toast({
        title: "Erro",
        description: `Erro ao atualizar ${table}`,
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Sucesso",
      description: "Item atualizado com sucesso"
    });

    return true;
  };

  // Delete dropdown data
  const deleteDropdownItem = async (tableName: string, name: string) => {
    const validTables = {
      'categories': 'categories',
      'collections': 'collections', 
      'suppliers': 'suppliers',
      'brands': 'brands',
      'colors': 'colors',
      'sizes': 'sizes',
      'cities': 'cities'
    } as const;

    const table = validTables[tableName as keyof typeof validTables];
    
    if (!table) {
      console.error('Invalid table name:', tableName);
      return false;
    }

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('name', name);

    if (error) {
      console.error(`Error deleting ${table} item:`, error);
      toast({
        title: "Erro",
        description: `Erro ao excluir ${table}`,
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Sucesso",
      description: "Item excluído com sucesso"
    });

    return true;
  };

  // Load sales method for useSalesLogic
  const loadSales = async () => {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        customer:customers(*),
        items:sale_items(
          *,
          product:products(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading sales:', error);
      return;
    }

    return data;
  };

  return {
    addProduct,
    updateProduct,
    deleteProduct,
    addCustomer,
    addSale,
    loadSales,
    addDropdownItem,
    updateDropdownItem,
    deleteDropdownItem,
    generateUniqueId,
    searchCustomers
  };
};
