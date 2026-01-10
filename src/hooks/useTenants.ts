import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string | null;
  business_name: string | null;
  is_active: boolean | null;
  plan: string | null;
  muc_limit: number | null;
  created_at: string | null;
  updated_at: string | null;
  phone_number_id: string | null;
  waba_id: string | null;
}

export const useTenants = () => {
  const { user, currentTenantId, setCurrentTenantId, isSuperAdmin } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTenants = async () => {
    if (!user) {
      setTenants([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('tenants')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;
      setTenants(data || []);
    } catch (err) {
      console.error('Error fetching tenants:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [user]);

  const currentTenant = tenants.find((t) => t.id === currentTenantId) || null;

  const createTenant = async (tenantData: { name: string; slug: string } & Partial<Omit<Tenant, 'name' | 'slug'>>) => {
    const { data, error } = await supabase
      .from('tenants')
      .insert([tenantData])
      .select()
      .single();

    if (error) throw error;

    await fetchTenants();
    if (data?.id) setCurrentTenantId(data.id);
    return data;
  };

  const switchTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
  };

  return {
    tenants,
    currentTenant,
    currentTenantId,
    isLoading,
    error,
    refetch: fetchTenants,
    createTenant,
    switchTenant,
    isSuperAdmin,
  };
};
