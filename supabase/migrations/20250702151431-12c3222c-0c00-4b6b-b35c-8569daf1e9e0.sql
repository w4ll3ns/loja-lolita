
-- Create custom types/enums
CREATE TYPE public.user_role AS ENUM ('admin', 'vendedor', 'caixa', 'consultivo');
CREATE TYPE public.customer_gender AS ENUM ('M', 'F', 'Outro');
CREATE TYPE public.product_gender AS ENUM ('Masculino', 'Feminino', 'Unissex');
CREATE TYPE public.payment_method AS ENUM ('pix', 'debito', 'credito');
CREATE TYPE public.discount_type AS ENUM ('percentage', 'value');
CREATE TYPE public.alert_frequency AS ENUM ('realtime', 'daily', 'weekly');

-- Create Products table
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    cost_price DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (cost_price >= 0),
    category TEXT NOT NULL DEFAULT 'Geral',
    collection TEXT NOT NULL DEFAULT 'Padrão',
    size TEXT NOT NULL DEFAULT 'Único',
    supplier TEXT NOT NULL DEFAULT 'Fornecedor Padrão',
    brand TEXT NOT NULL DEFAULT 'Marca Padrão',
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    image TEXT,
    barcode TEXT UNIQUE NOT NULL,
    color TEXT NOT NULL DEFAULT 'Sem cor',
    gender product_gender NOT NULL DEFAULT 'Unissex',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Customers table
CREATE TABLE public.customers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    whatsapp TEXT NOT NULL DEFAULT '',
    gender customer_gender NOT NULL DEFAULT 'Outro',
    city TEXT,
    wanted_to_register BOOLEAN DEFAULT false,
    is_generic BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Sellers table
CREATE TABLE public.sellers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Users table
CREATE TABLE public.users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    role user_role NOT NULL DEFAULT 'vendedor',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Sales table
CREATE TABLE public.sales (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    discount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
    discount_type discount_type NOT NULL DEFAULT 'value',
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    payment_method payment_method NOT NULL,
    seller TEXT NOT NULL,
    cashier TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Sale Items table (junction table for sales and products)
CREATE TABLE public.sale_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Delete Logs table
CREATE TABLE public.delete_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    reason TEXT,
    required_password BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Store Settings table
CREATE TABLE public.store_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Minha Loja',
    address TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    instagram TEXT NOT NULL DEFAULT '',
    facebook TEXT NOT NULL DEFAULT '',
    hours TEXT NOT NULL DEFAULT '',
    logo TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Notification Settings table
CREATE TABLE public.notification_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    low_stock_alert BOOLEAN NOT NULL DEFAULT true,
    low_stock_quantity INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_quantity >= 0),
    thank_you_message BOOLEAN NOT NULL DEFAULT true,
    birthday_message BOOLEAN NOT NULL DEFAULT false,
    whatsapp_notifications BOOLEAN NOT NULL DEFAULT true,
    email_notifications BOOLEAN NOT NULL DEFAULT false,
    alert_frequency alert_frequency NOT NULL DEFAULT 'daily',
    alert_time TIME NOT NULL DEFAULT '09:00',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Security Settings table
