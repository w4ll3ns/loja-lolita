import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, Customer, Sale, User, Seller, StoreSettings, NotificationSettings, SecuritySettings } from '@/types/store';

export const useSupabaseStore = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  
  // Dropdown data
  const [categories, setCategories] = useState<string[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  
  // XML import tracking
  const [importedXmlHashes, setImportedXmlHashes] = useState<string[]>([]);

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      loadProducts(),
      loadCustomers(),
      loadSales(),
      loadUsers(),
      loadSellers(),
      loadStoreSettings(),
      loadNotificationSettings(),
      loadSecuritySettings(),
      loadCategories(),
      loadCollections(),
      loadSuppliers(),
      loadBrands(),
      loadColors(),
      loadSizes(),
      loadCities(),
      loadImportedXmlHashes()
    ]);
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

  const loadStoreSettings = async () => {
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
  };

  const loadNotificationSettings = async () => {
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
  };

  const loadSecuritySettings = async () => {
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

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('name');

    if (error) {
      console.error('Error loading categories:', error);
      return;
    }

    setCategories(data.map(item => item.name));
  };

  const loadCollections = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select('name');

    if (error) {
      console.error('Error loading collections:', error);
      return;
    }

    setCollections(data.map(item => item.name));
  };

  const loadSuppliers = async () => {
    const { data, error } = await supabase
      .from('suppliers')
      .select('name');

    if (error) {
      console.error('Error loading suppliers:', error);
      return;
    }

    setSuppliers(data.map(item => item.name));
  };

  const loadBrands = async () => {
    const { data, error } = await supabase
      .from('brands')
      .select('name');

    if (error) {
      console.error('Error loading brands:', error);
      return;
    }

    setBrands(data.map(item => item.name));
  };

  const loadColors = async () => {
    const { data, error } = await supabase
      .from('colors')
      .select('name');

    if (error) {
      console.error('Error loading colors:', error);
      return;
    }

    setColors(data.map(item => item.name));
  };

  const loadSizes = async () => {
    const { data, error } = await supabase
      .from('sizes')
      .select('name');

    if (error) {
      console.error('Error loading sizes:', error);
      return;
    }

    setSizes(data.map(item => item.name));
  };

  const loadCities = async () => {
    const { data, error } = await supabase
      .from('cities')
      .select('name');

    if (error) {
      console.error('Error loading cities:', error);
      return;
    }

    setCities(data.map(item => item.name));
  };

  const loadImportedXmlHashes = async () => {
    const { data, error } = await supabase
      .from('imported_xml_hashes')
      .select('hash');

    if (error) {
      console.error('Error loading XML hashes:', error);
      return;
    }

    setImportedXmlHashes(data.map(item => item.hash));
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
    
    // Dropdown data
    categories,
    collections,
    suppliers,
    brands,
    colors,
    sizes,
    cities,
    
    // XML import tracking
    importedXmlHashes,
    
    // Setters
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
    setCities,
    setImportedXmlHashes,
    
    // Methods
    loadAllData,
    loadProducts,
    loadCustomers,
    loadSales
  };
};
