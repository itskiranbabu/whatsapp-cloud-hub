import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Clock,
  Users,
  Zap,
} from "lucide-react";

interface ConversationTrendsProps {
  data: {
    name: string;
    conversations: number;
    messages: number;
  }[];
  totalConversations: number;
  period: number;
}

export const ConversationTrends = ({
  data,
  totalConversations,
  period,
}: ConversationTrendsProps) => {
  // Calculate trends
  const midPoint = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, midPoint);
  const secondHalf = data.slice(midPoint);

  const firstHalfAvg =
    firstHalf.reduce((a, b) => a + b.conversations, 0) / firstHalf.length || 0;
  const secondHalfAvg =
    secondHalf.reduce((a, b) => a + b.conversations, 0) / secondHalf.length || 0;

  const trend = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0;
  const isPositive = trend >= 0;

  const peakDay = data.reduce(
    (max, item) => (item.conversations > max.conversations ? item : max),
    data[0] || { name: "", conversations: 0, messages: 0 }
  );

  const avgPerDay = totalConversations / period;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Conversation Trends
          </CardTitle>
          <Badge
            variant={isPositive ? "default" : "destructive"}
            className="gap-1"
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend).toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg/Day</p>
              <p className="font-semibold">{avgPerDay.toFixed(1)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Zap className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Peak Day</p>
              <p className="font-semibold">{peakDay.name || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Peak Volume</p>
              <p className="font-semibold">{peakDay.conversations || 0}</p>
            </div>
          </div>
        </div>

        <div className="h-[300px]">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
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
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="conversations"
                  stroke="hsl(142 70% 45%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorConversations)"
                  name="Conversations"
                />
                <Area
                  type="monotone"
                  dataKey="messages"
                  stroke="hsl(199 89% 48%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMessages)"
                  name="Messages"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No data available for this period
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
