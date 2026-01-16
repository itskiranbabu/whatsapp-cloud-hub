import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Tenant = Tables<"tenants">;
export type TenantInsert = TablesInsert<"tenants">;

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

  const createTenant = async (tenantData: TenantInsert) => {
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
