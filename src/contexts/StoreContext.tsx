import React, { createContext, useContext, useState } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  collection: string;
  size: string;
  supplier: string;
  brand: string;
  quantity: number;
  image?: string;
  barcode: string;
  color: string;
  gender: 'Masculino' | 'Feminino' | 'Unissex';
}

export interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  gender: 'M' | 'F' | 'Outro';
  city?: string;
  wantedToRegister?: boolean;
  isGeneric?: boolean;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
}

export interface SaleItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  customer: Customer;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  discountType: 'percentage' | 'value';
  total: number;
  paymentMethod: 'pix' | 'debito' | 'credito';
  seller: string;
  cashier: string;
  date: Date;
}

interface StoreContextType {
  products: Product[];
  customers: Customer[];
  sellers: Seller[];
  sales: Sale[];
  categories: string[];
  collections: string[];
  suppliers: string[];
  brands: string[];
  cities: string[];
  colors: string[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  addSeller: (seller: Omit<Seller, 'id'>) => void;
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  searchCustomers: (query: string) => Customer[];
  searchProductByBarcode: (barcode: string) => Product | null;
  searchProducts: (query: string) => Product[];
  createTemporaryProduct: (barcode: string, price?: number) => Product;
  addCategory: (category: string) => void;
  addCollection: (collection: string) => void;
  addSupplier: (supplier: string) => void;
  addBrand: (brand: string) => void;
  addColor: (color: string) => void;
  getIncompleteProducts: () => Product[];
  duplicateProduct: (product: Product) => Omit<Product, 'id'>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Dados iniciais mock
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Camiseta Básica',
    description: 'Camiseta 100% algodão',
    price: 49.90,
    category: 'Camisetas',
    collection: 'Verão 2024',
    size: 'M',
    supplier: 'Fornecedor A',
    brand: 'Marca X',
    quantity: 50,
    barcode: '7891234567890',
    color: 'Branco',
    gender: 'Unissex'
  },
  {
    id: '2',
    name: 'Calça Jeans',
    description: 'Calça jeans slim fit',
    price: 129.90,
    category: 'Calças',
    collection: 'Inverno 2024',
    size: '42',
    supplier: 'Fornecedor B',
    brand: 'Marca Y',
    quantity: 25,
    barcode: '7891234567891',
    color: 'Azul',
    gender: 'Feminino'
  }
];

const initialCustomers: Customer[] = [
  {
    id: 'generic',
    name: 'Cliente Padrão',
    whatsapp: '(00) 00000-0000',
    gender: 'Outro',
    isGeneric: true
  }
];

