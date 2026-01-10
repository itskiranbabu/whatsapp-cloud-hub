import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Download,
  Calendar,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  Eye,
  Reply,
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

const Analytics = () => {
  const [period, setPeriod] = useState(7);
  const { analytics, isLoading } = useAnalytics(period);

  if (isLoading || !analytics) {
    return (
      <DashboardLayout title="Analytics" subtitle="Track your messaging performance and insights">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-80 col-span-2" />
            <Skeleton className="h-80" />
          </div>
          <Skeleton className="h-80" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Track your messaging performance and insights"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="metric-card-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Conversations</p>
                  <p className="text-2xl font-bold">{analytics.totalConversations.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last {period} days
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-success">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivery Rate</p>
                  <p className="text-2xl font-bold">{analytics.deliveryRate}%</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Messages delivered
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-info">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Read Rate</p>
                  <p className="text-2xl font-bold">{analytics.readRate}%</p>
                  <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Messages read
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="metric-card-warning">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reply Rate</p>
                  <p className="text-2xl font-bold">{analytics.replyRate}%</p>
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <Reply className="w-3 h-3" />
                    Inbound messages
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Reply className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <Tabs value={String(period)} onValueChange={(v) => setPeriod(Number(v))} className="w-auto">
            <TabsList>
              <TabsTrigger value="1">24 Hours</TabsTrigger>
              <TabsTrigger value="7">7 Days</TabsTrigger>
              <TabsTrigger value="30">30 Days</TabsTrigger>
              <TabsTrigger value="90">90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Custom Range
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations Chart */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Conversation Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {analytics.trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.trendData}>
                      <defs>
                        <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(142 70% 45%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(142 70% 45%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="conversations"
                        stroke="hsl(142 70% 45%)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorConv)"
                      />
                      <Area
                        type="monotone"
                        dataKey="messages"
                        stroke="hsl(199 89% 48%)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorMsg)"
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

          {/* Message Types Pie */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Template Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {analytics.messageTypeData.some(d => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.messageTypeData.filter(d => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {analytics.messageTypeData.filter(d => d.value > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No templates created yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Delivery Performance (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {analytics.deliveryData.some(d => d.sent > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.deliveryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sent" fill="hsl(220 9% 46%)" radius={[4, 4, 0, 0]} name="Sent" />
                    <Bar dataKey="delivered" fill="hsl(142 70% 45%)" radius={[4, 4, 0, 0]} name="Delivered" />
                    <Bar dataKey="read" fill="hsl(199 89% 48%)" radius={[4, 4, 0, 0]} name="Read" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No delivery data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default Analytics;
