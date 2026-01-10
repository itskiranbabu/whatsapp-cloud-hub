import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const conversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    phone: "+1 555-0123",
    lastMessage: "Thanks for the quick response! I'll place my order now.",
    time: "2m ago",
    unread: 2,
    avatar: "Sarah",
    status: "active",
  },
  {
    id: 2,
    name: "Michael Chen",
    phone: "+1 555-0456",
    lastMessage: "When will my order be delivered?",
    time: "15m ago",
    unread: 1,
    avatar: "Michael",
    status: "waiting",
  },
  {
    id: 3,
    name: "Emma Williams",
    phone: "+1 555-0789",
    lastMessage: "I'd like to know more about the premium plan.",
    time: "1h ago",
    unread: 0,
    avatar: "Emma",
    status: "resolved",
  },
  {
    id: 4,
    name: "David Kumar",
    phone: "+1 555-0321",
    lastMessage: "Can you help me reset my password?",
    time: "2h ago",
    unread: 0,
    avatar: "David",
    status: "resolved",
  },
];

const statusColors = {
  active: "bg-green-500",
  waiting: "bg-amber-500",
  resolved: "bg-gray-400",
};

export const RecentConversations = () => {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Recent Conversations</CardTitle>
            <p className="text-sm text-muted-foreground">Your latest customer chats</p>
          </div>
        </div>
        <Link
          to="/inbox"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {conversations.map((conversation, index) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="relative">
                <Avatar className="w-11 h-11">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.avatar}`}
                  />
                  <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${statusColors[conversation.status as keyof typeof statusColors]}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground truncate">
                    {conversation.name}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {conversation.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {conversation.lastMessage}
                </p>
              </div>
              {conversation.unread > 0 && (
                <Badge className="bg-primary text-primary-foreground h-5 min-w-5 justify-center">
                  {conversation.unread}
                </Badge>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