const initialSellers: Seller[] = [
  { id: '1', name: 'Maria Silva', email: 'maria@loja.com', phone: '(11) 99999-1234', active: true },
  { id: '2', name: 'João Santos', email: 'joao@loja.com', phone: '(11) 99999-5678', active: true },
  { id: '3', name: 'Ana Costa', email: 'ana@loja.com', phone: '(11) 99999-9012', active: true }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [sellers, setSellers] = useState<Seller[]>(initialSellers);
  const [sales, setSales] = useState<Sale[]>([]);
  const [categories, setCategories] = useState<string[]>(['Camisetas', 'Calças', 'Vestidos', 'Sapatos']);
  const [collections, setCollections] = useState<string[]>(['Verão 2024', 'Inverno 2024', 'Primavera 2024']);
  const [suppliers, setSuppliers] = useState<string[]>(['Fornecedor A', 'Fornecedor B', 'Fornecedor C']);
  const [brands, setBrands] = useState<string[]>(['Marca X', 'Marca Y', 'Marca Z']);
  const [cities, setCities] = useState<string[]>(['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Fortaleza']);
  const [colors, setColors] = useState<string[]>(['Branco', 'Preto', 'Azul', 'Vermelho', 'Verde', 'Amarelo', 'Rosa', 'Cinza', 'Marrom', 'Roxo']);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = { ...customer, id: Date.now().toString() };
    setCustomers(prev => [...prev, newCustomer]);
    
    // Adicionar cidade se não existir
    if (customer.city && !cities.includes(customer.city)) {
      setCities(prev => [...prev, customer.city!]);
    }
  };

  const addSeller = (seller: Omit<Seller, 'id'>) => {
    const newSeller = { ...seller, id: Date.now().toString() };
    setSellers(prev => [...prev, newSeller]);
  };

  const addSale = (sale: Omit<Sale, 'id' | 'date'>) => {
    const newSale = { ...sale, id: Date.now().toString(), date: new Date() };
    setSales(prev => [newSale, ...prev]);
    
    // Reduzir estoque e criar produtos temporários se necessário
    sale.items.forEach(item => {
      if (item.product.category === 'Temporário' && item.product.quantity === 1) {
        // Produto temporário criado durante a venda, não reduzir estoque
        // Mas marcar como vendido pelo menos uma vez
        updateProduct(item.product.id, { 
          description: `Produto criado em venda - ${newSale.date.toLocaleDateString()} - Necessita edição completa`
        });
      } else {
        // Produto normal, reduzir estoque
        updateProduct(item.product.id, { 
          quantity: Math.max(0, item.product.quantity - item.quantity)
        });
      }
    });
  };

  const searchCustomers = (query: string): Customer[] => {
    if (!query || query.trim().length === 0) {
      return [];
    }
    
    const searchTerm = query.toLowerCase().trim();
    const cleanSearchTerm = query.replace(/\D/g, ''); // Remove caracteres não numéricos para buscar WhatsApp
    
    return customers.filter(customer => {
      if (customer.isGeneric) return false;
      
      const nameMatch = customer.name.toLowerCase().includes(searchTerm);
      const whatsappMatch = customer.whatsapp.replace(/\D/g, '').includes(cleanSearchTerm);
      
      return nameMatch || (cleanSearchTerm.length > 0 && whatsappMatch);
    });
  };

  const searchProductByBarcode = (barcode: string): Product | null => {
    return products.find(product => product.barcode === barcode) || null;
  };

  const searchProducts = (query: string): Product[] => {
    return products.filter(product =>
      product.barcode.toLowerCase().includes(query.toLowerCase()) ||
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const createTemporaryProduct = (barcode: string, price: number = 0): Product => {
    const temporaryProduct: Product = {
      id: Date.now().toString(),
      name: `🔧 Produto não cadastrado`,
      description: 'Produto temporário criado durante a venda. Necessita edição completa dos dados.',
      price: price,
      category: 'Temporário',
      collection: 'Temporário',
      size: 'N/A',
      supplier: 'A definir',
      brand: 'A definir',
      quantity: 1, // Produto temporário sempre tem quantidade 1 inicialmente
      barcode: barcode,
      color: 'A definir',
      gender: 'Unissex'
    };
    
    setProducts(prev => [...prev, temporaryProduct]);
    
    // Adicionar categoria temporária se não existir
    if (!categories.includes('Temporário')) {
      setCategories(prev => [...prev, 'Temporário']);
    }
    
    return temporaryProduct;
  };

  const getIncompleteProducts = (): Product[] => {
    return products.filter(product => product.category === 'Temporário');
  };

  const duplicateProduct = (product: Product): Omit<Product, 'id'> => {
    return {
      name: `${product.name} (Cópia)`,
      description: product.description,
      price: product.price,
      category: product.category,
      collection: product.collection,
      size: product.size,
      supplier: product.supplier,
      brand: product.brand,
      quantity: product.quantity,
      barcode: '', // Limpar código de barras para evitar duplicação
      color: product.color,
      gender: product.gender,
      image: product.image
    };
  };

  const addColor = (color: string) => {
    if (!colors.includes(color)) {
      setColors(prev => [...prev, color]);
    }
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const addCollection = (collection: string) => {
    if (!collections.includes(collection)) {
      setCollections(prev => [...prev, collection]);
    }
  };

  const addSupplier = (supplier: string) => {
    if (!suppliers.includes(supplier)) {
      setSuppliers(prev => [...prev, supplier]);
    }
  };

  const addBrand = (brand: string) => {
    if (!brands.includes(brand)) {
      setBrands(prev => [...prev, brand]);
    }
  };

  return (
    <StoreContext.Provider value={{
      products,
      customers,
      sellers,
      sales,
      categories,
      collections,
      suppliers,
      brands,
      cities,
      colors,
      addProduct,
      updateProduct,
      deleteProduct,
      addCustomer,
      addSeller,
      addSale,
      searchCustomers,
      searchProductByBarcode,
      searchProducts,
      createTemporaryProduct,
      addCategory,
      addCollection,
      addSupplier,
      addBrand,
      addColor,
      getIncompleteProducts,
      duplicateProduct
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
