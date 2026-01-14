import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FlowNode {
  id: string;
  type: string;
  data: Record<string, unknown>;
  position: { x: number; y: number };
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
}

interface FlowData {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

interface ExecutionContext {
  tenantId: string;
  automationId: string;
  executionId: string;
  conversationId?: string;
  contactId?: string;
  contactPhone?: string;
  contactName?: string;
  triggerData: Record<string, unknown>;
  variables: Record<string, unknown>;
}

function getNextNodes(nodeId: string, edges: FlowEdge[]): string[] {
  return edges.filter((e) => e.source === nodeId).map((e) => e.target);
}

function replaceVariables(text: string, context: ExecutionContext): string {
  if (!text) return text;
  let result = text;
  result = result.replace(/{{contact_name}}/g, context.contactName || "");
  result = result.replace(/{{contact_phone}}/g, context.contactPhone || "");
  Object.entries(context.variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), String(value));
  });
  return result;
}

function evaluateCondition(fieldValue: unknown, operator: string, value: string): boolean {
  const strValue = String(fieldValue || "").toLowerCase();
  const compareValue = value.toLowerCase();
  switch (operator) {
    case "equals": return strValue === compareValue;
    case "not_equals": return strValue !== compareValue;
    case "contains": return strValue.includes(compareValue);
    case "starts_with": return strValue.startsWith(compareValue);
    default: return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    // deno-lint-ignore no-explicit-any
    const supabase: any = createClient(supabaseUrl, serviceKey);

    const { action, automation_id, tenant_id, conversation_id, contact_id, trigger_data } = await req.json();

    if (action === "execute") {
      const { data: automation, error: automationErr } = await supabase
        .from("automations").select("*").eq("id", automation_id).single();

      if (automationErr || !automation) throw new Error("Automation not found");
      if (!automation.is_active) {
        return new Response(JSON.stringify({ success: false, message: "Automation is not active" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const flowData = automation.flow_data as FlowData;
      if (!flowData?.nodes?.length) throw new Error("No flow data found");

      const { data: execution } = await supabase.from("automation_executions").insert({
        automation_id, tenant_id: tenant_id || automation.tenant_id,
        conversation_id, contact_id, trigger_data: trigger_data || {}, status: "running",
      }).select().single();

      const context: ExecutionContext = {
        tenantId: tenant_id || automation.tenant_id, automationId: automation_id,
        executionId: execution?.id, conversationId: conversation_id, contactId: contact_id,
        triggerData: trigger_data || {}, variables: {},
      };

      const startNode = flowData.nodes.find((n) => ["trigger", "keyword", "start"].includes(n.type));
      if (!startNode) throw new Error("No start node found");

      let currentNodeIds = getNextNodes(startNode.id, flowData.edges);
      let processedCount = 0;

      while (currentNodeIds.length > 0 && processedCount < 50) {
        const nextNodeIds: string[] = [];
        for (const nodeId of currentNodeIds) {
          const node = flowData.nodes.find((n) => n.id === nodeId);
          if (!node) continue;

          if (node.type === "send_message" && context.contactId && context.conversationId) {
            const message = replaceVariables(node.data.message as string, context);
            await supabase.from("messages").insert({
              tenant_id: context.tenantId, conversation_id: context.conversationId,
              contact_id: context.contactId, direction: "outbound",
              message_type: "text", content: message, status: "pending",
            });
          }

          nextNodeIds.push(...getNextNodes(node.id, flowData.edges));
          processedCount++;
        }
        currentNodeIds = [...new Set(nextNodeIds)];
      }

      await supabase.from("automation_executions").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", execution?.id);
      await supabase.from("automations").update({ executions_count: (automation.executions_count || 0) + 1, last_executed_at: new Date().toISOString() }).eq("id", automation_id);

      return new Response(JSON.stringify({ success: true, execution_id: execution?.id, nodes_processed: processedCount }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "trigger_match") {
      const { message_content } = trigger_data || {};
      const { data: automations } = await supabase.from("automations").select("*").eq("tenant_id", tenant_id).eq("is_active", true);
      const matchedAutomations: string[] = [];

      for (const automation of automations || []) {
        if (automation.trigger_type === "keyword") {
          const keywords = automation.trigger_config?.keywords || [];
          for (const keyword of keywords) {
            if (String(message_content).toLowerCase().includes(keyword.toLowerCase())) {
              matchedAutomations.push(automation.id);
              break;
            }
          }
        }
      }
      return new Response(JSON.stringify({ matched_automations: matchedAutomations }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Automation engine error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
