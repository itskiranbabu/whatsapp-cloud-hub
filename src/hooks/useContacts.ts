import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenants } from "@/hooks/useTenants";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Contact = Tables<"contacts">;
type ContactInsert = TablesInsert<"contacts">;

export const useContacts = () => {
  const { currentTenant } = useTenants();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: contacts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contacts", currentTenant?.id],
    queryFn: async () => {
      if (!currentTenant?.id) return [];
      
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("tenant_id", currentTenant.id)
        .order("last_message_at", { ascending: false, nullsFirst: false });

      if (error) throw error;
      return data as Contact[];
    },
    enabled: !!currentTenant?.id,
  });

  const createContact = useMutation({
    mutationFn: async (contact: Omit<ContactInsert, "tenant_id">) => {
      if (!currentTenant?.id) throw new Error("No tenant selected");
      
      const { data, error } = await supabase
        .from("contacts")
        .insert({ ...contact, tenant_id: currentTenant.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts", currentTenant?.id] });
      toast({ title: "Contact created successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to create contact",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateContact = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Contact> & { id: string }) => {
      const { data, error } = await supabase
        .from("contacts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts", currentTenant?.id] });
      toast({ title: "Contact updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to update contact",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contacts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts", currentTenant?.id] });
      toast({ title: "Contact deleted successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete contact",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const bulkCreateContacts = useMutation({
    mutationFn: async (newContacts: Omit<ContactInsert, "tenant_id">[]) => {
      if (!currentTenant?.id) throw new Error("No tenant selected");
      
      const contactsWithTenant = newContacts.map((c) => ({
        ...c,
        tenant_id: currentTenant.id,
      }));

      const { data, error } = await supabase
        .from("contacts")
        .insert(contactsWithTenant)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["contacts", currentTenant?.id] });
      toast({ title: `${data.length} contacts imported successfully` });
    },
    onError: (error) => {
      toast({
        title: "Failed to import contacts",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const bulkAddTag = useMutation({
    mutationFn: async ({ contactIds, tag }: { contactIds: string[]; tag: string }) => {
      // Get current contacts with their tags
      const { data: currentContacts } = await supabase
        .from("contacts")
        .select("id, tags")
        .in("id", contactIds);

      if (!currentContacts) return;

      // Update each contact's tags
      const updates = currentContacts.map((contact) => ({
        id: contact.id,
        tags: [...(contact.tags || []).filter((t) => t !== tag), tag],
      }));

      for (const update of updates) {
        await supabase.from("contacts").update({ tags: update.tags }).eq("id", update.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts", currentTenant?.id] });
      toast({ title: "Tags added successfully" });
    },
  });

  const bulkDelete = useMutation({
    mutationFn: async (contactIds: string[]) => {
      const { error } = await supabase.from("contacts").delete().in("id", contactIds);
      if (error) throw error;
    },
    onSuccess: (_, contactIds) => {
      queryClient.invalidateQueries({ queryKey: ["contacts", currentTenant?.id] });
      toast({ title: `${contactIds.length} contacts deleted` });
    },
  });

  return {
    contacts,
    isLoading,
    error,
    createContact,
    updateContact,
    deleteContact,
    bulkCreateContacts,
    bulkAddTag,
    bulkDelete,
  };
};
