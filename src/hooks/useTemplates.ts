import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenants } from "./useTenants";
import { useToast } from "./use-toast";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Template = Tables<"templates">;
export type TemplateInsert = TablesInsert<"templates">;

export const useTemplates = () => {
  const { currentTenantId } = useTenants();
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
      toast({ title: "Template created successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to create template", 
        description: error.message,
        variant: "destructive" 
      });
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
      toast({ title: "Template updated successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to update template", 
        description: error.message,
        variant: "destructive" 
      });
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
      toast({ title: "Template deleted successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to delete template", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Sync templates from Meta API
  const syncTemplates = useMutation({
    mutationFn: async () => {
      if (!currentTenantId) throw new Error("No tenant selected");

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("whatsapp-meta-templates", {
        body: { tenant_id: currentTenantId },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || "Sync failed");
      
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["templates", currentTenantId] });
      toast({ 
        title: "Templates synced successfully",
        description: `Synced ${data.synced} templates from Meta API`,
      });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to sync templates", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Submit template to Meta for approval
  const submitToMeta = useMutation({
    mutationFn: async (template: Template) => {
      if (!currentTenantId) throw new Error("No tenant selected");

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      // Build components array for Meta API
      const components: any[] = [];
      
      // Header component
      if (template.header_type && template.header_content) {
        components.push({
          type: "HEADER",
          format: template.header_type.toUpperCase(),
          text: template.header_type === "text" ? template.header_content : undefined,
        });
      }

      // Body component
      components.push({
        type: "BODY",
        text: template.body,
      });

      // Footer component
      if (template.footer) {
        components.push({
          type: "FOOTER",
          text: template.footer,
        });
      }

      // Buttons
      if (template.buttons && Array.isArray(template.buttons) && template.buttons.length > 0) {
        components.push({
          type: "BUTTONS",
          buttons: template.buttons,
        });
      }

      const { data, error } = await supabase.functions.invoke("whatsapp-meta-templates", {
        body: { 
          tenant_id: currentTenantId,
          name: template.name,
          category: template.category.toUpperCase(),
          language: template.language || "en",
          components,
        },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || "Submission failed");
      
      // Update local template status
      await supabase
        .from("templates")
        .update({ 
          status: "pending",
          whatsapp_template_id: data.data.id,
        })
        .eq("id", template.id);

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates", currentTenantId] });
      toast({ 
        title: "Template submitted for approval",
        description: "Meta will review your template within 24-48 hours",
      });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to submit template", 
        description: error.message,
        variant: "destructive" 
      });
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
    syncTemplates,
    submitToMeta,
  };
};
