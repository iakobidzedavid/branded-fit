export type Database = {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string;
          domain: string;
          brand_name: string | null;
          colors: Record<string, unknown> | null;
          logo_url: string | null;
          mockup_images: Record<string, unknown> | null;
          shopify_url: string | null;
          shopify_store_id: string | null;
          shopify_api_token: string | null;
          status: string;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          domain: string;
          brand_name?: string | null;
          colors?: Record<string, unknown> | null;
          logo_url?: string | null;
          mockup_images?: Record<string, unknown> | null;
          shopify_url?: string | null;
          shopify_store_id?: string | null;
          shopify_api_token?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          domain?: string;
          brand_name?: string | null;
          colors?: Record<string, unknown> | null;
          logo_url?: string | null;
          mockup_images?: Record<string, unknown> | null;
          shopify_url?: string | null;
          shopify_store_id?: string | null;
          shopify_api_token?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      products: {
        Row: {
          id: string;
          domain: string;
          sku: string;
          product_name: string;
          mockup_image_url: string | null;
          variants: Record<string, unknown> | null;
          pricing: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          domain: string;
          sku: string;
          product_name: string;
          mockup_image_url?: string | null;
          variants?: Record<string, unknown> | null;
          pricing?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          domain?: string;
          sku?: string;
          product_name?: string;
          mockup_image_url?: string | null;
          variants?: Record<string, unknown> | null;
          pricing?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      brand_extracts: {
        Row: {
          id: string;
          domain: string;
          colors: Record<string, unknown> | null;
          logos: Record<string, unknown> | null;
          typography: Record<string, unknown> | null;
          extracted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          domain: string;
          colors?: Record<string, unknown> | null;
          logos?: Record<string, unknown> | null;
          typography?: Record<string, unknown> | null;
          extracted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          domain?: string;
          colors?: Record<string, unknown> | null;
          logos?: Record<string, unknown> | null;
          typography?: Record<string, unknown> | null;
          extracted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      analytics_events: {
        Row: {
          id: string;
          customer_id: string | null;
          event_name: string;
          event_data: Record<string, unknown> | null;
          created_at: string;
          domain: string | null;
          session_id: string | null;
          user_id: string | null;
          pipeline_stage: string | null;
          duration_ms: number | null;
          error_message: string | null;
          context: Record<string, unknown> | null;
          properties: Record<string, unknown> | null;
          metadata: Record<string, unknown> | null;
          event_type: string | null;
        };
        Insert: {
          id?: string;
          customer_id?: string | null;
          event_name: string;
          event_data?: Record<string, unknown> | null;
          created_at?: string;
          domain?: string | null;
          session_id?: string | null;
          user_id?: string | null;
          pipeline_stage?: string | null;
          duration_ms?: number | null;
          error_message?: string | null;
          context?: Record<string, unknown> | null;
          properties?: Record<string, unknown> | null;
          metadata?: Record<string, unknown> | null;
          event_type?: string | null;
        };
        Update: {
          id?: string;
          customer_id?: string | null;
          event_name?: string;
          event_data?: Record<string, unknown> | null;
          created_at?: string;
          domain?: string | null;
          session_id?: string | null;
          user_id?: string | null;
          pipeline_stage?: string | null;
          duration_ms?: number | null;
          error_message?: string | null;
          context?: Record<string, unknown> | null;
          properties?: Record<string, unknown> | null;
          metadata?: Record<string, unknown> | null;
          event_type?: string | null;
        };
      };
      storefronts: {
        Row: {
          id: string;
          domain: string;
          shopify_store_id: string;
          storefront_url: string;
          product_count: number | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          domain: string;
          shopify_store_id: string;
          storefront_url: string;
          product_count?: number | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          domain?: string;
          shopify_store_id?: string;
          storefront_url?: string;
          product_count?: number | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
