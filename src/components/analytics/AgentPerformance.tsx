import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  Clock,
  MessageSquare,
  TrendingUp,
  Award,
  Timer,
} from "lucide-react";

interface AgentMetrics {
  id: string;
  name: string;
  avatar?: string;
  conversationsHandled: number;
  avgResponseTime: number; // in minutes
  satisfactionScore: number; // 0-100
  messagesCount: number;
  resolvedCount: number;
  status: "online" | "offline" | "busy";
}

// Mock data for demo
const mockAgents: AgentMetrics[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    conversationsHandled: 142,
    avgResponseTime: 2.3,
    satisfactionScore: 94,
    messagesCount: 856,
    resolvedCount: 138,
    status: "online",
  },
  {
    id: "2",
    name: "Priya Patel",
    conversationsHandled: 128,
    avgResponseTime: 1.8,
    satisfactionScore: 97,
    messagesCount: 724,
    resolvedCount: 125,
    status: "online",
  },
  {
    id: "3",
    name: "Amit Kumar",
    conversationsHandled: 98,
    avgResponseTime: 3.1,
    satisfactionScore: 89,
    messagesCount: 542,
    resolvedCount: 92,
    status: "busy",
  },
  {
    id: "4",
    name: "Sneha Reddy",
    conversationsHandled: 112,
    avgResponseTime: 2.5,
    satisfactionScore: 92,
    messagesCount: 634,
    resolvedCount: 108,
    status: "offline",
  },
];

const responseTimeData = [
  { hour: "9AM", time: 2.1 },
  { hour: "10AM", time: 1.8 },
  { hour: "11AM", time: 2.4 },
  { hour: "12PM", time: 3.2 },
  { hour: "1PM", time: 3.8 },
  { hour: "2PM", time: 2.9 },
  { hour: "3PM", time: 2.1 },
  { hour: "4PM", time: 1.9 },
  { hour: "5PM", time: 2.3 },
  { hour: "6PM", time: 2.7 },
];

const agentActivityData = mockAgents.map(agent => ({
  name: agent.name.split(' ')[0],
  conversations: agent.conversationsHandled,
  resolved: agent.resolvedCount,
}));

export const AgentPerformance = () => {
  const avgResponseTime = (mockAgents.reduce((a, b) => a + b.avgResponseTime, 0) / mockAgents.length).toFixed(1);
  const avgSatisfaction = Math.round(mockAgents.reduce((a, b) => a + b.satisfactionScore, 0) / mockAgents.length);
  const totalConversations = mockAgents.reduce((a, b) => a + b.conversationsHandled, 0);
  const totalResolved = mockAgents.reduce((a, b) => a + b.resolvedCount, 0);

  const getStatusColor = (status: AgentMetrics["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "busy":
        return "bg-amber-500";
      case "offline":
        return "bg-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Conversations</p>
                <p className="text-2xl font-bold">{totalConversations}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">{avgResponseTime}m</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolution Rate</p>
                <p className="text-2xl font-bold">{Math.round((totalResolved / totalConversations) * 100)}%</p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Satisfaction</p>
                <p className="text-2xl font-bold">{avgSatisfaction}%</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary" />
              Response Time by Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} unit="m" />
                  <Tooltip formatter={(value) => [`${value} min`, 'Avg Response']} />
                  <Line
                    type="monotone"
                    dataKey="time"
                    stroke="hsl(142 70% 45%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(142 70% 45%)", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Agent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="conversations" fill="hsl(220 9% 46%)" radius={[4, 4, 0, 0]} name="Conversations" />
                  <Bar dataKey="resolved" fill="hsl(142 70% 45%)" radius={[4, 4, 0, 0]} name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Agent Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Conversations</TableHead>
                <TableHead className="text-center">Avg Response</TableHead>
                <TableHead className="text-center">Resolution Rate</TableHead>
                <TableHead>Satisfaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAgents
                .sort((a, b) => b.satisfactionScore - a.satisfactionScore)
                .map((agent, index) => (
                  <motion.tr
                    key={agent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {index < 3 && (
                            <div className={`absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-yellow-400 text-yellow-900' :
                              index === 1 ? 'bg-gray-300 text-gray-700' :
                              'bg-amber-600 text-amber-100'
                            }`}>
                              {index + 1}
                            </div>
                          )}
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={agent.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.name}`} />
                            <AvatarFallback>{agent.name[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                        <span className="font-medium">{agent.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Badge
                          variant="secondary"
                          className="gap-1.5 capitalize"
                        >
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                          {agent.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {agent.conversationsHandled}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={agent.avgResponseTime <= 2 ? "default" : agent.avgResponseTime <= 3 ? "secondary" : "destructive"}>
                        {agent.avgResponseTime}m
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {Math.round((agent.resolvedCount / agent.conversationsHandled) * 100)}%
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={agent.satisfactionScore} className="h-2 w-20" />
                        <span className="text-sm font-medium">{agent.satisfactionScore}%</span>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
