import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenants } from "./useTenants";
import { startOfDay, subDays, format } from "date-fns";

export const useAnalytics = (days: number = 7) => {
  const { currentTenantId } = useTenants();

  const analyticsQuery = useQuery({
    queryKey: ["analytics", currentTenantId, days],
    queryFn: async () => {
      if (!currentTenantId) return null;

      const startDate = startOfDay(subDays(new Date(), days));

      // Fetch conversations count
      const { count: totalConversations } = await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", currentTenantId);

      // Fetch messages for delivery stats
      const { data: messages } = await supabase
        .from("messages")
        .select("status, direction, created_at")
        .eq("tenant_id", currentTenantId)
        .gte("created_at", startDate.toISOString());

      const outboundMessages = messages?.filter(m => m.direction === "outbound") || [];
      const totalSent = outboundMessages.length;
      const delivered = outboundMessages.filter(m => m.status === "delivered" || m.status === "read").length;
      const read = outboundMessages.filter(m => m.status === "read").length;

      const deliveryRate = totalSent > 0 ? (delivered / totalSent) * 100 : 0;
      const readRate = delivered > 0 ? (read / delivered) * 100 : 0;

      // Fetch reply count (inbound messages)
      const inboundMessages = messages?.filter(m => m.direction === "inbound") || [];
      const replyRate = totalSent > 0 ? (inboundMessages.length / totalSent) * 100 : 0;

      // Conversation trends by day
      const { data: conversationTrends } = await supabase
        .from("conversations")
        .select("created_at")
        .eq("tenant_id", currentTenantId)
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

      const trendData = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dayStr = format(date, "MMM d");
        const dayConversations = conversationTrends?.filter(c => 
          format(new Date(c.created_at!), "MMM d") === dayStr
        ).length || 0;
        const dayMessages = messages?.filter(m => 
          format(new Date(m.created_at!), "MMM d") === dayStr
        ).length || 0;
        
        trendData.push({
          name: dayStr,
          conversations: dayConversations,
          messages: dayMessages,
        });
      }

      // Message types by category (from campaigns/templates)
      const { data: templates } = await supabase
        .from("templates")
        .select("category")
        .eq("tenant_id", currentTenantId);

      const categoryCount = templates?.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const messageTypeData = [
        { name: "Marketing", value: categoryCount["marketing"] || 0, color: "hsl(142 70% 45%)" },
        { name: "Utility", value: categoryCount["utility"] || 0, color: "hsl(199 89% 48%)" },
        { name: "Authentication", value: categoryCount["authentication"] || 0, color: "hsl(38 92% 50%)" },
      ];

      // Weekly delivery data
      const deliveryData = [];
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dayName = dayNames[date.getDay()];
        const dayMessages = messages?.filter(m => 
          format(new Date(m.created_at!), "yyyy-MM-dd") === format(date, "yyyy-MM-dd") &&
          m.direction === "outbound"
        ) || [];
        
        deliveryData.push({
          name: dayName,
          sent: dayMessages.length,
          delivered: dayMessages.filter(m => m.status === "delivered" || m.status === "read").length,
          read: dayMessages.filter(m => m.status === "read").length,
        });
      }

      return {
        totalConversations: totalConversations || 0,
        deliveryRate: deliveryRate.toFixed(1),
        readRate: readRate.toFixed(1),
        replyRate: replyRate.toFixed(1),
        trendData,
        messageTypeData,
        deliveryData,
      };
    },
    enabled: !!currentTenantId,
  });

  return {
    analytics: analyticsQuery.data,
    isLoading: analyticsQuery.isLoading,
    error: analyticsQuery.error,
  };
};
