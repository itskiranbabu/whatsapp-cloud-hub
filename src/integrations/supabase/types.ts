export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ads: {
        Row: {
          ad_account_id: string | null
          budget: number | null
          campaign_id: string | null
          clicks: number | null
          cost_per_message: number | null
          created_at: string
          id: string
          impressions: number | null
          messages: number | null
          meta_ad_id: string | null
          name: string
          platform: string
          spent: number | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          ad_account_id?: string | null
          budget?: number | null
          campaign_id?: string | null
          clicks?: number | null
          cost_per_message?: number | null
          created_at?: string
          id?: string
          impressions?: number | null
          messages?: number | null
          meta_ad_id?: string | null
          name: string
          platform?: string
          spent?: number | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          ad_account_id?: string | null
          budget?: number | null
          campaign_id?: string | null
          clicks?: number | null
          cost_per_message?: number | null
          created_at?: string
          id?: string
          impressions?: number | null
          messages?: number | null
          meta_ad_id?: string | null
          name?: string
          platform?: string
          spent?: number | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ads_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          commission_rate: number | null
          created_at: string
          id: string
          payout_details: Json | null
          pending_payout: number | null
          referral_code: string
          status: string | null
          total_earnings: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string
          id?: string
          payout_details?: Json | null
          pending_payout?: number | null
          referral_code: string
          status?: string | null
          total_earnings?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          commission_rate?: number | null
          created_at?: string
          id?: string
          payout_details?: Json | null
          pending_payout?: number | null
          referral_code?: string
          status?: string | null
          total_earnings?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      automation_executions: {
        Row: {
          automation_id: string
          completed_at: string | null
          contact_id: string | null
          conversation_id: string | null
          created_at: string
          current_node_id: string | null
          error_message: string | null
          execution_path: Json | null
          id: string
          started_at: string | null
          status: string | null
          tenant_id: string
          trigger_data: Json | null
        }
        Insert: {
          automation_id: string
          completed_at?: string | null
          contact_id?: string | null
          conversation_id?: string | null
          created_at?: string
          current_node_id?: string | null
          error_message?: string | null
          execution_path?: Json | null
          id?: string
          started_at?: string | null
          status?: string | null
          tenant_id: string
          trigger_data?: Json | null
        }
        Update: {
          automation_id?: string
          completed_at?: string | null
          contact_id?: string | null
          conversation_id?: string | null
          created_at?: string
          current_node_id?: string | null
          error_message?: string | null
          execution_path?: Json | null
          id?: string
          started_at?: string | null
          status?: string | null
          tenant_id?: string
          trigger_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_executions_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_executions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_executions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_executions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      automations: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          executions_count: number | null
          flow_data: Json | null
          id: string
          is_active: boolean | null
          last_executed_at: string | null
          name: string
          tenant_id: string
          trigger_config: Json | null
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          executions_count?: number | null
          flow_data?: Json | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          name: string
          tenant_id: string
          trigger_config?: Json | null
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          executions_count?: number | null
          flow_data?: Json | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          name?: string
          tenant_id?: string
          trigger_config?: Json | null
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_accounts: {
        Row: {
          billing_cycle: string | null
          created_at: string
          credits_balance: number | null
          id: string
          next_billing_date: string | null
          partner_id: string | null
          payment_method: Json | null
          plan_id: string
          razorpay_customer_id: string | null
          razorpay_subscription_id: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string
          credits_balance?: number | null
          id?: string
          next_billing_date?: string | null
          partner_id?: string | null
          payment_method?: Json | null
          plan_id?: string
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string
          credits_balance?: number | null
          id?: string
          next_billing_date?: string | null
          partner_id?: string | null
          payment_method?: Json | null
          plan_id?: string
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_accounts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_accounts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          delivered_count: number | null
          description: string | null
          failed_count: number | null
          id: string
          name: string
          read_count: number | null
          scheduled_at: string | null
          sent_count: number | null
          started_at: string | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          target_audience: Json | null
          template_id: string | null
          tenant_id: string
          total_recipients: number | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          delivered_count?: number | null
          description?: string | null
          failed_count?: number | null
          id?: string
          name: string
          read_count?: number | null
          scheduled_at?: string | null
          sent_count?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          target_audience?: Json | null
          template_id?: string | null
          tenant_id: string
          total_recipients?: number | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          delivered_count?: number | null
          description?: string | null
          failed_count?: number | null
          id?: string
          name?: string
          read_count?: number | null
          scheduled_at?: string | null
          sent_count?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          target_audience?: Json | null
          template_id?: string | null
          tenant_id?: string
          total_recipients?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          affiliate_id: string | null
          amount: number
          created_at: string
          id: string
          paid_at: string | null
          partner_id: string | null
          period_end: string | null
          period_start: string | null
          source_tenant_id: string | null
          status: string | null
          type: string
        }
        Insert: {
          affiliate_id?: string | null
          amount: number
          created_at?: string
          id?: string
          paid_at?: string | null
          partner_id?: string | null
          period_end?: string | null
          period_start?: string | null
          source_tenant_id?: string | null
          status?: string | null
          type: string
        }
        Update: {
          affiliate_id?: string | null
          amount?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          partner_id?: string | null
          period_end?: string | null
          period_start?: string | null
          source_tenant_id?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_source_tenant_id_fkey"
            columns: ["source_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          attributes: Json | null
          created_at: string | null
          email: string | null
          id: string
          last_message_at: string | null
          name: string | null
          opted_in: boolean | null
          opted_in_at: string | null
          phone: string
          tags: string[] | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          attributes?: Json | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_message_at?: string | null
          name?: string | null
          opted_in?: boolean | null
          opted_in_at?: string | null
          phone: string
          tags?: string[] | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          attributes?: Json | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_message_at?: string | null
          name?: string | null
          opted_in?: boolean | null
          opted_in_at?: string | null
          phone?: string
          tags?: string[] | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          assigned_agent_id: string | null
          contact_id: string
          created_at: string | null
          id: string
          is_session_active: boolean | null
          last_message_at: string | null
          session_expires_at: string | null
          status: Database["public"]["Enums"]["conversation_status"] | null
          tenant_id: string
          unread_count: number | null
          updated_at: string | null
        }
        Insert: {
          assigned_agent_id?: string | null
          contact_id: string
          created_at?: string | null
          id?: string
          is_session_active?: boolean | null
          last_message_at?: string | null
          session_expires_at?: string | null
          status?: Database["public"]["Enums"]["conversation_status"] | null
          tenant_id: string
          unread_count?: number | null
          updated_at?: string | null
        }
        Update: {
          assigned_agent_id?: string | null
          contact_id?: string
          created_at?: string | null
          id?: string
          is_session_active?: boolean | null
          last_message_at?: string | null
          session_expires_at?: string | null
          status?: Database["public"]["Enums"]["conversation_status"] | null
          tenant_id?: string
          unread_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          config: Json | null
          created_at: string
          credentials: Json | null
          error_message: string | null
          id: string
          integration_type: string
          last_sync_at: string | null
          name: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          credentials?: Json | null
          error_message?: string | null
          id?: string
          integration_type: string
          last_sync_at?: string | null
          name: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          credentials?: Json | null
          error_message?: string | null
          id?: string
          integration_type?: string
          last_sync_at?: string | null
          name?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          contact_id: string
          content: string | null
          conversation_id: string
          created_at: string | null
          delivered_at: string | null
          direction: Database["public"]["Enums"]["message_direction"]
          failed_reason: string | null
          id: string
          media_url: string | null
          message_type: string | null
          read_at: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["message_status"] | null
          tenant_id: string
          whatsapp_message_id: string | null
        }
        Insert: {
          contact_id: string
          content?: string | null
          conversation_id: string
          created_at?: string | null
          delivered_at?: string | null
          direction: Database["public"]["Enums"]["message_direction"]
          failed_reason?: string | null
          id?: string
          media_url?: string | null
          message_type?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          tenant_id: string
          whatsapp_message_id?: string | null
        }
        Update: {
          contact_id?: string
          content?: string | null
          conversation_id?: string
          created_at?: string | null
          delivered_at?: string | null
          direction?: Database["public"]["Enums"]["message_direction"]
          failed_reason?: string | null
          id?: string
          media_url?: string | null
          message_type?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          tenant_id?: string
          whatsapp_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          branding: Json | null
          commission_rate: number | null
          created_at: string
          custom_domain: string | null
          id: string
          name: string
          onboarded_at: string | null
          owner_user_id: string
          payout_details: Json | null
          revenue_share_model: string | null
          slug: string
          status: string | null
          total_clients: number | null
          total_revenue: number | null
          updated_at: string
        }
        Insert: {
          branding?: Json | null
          commission_rate?: number | null
          created_at?: string
          custom_domain?: string | null
          id?: string
          name: string
          onboarded_at?: string | null
          owner_user_id: string
          payout_details?: Json | null
          revenue_share_model?: string | null
          slug: string
          status?: string | null
          total_clients?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Update: {
          branding?: Json | null
          commission_rate?: number | null
          created_at?: string
          custom_domain?: string | null
          id?: string
          name?: string
          onboarded_at?: string | null
          owner_user_id?: string
          payout_details?: Json | null
          revenue_share_model?: string | null
          slug?: string
          status?: string | null
          total_clients?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      payouts: {
        Row: {
          affiliate_id: string | null
          amount: number
          created_at: string
          id: string
          partner_id: string | null
          payout_details: Json | null
          processed_at: string | null
          razorpay_payout_id: string | null
          requested_at: string | null
          status: string | null
        }
        Insert: {
          affiliate_id?: string | null
          amount: number
          created_at?: string
          id?: string
          partner_id?: string | null
          payout_details?: Json | null
          processed_at?: string | null
          razorpay_payout_id?: string | null
          requested_at?: string | null
          status?: string | null
        }
        Update: {
          affiliate_id?: string | null
          amount?: number
          created_at?: string
          id?: string
          partner_id?: string | null
          payout_details?: Json | null
          processed_at?: string | null
          razorpay_payout_id?: string | null
          requested_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payouts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          affiliate_id: string
          converted_at: string | null
          created_at: string
          id: string
          referred_tenant_id: string
          status: string | null
        }
        Insert: {
          affiliate_id: string
          converted_at?: string | null
          created_at?: string
          id?: string
          referred_tenant_id: string
          status?: string | null
        }
        Update: {
          affiliate_id?: string
          converted_at?: string | null
          created_at?: string
          id?: string
          referred_tenant_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referred_tenant_id_fkey"
            columns: ["referred_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          body: string
          buttons: Json | null
          category: Database["public"]["Enums"]["template_category"]
          created_at: string | null
          footer: string | null
          header_content: string | null
          header_type: string | null
          id: string
          language: string | null
          name: string
          rejection_reason: string | null
          status: Database["public"]["Enums"]["template_status"] | null
          tenant_id: string
          updated_at: string | null
          variables: Json | null
          whatsapp_template_id: string | null
        }
        Insert: {
          body: string
          buttons?: Json | null
          category: Database["public"]["Enums"]["template_category"]
          created_at?: string | null
          footer?: string | null
          header_content?: string | null
          header_type?: string | null
          id?: string
          language?: string | null
          name: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["template_status"] | null
          tenant_id: string
          updated_at?: string | null
          variables?: Json | null
          whatsapp_template_id?: string | null
        }
        Update: {
          body?: string
          buttons?: Json | null
          category?: Database["public"]["Enums"]["template_category"]
          created_at?: string | null
          footer?: string | null
          header_content?: string | null
          header_type?: string | null
          id?: string
          language?: string | null
          name?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["template_status"] | null
          tenant_id?: string
          updated_at?: string | null
          variables?: Json | null
          whatsapp_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_credentials: {
        Row: {
          bsp_credentials: Json | null
          created_at: string | null
          id: string
          meta_access_token: string | null
          meta_app_secret: string | null
          meta_webhook_verify_token: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          bsp_credentials?: Json | null
          created_at?: string | null
          id?: string
          meta_access_token?: string | null
          meta_app_secret?: string | null
          meta_webhook_verify_token?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          bsp_credentials?: Json | null
          created_at?: string | null
          id?: string
          meta_access_token?: string | null
          meta_app_secret?: string | null
          meta_webhook_verify_token?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_credentials_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_partners: {
        Row: {
          created_at: string
          id: string
          partner_id: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          partner_id: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          partner_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_partners_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_partners_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          bsp_credentials: Json | null
          bsp_provider: string | null
          business_name: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          meta_access_token: string | null
          meta_app_secret: string | null
          meta_webhook_verify_token: string | null
          muc_limit: number | null
          name: string
          phone_number_id: string | null
          plan: string | null
          primary_color: string | null
          slug: string
          updated_at: string | null
          waba_id: string | null
        }
        Insert: {
          bsp_credentials?: Json | null
          bsp_provider?: string | null
          business_name?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          meta_access_token?: string | null
          meta_app_secret?: string | null
          meta_webhook_verify_token?: string | null
          muc_limit?: number | null
          name: string
          phone_number_id?: string | null
          plan?: string | null
          primary_color?: string | null
          slug: string
          updated_at?: string | null
          waba_id?: string | null
        }
        Update: {
          bsp_credentials?: Json | null
          bsp_provider?: string | null
          business_name?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          meta_access_token?: string | null
          meta_app_secret?: string | null
          meta_webhook_verify_token?: string | null
          muc_limit?: number | null
          name?: string
          phone_number_id?: string | null
          plan?: string | null
          primary_color?: string | null
          slug?: string
          updated_at?: string | null
          waba_id?: string | null
        }
        Relationships: []
      }
      usage_logs: {
        Row: {
          created_at: string
          credits_used: number | null
          event_type: string
          id: string
          metadata: Json | null
          tenant_id: string
        }
        Insert: {
          created_at?: string
          credits_used?: number | null
          event_type: string
          id?: string
          metadata?: Json | null
          tenant_id: string
        }
        Update: {
          created_at?: string
          credits_used?: number | null
          event_type?: string
          id?: string
          metadata?: Json | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tenant_ids: { Args: { _user_id: string }; Returns: string[] }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_tenant_access: {
        Args: { _tenant_id: string; _user_id: string }
        Returns: boolean
      }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "tenant_admin" | "agent"
      campaign_status:
        | "draft"
        | "scheduled"
        | "running"
        | "completed"
        | "failed"
      conversation_status: "open" | "pending" | "resolved" | "expired"
      message_direction: "inbound" | "outbound"
      message_status: "pending" | "sent" | "delivered" | "read" | "failed"
      template_category: "marketing" | "utility" | "authentication"
      template_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "tenant_admin", "agent"],
      campaign_status: ["draft", "scheduled", "running", "completed", "failed"],
      conversation_status: ["open", "pending", "resolved", "expired"],
      message_direction: ["inbound", "outbound"],
      message_status: ["pending", "sent", "delivered", "read", "failed"],
      template_category: ["marketing", "utility", "authentication"],
      template_status: ["pending", "approved", "rejected"],
    },
  },
} as const