CREATE TABLE public.security_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    min_password_length INTEGER NOT NULL DEFAULT 6 CHECK (min_password_length >= 4),
    password_expiration INTEGER NOT NULL DEFAULT 90 CHECK (password_expiration > 0),
    require_special_chars BOOLEAN NOT NULL DEFAULT false,
    require_numbers BOOLEAN NOT NULL DEFAULT true,
    two_factor_auth BOOLEAN NOT NULL DEFAULT false,
    session_timeout INTEGER NOT NULL DEFAULT 480 CHECK (session_timeout > 0),
    multiple_logins BOOLEAN NOT NULL DEFAULT true,
    max_sessions INTEGER NOT NULL DEFAULT 3 CHECK (max_sessions > 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Role Permissions table
CREATE TABLE public.role_permissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    role user_role NOT NULL UNIQUE,
    can_create_products BOOLEAN NOT NULL DEFAULT false,
    can_edit_products BOOLEAN NOT NULL DEFAULT false,
    can_delete_products BOOLEAN NOT NULL DEFAULT false,
    can_view_products BOOLEAN NOT NULL DEFAULT true,
    can_create_customers BOOLEAN NOT NULL DEFAULT false,
    can_edit_customers BOOLEAN NOT NULL DEFAULT false,
    can_delete_customers BOOLEAN NOT NULL DEFAULT false,
    can_view_customers BOOLEAN NOT NULL DEFAULT true,
    can_create_sales BOOLEAN NOT NULL DEFAULT false,
    can_edit_sales BOOLEAN NOT NULL DEFAULT false,
    can_delete_sales BOOLEAN NOT NULL DEFAULT false,
    can_view_sales BOOLEAN NOT NULL DEFAULT true,
    can_view_reports BOOLEAN NOT NULL DEFAULT false,
    can_manage_users BOOLEAN NOT NULL DEFAULT false,
    can_manage_settings BOOLEAN NOT NULL DEFAULT false,
    can_import_products BOOLEAN NOT NULL DEFAULT false,
    can_export_data BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Data Categories tables for dropdown options
CREATE TABLE public.categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.collections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.suppliers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.brands (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.colors (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.sizes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.cities (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create XML Import Tracking table
CREATE TABLE public.imported_xml_hashes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    hash TEXT UNIQUE NOT NULL,
    imported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial data for categories
INSERT INTO public.categories (name) VALUES 
('Calçados'), ('Roupas'), ('Acessórios'), ('Esportivos'), ('Casual'), ('Formal');

-- Insert initial data for collections
INSERT INTO public.collections (name) VALUES 
('Verão 2024'), ('Inverno 2024'), ('Básicos'), ('Premium'), ('Outlet');

-- Insert initial data for suppliers
INSERT INTO public.suppliers (name) VALUES 
('Nike Brasil'), ('Adidas Brasil'), ('Puma Brasil'), ('Mizuno'), ('Olympikus'), ('Fornecedor Local');

-- Insert initial data for brands
INSERT INTO public.brands (name) VALUES 
('Nike'), ('Adidas'), ('Puma'), ('Mizuno'), ('Olympikus'), ('Marca Própria');

-- Insert initial data for colors
INSERT INTO public.colors (name) VALUES 
('Preto'), ('Branco'), ('Azul'), ('Vermelho'), ('Verde'), ('Amarelo'), ('Rosa'), ('Roxo'), ('Cinza'), ('Marrom');

-- Insert initial data for sizes
INSERT INTO public.sizes (name) VALUES 
('PP'), ('P'), ('M'), ('G'), ('GG'), ('XGG'), ('34'), ('35'), ('36'), ('37'), ('38'), ('39'), ('40'), ('41'), ('42'), ('43'), ('44'), ('45'), ('46');

-- Insert initial data for cities
INSERT INTO public.cities (name) VALUES 
('São Paulo'), ('Rio de Janeiro'), ('Belo Horizonte'), ('Salvador'), ('Brasília'), ('Fortaleza'), ('Recife'), ('Porto Alegre'), ('Curitiba'), ('Goiânia');

-- Insert initial role permissions
INSERT INTO public.role_permissions (role, can_create_products, can_edit_products, can_delete_products, can_view_products, can_create_customers, can_edit_customers, can_delete_customers, can_view_customers, can_create_sales, can_edit_sales, can_delete_sales, can_view_sales, can_view_reports, can_manage_users, can_manage_settings, can_import_products, can_export_data) VALUES
('admin', true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true),
('vendedor', true, true, false, true, true, true, false, true, true, true, false, true, false, false, false, true, false),
('caixa', false, false, false, true, true, false, false, true, true, false, false, true, false, false, false, false, false),
('consultivo', false, false, false, true, false, false, false, true, false, false, false, true, true, false, false, false, true);

-- Insert initial store settings
INSERT INTO public.store_settings (name, address, phone, email, instagram, facebook, hours) VALUES
('Minha Loja', 'Rua das Flores, 123 - Centro', '(11) 3333-4444', 'contato@minhaloja.com', '@minhaloja', 'MinhaLojaOficial', 'Segunda a Sexta: 9h às 18h | Sábado: 9h às 17h');

-- Insert initial notification settings
INSERT INTO public.notification_settings DEFAULT VALUES;

-- Insert initial security settings
INSERT INTO public.security_settings DEFAULT VALUES;

-- Create indexes for better performance
CREATE INDEX idx_products_barcode ON public.products(barcode);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_brand ON public.products(brand);
CREATE INDEX idx_customers_name ON public.customers(name);
CREATE INDEX idx_sales_date ON public.sales(date);
CREATE INDEX idx_sales_customer_id ON public.sales(customer_id);
CREATE INDEX idx_sale_items_sale_id ON public.sale_items(sale_id);
CREATE INDEX idx_sale_items_product_id ON public.sale_items(product_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_sellers_updated_at BEFORE UPDATE ON public.sellers FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_store_settings_updated_at BEFORE UPDATE ON public.store_settings FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON public.notification_settings FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_security_settings_updated_at BEFORE UPDATE ON public.security_settings FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_role_permissions_updated_at BEFORE UPDATE ON public.role_permissions FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Enable Row Level Security on all tables (optional - can be configured later)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delete_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imported_xml_hashes ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for now (you can restrict these later based on authentication)
CREATE POLICY "Allow all operations" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.sellers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.sale_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.delete_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.notification_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.security_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.role_permissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.collections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.brands FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.colors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.sizes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.cities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.imported_xml_hashes FOR ALL USING (true) WITH CHECK (true);
