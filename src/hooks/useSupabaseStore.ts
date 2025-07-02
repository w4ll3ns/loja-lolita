
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, Customer, Sale, User, Seller, StoreSettings, NotificationSettings, SecuritySettings } from '@/types/store';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseStore = () => {
  const { toast } = useToast();

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);

  // Customers & Sales
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // Users & Sellers
  const [users, setUsers] = useState<User[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);

  // Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      await Promise.all([
        loadProducts(),
        loadCustomers(),
        loadSales(),
        loadUsers(),
        loadSellers(),
        loadSettings(),
        loadDropdownData()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do sistema",
        variant: "destructive"
      });
    }
  };

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading products:', error);
      return;
    }

    const formattedProducts: Product[] = data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      costPrice: Number(product.cost_price),
      category: product.category,
      collection: product.collection,
      size: product.size,
      supplier: product.supplier,
      brand: product.brand,
      quantity: product.quantity,
      image: product.image || undefined,
      barcode: product.barcode,
      color: product.color,
      gender: product.gender as 'Masculino' | 'Feminino' | 'Unissex'
    }));

    setProducts(formattedProducts);
  };

  const loadCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading customers:', error);
      return;
    }

    const formattedCustomers: Customer[] = data.map(customer => ({
      id: customer.id,
      name: customer.name,
      whatsapp: customer.whatsapp,
      gender: customer.gender as 'M' | 'F' | 'Outro',
      city: customer.city || undefined,
      wantedToRegister: customer.wanted_to_register || undefined,
      isGeneric: customer.is_generic || undefined
    }));

    setCustomers(formattedCustomers);
  };

  const loadSales = async () => {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        customer:customers(*),
        sale_items(
          *,
          product:products(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading sales:', error);
      return;
    }

    const formattedSales: Sale[] = data.map(sale => ({
      id: sale.id,
      customer: {
        id: sale.customer.id,
        name: sale.customer.name,
        whatsapp: sale.customer.whatsapp,
        gender: sale.customer.gender as 'M' | 'F' | 'Outro',
        city: sale.customer.city || undefined,
        wantedToRegister: sale.customer.wanted_to_register || undefined,
        isGeneric: sale.customer.is_generic || undefined
      },
      items: sale.sale_items.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: Number(item.product.price),
          costPrice: Number(item.product.cost_price),
          category: item.product.category,
          collection: item.product.collection,
          size: item.product.size,
          supplier: item.product.supplier,
          brand: item.product.brand,
          quantity: item.product.quantity,
          image: item.product.image || undefined,
          barcode: item.product.barcode,
          color: item.product.color,
          gender: item.product.gender as 'Masculino' | 'Feminino' | 'Unissex'
        },
        quantity: item.quantity,
        price: Number(item.price)
      })),
      subtotal: Number(sale.subtotal),
      discount: Number(sale.discount),
      discountType: sale.discount_type as 'percentage' | 'value',
      total: Number(sale.total),
      paymentMethod: sale.payment_method as 'pix' | 'debito' | 'credito',
      seller: sale.seller,
      cashier: sale.cashier,
      date: new Date(sale.date)
    }));

    setSales(formattedSales);
  };

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading users:', error);
      return;
    }

    const formattedUsers: User[] = data.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as 'admin' | 'vendedor' | 'caixa' | 'consultivo',
      active: user.active,
      createdAt: new Date(user.created_at)
    }));

    setUsers(formattedUsers);
  };

  const loadSellers = async () => {
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading sellers:', error);
      return;
    }

    const formattedSellers: Seller[] = data.map(seller => ({
      id: seller.id,
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      active: seller.active
    }));

    setSellers(formattedSellers);
  };

  const loadSettings = async () => {
    // Store Settings
    const { data: storeData, error: storeError } = await supabase
      .from('store_settings')
      .select('*')
      .single();

    if (!storeError && storeData) {
      setStoreSettings({
        name: storeData.name,
        address: storeData.address,
        phone: storeData.phone,
        email: storeData.email,
        instagram: storeData.instagram,
        facebook: storeData.facebook,
        hours: storeData.hours,
        logo: storeData.logo || undefined
      });
    }

    // Notification Settings
    const { data: notifData, error: notifError } = await supabase
      .from('notification_settings')
      .select('*')
      .single();

    if (!notifError && notifData) {
      setNotificationSettings({
        lowStockAlert: notifData.low_stock_alert,
        lowStockQuantity: notifData.low_stock_quantity,
        thankYouMessage: notifData.thank_you_message,
        birthdayMessage: notifData.birthday_message,
        whatsappNotifications: notifData.whatsapp_notifications,
        emailNotifications: notifData.email_notifications,
        alertFrequency: notifData.alert_frequency as 'realtime' | 'daily' | 'weekly',
        alertTime: notifData.alert_time
      });
    }

    // Security Settings
    const { data: secData, error: secError } = await supabase
      .from('security_settings')
      .select('*')
      .single();

    if (!secError && secData) {
      setSecuritySettings({
        minPasswordLength: secData.min_password_length,
        passwordExpiration: secData.password_expiration,
        requireSpecialChars: secData.require_special_chars,
        requireNumbers: secData.require_numbers,
        twoFactorAuth: secData.two_factor_auth,
        sessionTimeout: secData.session_timeout,
        multipleLogins: secData.multiple_logins,
        maxSessions: secData.max_sessions
      });
    }
  };

  const loadDropdownData = async () => {
    const promises = [
      supabase.from('categories').select('name'),
      supabase.from('collections').select('name'),
      supabase.from('suppliers').select('name'),
      supabase.from('brands').select('name'),
      supabase.from('colors').select('name'),
      supabase.from('sizes').select('name'),
      supabase.from('cities').select('name')
    ];

    const results = await Promise.all(promises);
    
    if (results[0].data) setCategories(results[0].data.map(item => item.name));
    if (results[1].data) setCollections(results[1].data.map(item => item.name));
    if (results[2].data) setSuppliers(results[2].data.map(item => item.name));
    if (results[3].data) setBrands(results[3].data.map(item => item.name));
    if (results[4].data) setColors(results[4].data.map(item => item.name));
    if (results[5].data) setSizes(results[5].data.map(item => item.name));
    if (results[6].data) setCities(results[6].data.map(item => item.name));
  };

  return {
    // Data
    products,
    customers,
    sales,
    users,
    sellers,
    storeSettings,
    notificationSettings,
    securitySettings,
    categories,
    collections,
    suppliers,
    brands,
    colors,
    sizes,
    cities,
    
    // Methods
    loadAllData,
    loadProducts,
    loadCustomers,
    loadSales,
    loadUsers,
    loadSellers,
    loadSettings,
    loadDropdownData,
    
    // State setters for direct updates
    setProducts,
    setCustomers,
    setSales,
    setUsers,
    setSellers,
    setStoreSettings,
    setNotificationSettings,
    setSecuritySettings,
    setCategories,
    setCollections,
    setSuppliers,
    setBrands,
    setColors,
    setSizes,
    setCities
  };
};
