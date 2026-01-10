import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenants } from "./useTenants";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Template = Tables<"templates">;
export type TemplateInsert = TablesInsert<"templates">;

export const useTemplates = () => {
  const { currentTenantId } = useTenants();
  const queryClient = useQueryClient();

  const templatesQuery = useQuery({
    queryKey: ["templates", currentTenantId],
    queryFn: async () => {
      if (!currentTenantId) return [];
      
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("tenant_id", currentTenantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!currentTenantId,
  });

  const createTemplate = useMutation({
    mutationFn: async (template: Omit<TemplateInsert, "tenant_id">) => {
      if (!currentTenantId) throw new Error("No tenant selected");
      
      const { data, error } = await supabase
        .from("templates")
        .insert({ ...template, tenant_id: currentTenantId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates", currentTenantId] });
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Template> & { id: string }) => {
      const { data, error } = await supabase
        .from("templates")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates", currentTenantId] });
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates", currentTenantId] });
    },
  });

  // Stats by status
  const stats = templatesQuery.data?.reduce(
    (acc, template) => ({
      total: acc.total + 1,
      approved: acc.approved + (template.status === "approved" ? 1 : 0),
      pending: acc.pending + (template.status === "pending" ? 1 : 0),
      rejected: acc.rejected + (template.status === "rejected" ? 1 : 0),
    }),
    { total: 0, approved: 0, pending: 0, rejected: 0 }
  ) || { total: 0, approved: 0, pending: 0, rejected: 0 };

  return {
    templates: templatesQuery.data || [],
    isLoading: templatesQuery.isLoading,
    error: templatesQuery.error,
    stats,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};
