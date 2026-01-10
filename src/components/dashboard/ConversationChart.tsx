import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { name: "Jan 1", conversations: 2400, messages: 4800 },
  { name: "Jan 2", conversations: 1398, messages: 3200 },
  { name: "Jan 3", conversations: 3800, messages: 6800 },
  { name: "Jan 4", conversations: 3908, messages: 7200 },
  { name: "Jan 5", conversations: 4800, messages: 8900 },
  { name: "Jan 6", conversations: 3800, messages: 6500 },
  { name: "Jan 7", conversations: 4300, messages: 7800 },
];

export const ConversationChart = () => {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Conversation Trends</CardTitle>
            <p className="text-sm text-muted-foreground">Daily conversations & messages</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Conversations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
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
                  <stop offset="5%" stopColor="hsl(142 70% 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142 70% 45%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(220 9% 46%)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(220 9% 46%)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0 0% 100%)",
                  border: "1px solid hsl(220 13% 91%)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px hsl(222 47% 11% / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="conversations"
                stroke="hsl(142 70% 45%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorConversations)"
              />
              <Area
                type="monotone"
                dataKey="messages"
                stroke="hsl(199 89% 48%)"
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
