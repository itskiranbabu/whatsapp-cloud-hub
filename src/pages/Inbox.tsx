import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Send, 
  Phone,
  Star,
  Archive,
  CheckCheck,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    starred: true,
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
    starred: false,
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
    starred: false,
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
    starred: true,
  },
  {
    id: 5,
    name: "Lisa Anderson",
    phone: "+1 555-0654",
    lastMessage: "Do you have this product in blue?",
    time: "3h ago",
    unread: 0,
    avatar: "Lisa",
    status: "waiting",
    starred: false,
  },
];

const messages = [
  {
    id: 1,
    type: "inbound",
    text: "Hi! I'm interested in your premium plan. Can you tell me more about it?",
    time: "10:23 AM",
    status: "read",
  },
  {
    id: 2,
    type: "outbound",
    text: "Hello Sarah! Thank you for your interest in our Premium Plan. 🎉\n\nOur Premium Plan includes:\n✅ Unlimited conversations\n✅ Priority support\n✅ Advanced automation\n✅ Custom integrations\n\nWould you like me to set up a demo?",
    time: "10:25 AM",
    status: "read",
  },
  {
    id: 3,
    type: "inbound",
    text: "That sounds great! Yes, I'd love a demo. When are you available?",
    time: "10:30 AM",
    status: "read",
  },
  {
    id: 4,
    type: "outbound",
    text: "Perfect! I have slots available tomorrow at 2 PM or 4 PM EST. Which works better for you?",
    time: "10:32 AM",
    status: "read",
  },
  {
    id: 5,
    type: "inbound",
    text: "2 PM works for me! Thanks for the quick response! I'll place my order now.",
    time: "10:35 AM",
    status: "read",
  },
];

const statusColors = {
  active: "bg-green-500",
  waiting: "bg-amber-500",
  resolved: "bg-gray-400",
};

const Inbox = () => {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageText, setMessageText] = useState("");

  return (
    <DashboardLayout
      title="Inbox"
      subtitle="Manage your customer conversations"
    >
      <div className="flex h-[calc(100vh-180px)] rounded-xl border border-border bg-card overflow-hidden">
        {/* Conversation List */}
        <div className="w-96 border-r border-border flex flex-col">
          {/* Search & Filter */}
          <div className="p-4 border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10 bg-muted/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                All
              </Button>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                Unread (3)
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                Starred
              </Badge>
            </div>
          </div>

          {/* Conversation List */}
          <ScrollArea className="flex-1">
            {conversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={cn(
                  "flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-border/50",
                  selectedConversation?.id === conversation.id
                    ? "bg-primary/5 border-l-4 border-l-primary"
                    : "hover:bg-muted/50"
                )}
                whileHover={{ x: 2 }}
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
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-foreground truncate">
                        {conversation.name}
                      </p>
                      {conversation.starred && (
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      )}
                    </div>
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
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation?.avatar}`}
                />
                <AvatarFallback>{selectedConversation?.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">
                    {selectedConversation?.name}
                  </h3>
                  <span className="status-approved">Active</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedConversation?.phone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Star className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Archive className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex",
                    message.type === "outbound" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] px-4 py-3 rounded-2xl",
                      message.type === "outbound"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <div
                      className={cn(
                        "flex items-center gap-1 mt-1.5",
                        message.type === "outbound"
                          ? "justify-end text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}
                    >
                      <span className="text-xs">{message.time}</span>
                      {message.type === "outbound" && (
                        <CheckCheck className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <Textarea
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="min-h-[48px] max-h-32 resize-none pr-24 bg-background"
                  rows={1}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button className="btn-whatsapp h-12 px-6">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Details Sidebar */}
        <div className="w-80 border-l border-border p-6 hidden xl:block">
          <div className="text-center mb-6">
            <Avatar className="w-20 h-20 mx-auto mb-3">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation?.avatar}`}
              />
              <AvatarFallback>{selectedConversation?.name[0]}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{selectedConversation?.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedConversation?.phone}</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="text-sm font-medium mb-3">Contact Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>sarah@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span>New York, USA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">First Contact</span>
                  <span>Jan 5, 2026</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="text-sm font-medium mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Premium Lead</Badge>
                <Badge variant="secondary">Demo Scheduled</Badge>
                <Badge variant="secondary">Enterprise</Badge>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="text-sm font-medium mb-3">Activity</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Opened email 2 hours ago
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCheck className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">
                    Last message read
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Inbox;
