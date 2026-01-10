import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenants } from "@/hooks/useTenants";
import { format } from "date-fns";

type TrendPoint = { name: string; conversations: number; messages: number };

const buildLastNDays = (days: number) => {
  const out: { key: string; label: string }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push({
      key: format(d, "yyyy-MM-dd"),
      label: format(d, "MMM d"),
    });
  }
  return out;
};

export const ConversationChart = () => {
  const { currentTenant } = useTenants();

  const { data = [], isLoading } = useQuery({
    queryKey: ["conversation-trends", currentTenant?.id],
    enabled: !!currentTenant?.id,
    queryFn: async () => {
      if (!currentTenant?.id) return [] as TrendPoint[];

      const days = buildLastNDays(7);
      const start = new Date(`${days[0].key}T00:00:00.000Z`).toISOString();

      const [{ data: conv, error: convErr }, { data: msgs, error: msgErr }] = await Promise.all([
        supabase
          .from("conversations")
          .select("created_at")
          .eq("tenant_id", currentTenant.id)
          .gte("created_at", start),
        supabase
          .from("messages")
          .select("created_at")
          .eq("tenant_id", currentTenant.id)
          .gte("created_at", start),
      ]);

      if (convErr) throw convErr;
      if (msgErr) throw msgErr;

      const convCounts = new Map<string, number>();
      for (const c of conv ?? []) {
        const key = format(new Date(c.created_at as string), "yyyy-MM-dd");
        convCounts.set(key, (convCounts.get(key) ?? 0) + 1);
      }

      const msgCounts = new Map<string, number>();
      for (const m of msgs ?? []) {
        const key = format(new Date(m.created_at as string), "yyyy-MM-dd");
        msgCounts.set(key, (msgCounts.get(key) ?? 0) + 1);
      }

      return days.map((d) => ({
        name: d.label,
        conversations: convCounts.get(d.key) ?? 0,
        messages: msgCounts.get(d.key) ?? 0,
      }));
    },
  });

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Conversation Trends</CardTitle>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading…" : "Daily conversations & messages"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Conversations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-muted-foreground">Messages</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorConversations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="conversations"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorConversations)"
              />
              <Area
                type="monotone"
                dataKey="messages"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMessages)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
