import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenants } from "@/hooks/useTenants";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Automation = Tables<"automations">;
type AutomationInsert = TablesInsert<"automations">;

export const useAutomations = () => {
  const { currentTenant } = useTenants();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: automations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["automations", currentTenant?.id],
    queryFn: async () => {
      if (!currentTenant?.id) return [];

      const { data, error } = await supabase
        .from("automations")
        .select("*")
        .eq("tenant_id", currentTenant.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Automation[];
    },
    enabled: !!currentTenant?.id,
  });

  const createAutomation = useMutation({
    mutationFn: async (automation: Omit<AutomationInsert, "tenant_id">) => {
      if (!currentTenant?.id) throw new Error("No tenant selected");

      const { data, error } = await supabase
        .from("automations")
        .insert({ ...automation, tenant_id: currentTenant.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations", currentTenant?.id] });
      toast({ title: "Automation created successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to create automation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateAutomation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Automation> & { id: string }) => {
      const { data, error } = await supabase
        .from("automations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations", currentTenant?.id] });
      toast({ title: "Automation updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to update automation",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleAutomation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from("automations")
        .update({ is_active: isActive })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["automations", currentTenant?.id] });
      toast({
        title: data.is_active ? "Automation activated" : "Automation paused",
      });
    },
  });

  const deleteAutomation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("automations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automations", currentTenant?.id] });
      toast({ title: "Automation deleted" });
    },
  });

  return {
    automations,
    isLoading,
    error,
    createAutomation,
    updateAutomation,
    toggleAutomation,
    deleteAutomation,
  };
};
