import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Clock,
  Loader2,
  MessageSquare,
  Check,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConversations, useMessages } from "@/hooks/useConversations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";
import { SmartReplyPanel } from "@/components/inbox/SmartReplyPanel";
import { HelpTooltip } from "@/components/help/HelpTooltip";
import { TypingIndicator } from "@/components/inbox/TypingIndicator";
import { OnlineStatus } from "@/components/inbox/OnlineStatus";
import { useSimulatedPresence } from "@/hooks/usePresence";
import { InboxPageHelp } from "@/components/help/PageHelpComponents";

type Conversation = Tables<"conversations">;
type Message = Tables<"messages">;
type Contact = Tables<"contacts">;

interface ConversationWithContact extends Conversation {
  contact: Contact;
}

const statusColors: Record<string, string> = {
  open: "bg-green-500",
  pending: "bg-amber-500",
  resolved: "bg-gray-400",
  expired: "bg-red-400",
};

const Inbox = () => {
  const { conversations, isLoading: conversationsLoading } = useConversations();
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithContact | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");
  const [showSmartReply, setShowSmartReply] = useState(true);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Presence tracking for selected conversation
  const { contactPresence } = useSimulatedPresence(selectedConversation?.id || null);
  
  const { messages, isLoading: messagesLoading, sendMessage, refetch: refetchMessages } = useMessages(
    selectedConversation?.id || null
  );

  // Get the last inbound message for smart replies
  const lastInboundMessage = useMemo(() => {
    return messages.filter(m => m.direction === 'inbound').pop();
  }, [messages]);

  // Auto-select first conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0] as ConversationWithContact);
    }
  }, [conversations, selectedConversation]);

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!selectedConversation?.id) return;

    const channel = supabase
      .channel(`messages-${selectedConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          console.log("Real-time message event:", payload);
          // Refetch messages to get latest data
          refetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation?.id, refetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    try {
      await sendMessage.mutateAsync({
        conversationId: selectedConversation.id,
        contactId: selectedConversation.contact_id,
        content: messageText.trim(),
      });
      setMessageText("");
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const c = conv as ConversationWithContact;
    const matchesSearch =
      c.contact?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contact?.phone?.includes(searchQuery);
    
    if (filter === "unread") return matchesSearch && (c.unread_count || 0) > 0;
    return matchesSearch;
  });

  const getMessageStatus = (message: Message) => {
    if (message.status === "read") return <CheckCheck className="w-3.5 h-3.5 text-blue-500" />;
    if (message.status === "delivered") return <CheckCheck className="w-3.5 h-3.5" />;
    if (message.status === "sent") return <Check className="w-3.5 h-3.5" />;
    if (message.status === "failed") return <span className="text-xs text-destructive">Failed</span>;
    return <Clock className="w-3.5 h-3.5" />;
  };

  return (
    <DashboardLayout
      title="Inbox"
      subtitle="Manage your customer conversations"
    >
      {/* Help Button */}
      <div className="flex justify-end mb-4">
        <InboxPageHelp />
      </div>
      <div className="flex h-[calc(100vh-220px)] rounded-xl border border-border bg-card overflow-hidden">
        {/* Conversation List */}
        <div className="w-96 border-r border-border flex flex-col">
          {/* Search & Filter */}
          <div className="p-4 border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={filter === "all" ? "default" : "outline"} 
                size="sm" 
                className="gap-1.5"
                onClick={() => setFilter("all")}
              >
                <Filter className="w-3.5 h-3.5" />
                All
              </Button>
              <Badge 
                variant={filter === "unread" ? "default" : "secondary"} 
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => setFilter("unread")}
              >
                Unread ({conversations.filter((c) => (c.unread_count || 0) > 0).length})
              </Badge>
            </div>
          </div>

          {/* Conversation List */}
          <ScrollArea className="flex-1">
            {conversationsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No conversations yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Messages will appear here when customers contact you
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const conv = conversation as ConversationWithContact;
                return (
                  <motion.div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={cn(
                      "flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-border/50",
                      selectedConversation?.id === conv.id
                        ? "bg-primary/5 border-l-4 border-l-primary"
                        : "hover:bg-muted/50"
                    )}
                    whileHover={{ x: 2 }}
                  >
                    <div className="relative">
                      <Avatar className="w-11 h-11">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.contact?.name || conv.contact?.phone}`}
                        />
                        <AvatarFallback>
                          {conv.contact?.name?.[0] || conv.contact?.phone?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${statusColors[conv.status || "open"]}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground truncate">
                          {conv.contact?.name || conv.contact?.phone || "Unknown"}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {conv.last_message_at
                            ? format(new Date(conv.last_message_at), "h:mm a")
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {conv.contact?.phone}
                      </p>
                    </div>
                    {(conv.unread_count || 0) > 0 && (
                      <Badge className="bg-primary text-primary-foreground h-5 min-w-5 justify-center">
                        {conv.unread_count}
                      </Badge>
                    )}
                  </motion.div>
                );
              })
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${(selectedConversation as ConversationWithContact).contact?.name || (selectedConversation as ConversationWithContact).contact?.phone}`}
                      />
                      <AvatarFallback>
                        {(selectedConversation as ConversationWithContact).contact?.name?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0">
                      <OnlineStatus 
                        isOnline={contactPresence.isOnline} 
                        lastSeen={contactPresence.lastSeen}
                        size="sm"
                      />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {(selectedConversation as ConversationWithContact).contact?.name || 
                         (selectedConversation as ConversationWithContact).contact?.phone || "Unknown"}
                      </h3>
                      <Badge variant="outline" className="text-xs capitalize">
                        {selectedConversation.status}
                      </Badge>
                    </div>
                    <OnlineStatus 
                      isOnline={contactPresence.isOnline} 
                      lastSeen={contactPresence.lastSeen}
                      showLabel
                      size="sm"
                    />
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
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No messages yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start the conversation by sending a message
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex",
                          message.direction === "outbound" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] px-4 py-3 rounded-2xl",
                            message.direction === "outbound"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div
                            className={cn(
                              "flex items-center gap-1 mt-1.5",
                              message.direction === "outbound"
                                ? "justify-end text-primary-foreground/70"
                                : "text-muted-foreground"
                            )}
                          >
                            <span className="text-xs">
                              {message.created_at
                                ? format(new Date(message.created_at), "h:mm a")
                                : ""}
                            </span>
                            {message.direction === "outbound" && getMessageStatus(message)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {/* Typing Indicator */}
                    <AnimatePresence>
                      {contactPresence.isTyping && (
                        <TypingIndicator 
                          contactName={(selectedConversation as ConversationWithContact).contact?.name || undefined} 
                        />
                      )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Smart Reply Panel */}
              <SmartReplyPanel
                customerMessage={lastInboundMessage?.content || null}
                conversationHistory={messages.map(m => ({ direction: m.direction, content: m.content }))}
                contactName={(selectedConversation as ConversationWithContact).contact?.name || null}
                onSelectReply={(text) => setMessageText(text)}
                isVisible={showSmartReply && !!lastInboundMessage}
              />

              {/* Message Input */}
              <div className="p-4 border-t border-border bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1.5"
                    onClick={() => setShowSmartReply(!showSmartReply)}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {showSmartReply ? "Hide" : "Show"} AI Suggestions
                  </Button>
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <Textarea
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleKeyPress}
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
                  <Button 
                    className="btn-whatsapp h-12 px-6"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendMessage.isPending}
                  >
                    {sendMessage.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Select a conversation</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Contact Details Sidebar */}
        {selectedConversation && (
          <div className="w-80 border-l border-border p-6 hidden xl:block">
            <div className="text-center mb-6">
              <Avatar className="w-20 h-20 mx-auto mb-3">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${(selectedConversation as ConversationWithContact).contact?.name || (selectedConversation as ConversationWithContact).contact?.phone}`}
                />
                <AvatarFallback>
                  {(selectedConversation as ConversationWithContact).contact?.name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">
                {(selectedConversation as ConversationWithContact).contact?.name || "Unknown"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {(selectedConversation as ConversationWithContact).contact?.phone}
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/50">
                <h4 className="text-sm font-medium mb-3">Contact Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span>{(selectedConversation as ConversationWithContact).contact?.email || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="capitalize">{selectedConversation.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Session Active</span>
                    <span>{selectedConversation.is_session_active ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>

              {(selectedConversation as ConversationWithContact).contact?.tags && 
               (selectedConversation as ConversationWithContact).contact.tags!.length > 0 && (
                <div className="p-4 rounded-xl bg-muted/50">
                  <h4 className="text-sm font-medium mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedConversation as ConversationWithContact).contact.tags!.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-muted/50">
                <h4 className="text-sm font-medium mb-3">Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Last message: {selectedConversation.last_message_at
                        ? format(new Date(selectedConversation.last_message_at), "MMM d, h:mm a")
                        : "Never"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Inbox;
