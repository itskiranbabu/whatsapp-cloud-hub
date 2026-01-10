import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string;
  business_name: string | null;
  is_active: boolean;
  plan: string;
  muc_limit: number;
  created_at: string;
}

export const useTenants = () => {
  const { user, isSuperAdmin } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTenants = async () => {
    if (!user) {
      setTenants([]);
      setCurrentTenant(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('tenants')
        .select('*')
        .order('name');

      if (fetchError) {
        throw fetchError;
      }

      setTenants(data || []);
      // Set first tenant as current if none selected
      if (data && data.length > 0 && !currentTenant) {
        setCurrentTenant(data[0]);
      }
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

  const createTenant = async (tenantData: { name: string; slug: string } & Partial<Omit<Tenant, 'name' | 'slug'>>) => {
    const { data, error } = await supabase
      .from('tenants')
      .insert([tenantData])
      .select()
      .single();

    if (error) throw error;
    
    await fetchTenants();
    return data;
  };

  const switchTenant = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) setCurrentTenant(tenant);
  };

  return {
    tenants,
    currentTenant,
    isLoading,
    error,
    refetch: fetchTenants,
    createTenant,
    switchTenant,
  };
};
