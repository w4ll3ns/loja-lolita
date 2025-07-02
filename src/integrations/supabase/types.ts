export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      collections: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      colors: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          city: string | null
          created_at: string
          gender: Database["public"]["Enums"]["customer_gender"]
          id: string
          is_generic: boolean | null
          name: string
          updated_at: string
          wanted_to_register: boolean | null
          whatsapp: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          gender?: Database["public"]["Enums"]["customer_gender"]
          id?: string
          is_generic?: boolean | null
          name: string
          updated_at?: string
          wanted_to_register?: boolean | null
          whatsapp?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          gender?: Database["public"]["Enums"]["customer_gender"]
          id?: string
          is_generic?: boolean | null
          name?: string
          updated_at?: string
          wanted_to_register?: boolean | null
          whatsapp?: string
        }
        Relationships: []
      }
      delete_logs: {
        Row: {
          created_at: string
          date: string
          id: string
          product_id: string
          product_name: string
          reason: string | null
          required_password: boolean
          user_id: string
          user_name: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          product_id: string
          product_name: string
          reason?: string | null
          required_password?: boolean
          user_id: string
          user_name: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          product_id?: string
          product_name?: string
          reason?: string | null
          required_password?: boolean
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      imported_xml_hashes: {
        Row: {
          hash: string
          id: string
          imported_at: string
        }
        Insert: {
          hash: string
          id?: string
          imported_at?: string
        }
        Update: {
          hash?: string
          id?: string
          imported_at?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          alert_frequency: Database["public"]["Enums"]["alert_frequency"]
          alert_time: string
          birthday_message: boolean
          created_at: string
          email_notifications: boolean
          id: string
          low_stock_alert: boolean
          low_stock_quantity: number
          thank_you_message: boolean
          updated_at: string
          whatsapp_notifications: boolean
        }
        Insert: {
          alert_frequency?: Database["public"]["Enums"]["alert_frequency"]
          alert_time?: string
          birthday_message?: boolean
          created_at?: string
          email_notifications?: boolean
          id?: string
          low_stock_alert?: boolean
          low_stock_quantity?: number
          thank_you_message?: boolean
          updated_at?: string
          whatsapp_notifications?: boolean
        }
        Update: {
          alert_frequency?: Database["public"]["Enums"]["alert_frequency"]
          alert_time?: string
          birthday_message?: boolean
          created_at?: string
          email_notifications?: boolean
          id?: string
          low_stock_alert?: boolean
          low_stock_quantity?: number
          thank_you_message?: boolean
          updated_at?: string
          whatsapp_notifications?: boolean
        }
        Relationships: []
      }
      products: {
        Row: {
          barcode: string
          brand: string
          category: string
          collection: string
          color: string
          cost_price: number
          created_at: string
          description: string
          gender: Database["public"]["Enums"]["product_gender"]
          id: string
          image: string | null
          name: string
          price: number
          quantity: number
          size: string
          supplier: string
          updated_at: string
        }
        Insert: {
          barcode: string
          brand?: string
          category?: string
          collection?: string
          color?: string
          cost_price?: number
          created_at?: string
          description?: string
          gender?: Database["public"]["Enums"]["product_gender"]
          id?: string
          image?: string | null
          name: string
          price: number
          quantity?: number
          size?: string
          supplier?: string
          updated_at?: string
        }
        Update: {
          barcode?: string
          brand?: string
          category?: string
          collection?: string
          color?: string
          cost_price?: number
          created_at?: string
          description?: string
          gender?: Database["public"]["Enums"]["product_gender"]
          id?: string
          image?: string | null
          name?: string
          price?: number
          quantity?: number
          size?: string
          supplier?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          can_create_customers: boolean
          can_create_products: boolean
          can_create_sales: boolean
          can_delete_customers: boolean
          can_delete_products: boolean
          can_delete_sales: boolean
          can_edit_customers: boolean
          can_edit_products: boolean
          can_edit_sales: boolean
          can_export_data: boolean
          can_import_products: boolean
          can_manage_settings: boolean
          can_manage_users: boolean
          can_view_customers: boolean
          can_view_products: boolean
          can_view_reports: boolean
          can_view_sales: boolean
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          can_create_customers?: boolean
          can_create_products?: boolean
          can_create_sales?: boolean
          can_delete_customers?: boolean
          can_delete_products?: boolean
          can_delete_sales?: boolean
          can_edit_customers?: boolean
          can_edit_products?: boolean
          can_edit_sales?: boolean
          can_export_data?: boolean
          can_import_products?: boolean
          can_manage_settings?: boolean
          can_manage_users?: boolean
          can_view_customers?: boolean
          can_view_products?: boolean
          can_view_reports?: boolean
          can_view_sales?: boolean
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          can_create_customers?: boolean
          can_create_products?: boolean
          can_create_sales?: boolean
          can_delete_customers?: boolean
          can_delete_products?: boolean
          can_delete_sales?: boolean
          can_edit_customers?: boolean
          can_edit_products?: boolean
          can_edit_sales?: boolean
          can_export_data?: boolean
          can_import_products?: boolean
          can_manage_settings?: boolean
          can_manage_users?: boolean
          can_view_customers?: boolean
          can_view_products?: boolean
          can_view_reports?: boolean
          can_view_sales?: boolean
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      sale_items: {
        Row: {
          created_at: string
          id: string
          price: number
          product_id: string
          quantity: number
          sale_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          price: number
          product_id: string
          quantity: number
          sale_id: string
        }
        Update: {
          created_at?: string
          id?: string
          price?: number
          product_id?: string
          quantity?: number
          sale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          cashier: string
          created_at: string
          customer_id: string
          date: string
          discount: number
          discount_type: Database["public"]["Enums"]["discount_type"]
          id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          seller: string
          subtotal: number
          total: number
        }
        Insert: {
          cashier: string
          created_at?: string
          customer_id: string
          date?: string
          discount?: number
          discount_type?: Database["public"]["Enums"]["discount_type"]
          id?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          seller: string
          subtotal: number
          total: number
        }
        Update: {
          cashier?: string
          created_at?: string
          customer_id?: string
          date?: string
          discount?: number
          discount_type?: Database["public"]["Enums"]["discount_type"]
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          seller?: string
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      security_settings: {
        Row: {
          created_at: string
          id: string
          max_sessions: number
          min_password_length: number
          multiple_logins: boolean
          password_expiration: number
          require_numbers: boolean
          require_special_chars: boolean
          session_timeout: number
          two_factor_auth: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_sessions?: number
          min_password_length?: number
          multiple_logins?: boolean
          password_expiration?: number
          require_numbers?: boolean
          require_special_chars?: boolean
          session_timeout?: number
          two_factor_auth?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          max_sessions?: number
          min_password_length?: number
          multiple_logins?: boolean
          password_expiration?: number
          require_numbers?: boolean
          require_special_chars?: boolean
          session_timeout?: number
          two_factor_auth?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      sellers: {
        Row: {
          active: boolean
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      sizes: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          address: string
          created_at: string
          email: string
          facebook: string
          hours: string
          id: string
          instagram: string
          logo: string | null
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          address?: string
          created_at?: string
          email?: string
          facebook?: string
          hours?: string
          id?: string
          instagram?: string
          logo?: string | null
          name?: string
          phone?: string
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string
          facebook?: string
          hours?: string
          id?: string
          instagram?: string
          logo?: string | null
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          active: boolean
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_frequency: "realtime" | "daily" | "weekly"
      customer_gender: "M" | "F" | "Outro"
      discount_type: "percentage" | "value"
      payment_method: "pix" | "debito" | "credito"
      product_gender: "Masculino" | "Feminino" | "Unissex"
      user_role: "admin" | "vendedor" | "caixa" | "consultivo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_frequency: ["realtime", "daily", "weekly"],
      customer_gender: ["M", "F", "Outro"],
      discount_type: ["percentage", "value"],
      payment_method: ["pix", "debito", "credito"],
      product_gender: ["Masculino", "Feminino", "Unissex"],
      user_role: ["admin", "vendedor", "caixa", "consultivo"],
    },
  },
} as const
