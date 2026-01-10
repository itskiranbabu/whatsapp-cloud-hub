import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  Users,
  CheckCircle,
  Eye,
  Reply,
} from "lucide-react";

const conversationData = [
  { name: "Jan 1", conversations: 2400, messages: 8900 },
  { name: "Jan 2", conversations: 1398, messages: 6200 },
  { name: "Jan 3", conversations: 3800, messages: 12800 },
  { name: "Jan 4", conversations: 3908, messages: 14200 },
  { name: "Jan 5", conversations: 4800, messages: 16900 },
  { name: "Jan 6", conversations: 3800, messages: 11500 },
  { name: "Jan 7", conversations: 4300, messages: 15800 },
];

const messageTypeData = [
  { name: "Marketing", value: 35, color: "hsl(142 70% 45%)" },
  { name: "Utility", value: 40, color: "hsl(199 89% 48%)" },
  { name: "Authentication", value: 15, color: "hsl(38 92% 50%)" },
  { name: "Service", value: 10, color: "hsl(280 65% 60%)" },
];

const deliveryData = [
  { name: "Mon", sent: 4200, delivered: 4150, read: 3200 },
  { name: "Tue", sent: 3800, delivered: 3750, read: 2900 },
  { name: "Wed", sent: 5100, delivered: 5050, read: 4100 },
  { name: "Thu", sent: 4600, delivered: 4550, read: 3500 },
  { name: "Fri", sent: 3900, delivered: 3850, read: 3000 },
  { name: "Sat", sent: 2800, delivered: 2750, read: 2100 },
  { name: "Sun", sent: 2200, delivered: 2150, read: 1700 },
];

const Analytics = () => {
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
                  <p className="text-2xl font-bold">24,586</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +12.5% from last month
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
                  <p className="text-2xl font-bold">98.5%</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +0.3% from last month
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
                  <p className="text-2xl font-bold">76.2%</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +5.8% from last month
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
                  <p className="text-2xl font-bold">23.4%</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +2.1% from last month
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
          <Tabs defaultValue="7d" className="w-auto">
            <TabsList>
              <TabsTrigger value="24h">24 Hours</TabsTrigger>
              <TabsTrigger value="7d">7 Days</TabsTrigger>
              <TabsTrigger value="30d">30 Days</TabsTrigger>
              <TabsTrigger value="90d">90 Days</TabsTrigger>
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
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={conversationData}>
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
              </div>
            </CardContent>
          </Card>

          {/* Message Types Pie */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Message Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={messageTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {messageTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Delivery Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deliveryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sent" fill="hsl(220 9% 46%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="delivered" fill="hsl(142 70% 45%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="read" fill="hsl(199 89% 48%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default Analytics;
